const _ = require('lodash');

module.exports = function($scope, $http, $window, $timeout, $mdSidenav, $mdDialog, $state) {

    const buildDelayedToggler = (navID) => {
        return debounce(() => {
            $mdSidenav(navID)
                .toggle()
                .then(() => {});
        }, 200);
    };

    const debounce = (func, wait, context) => {
        var timer;
        return () => {
            var context = $scope,
            args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(() => {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    };

    const buildToggler = (navID) => {
        return () => {
            $mdSidenav(navID)
                .toggle()
                .then(() => { });
        };
    };

    const getCategories = () => {
        const req = {
            method: 'GET',
            url: '/category',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    const getItems = (category) => {
        const req = {
            method: 'GET',
            url: '/category/' + category._id,
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    const getUser = () => {
        const req = {
            method: 'GET',
            url: '/user',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    const updateUser = (data) => {
        const req = {
            method: 'PUT',
            url: '/user',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            },
            data: data
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    var currentUser;

    // Fill Dashboard
    getCategories().then(categories => {
        $scope.categories = categories;
        $scope.selectedCategory = categories[0];
        getItems(categories[0]).then(items => {
            $scope.items = items;
        });
    });

    // Get User Info
    getUser().then(user => {
        currentUser = user;
        $scope.profileEmail = user.email;
        $scope.profileUsername = user.username;
        $scope.notificationsOn = user.notificationsOn;
    });

    // Update Notifications
    $scope.updateNotifications = () => {
        var updateUser = {
            email: currentUser.email,
            notificationsOn: $scope.notificationsOn
        };

        // Send update
        updateUser(updateUser).then(()=>{
            // Update local model
            currentUser.notificationsOn = $scope.notificationsOn;
        });
    };

    // Change Password
    $scope.updatePassword = (event) => {

        console.log(currentUser.googleOnly);
        // Update password dialog
        $mdDialog.show({
            templateUrl: '/views/partials/update-password.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { googleOnly: currentUser.googleOnly },
            controller: UpdatePasswordController
        }).then(item => {

            // Remove token and go to login
            $window.sessionStorage.token = undefined;
            $state.go('login');
        }, error => {
            //TODO: error deleting user
        });
    };

    // Delete Account
    $scope.deleteAccount = () => {

        // Confirm user deletion
        $mdDialog.show($mdDialog.confirm()
            .title('Are you sure you want to delete your profile?')
            .textContent('All items will be deleted.')
            .ariaLabel('Delete Profile')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Cancel')).then(() => {

            const deleteUser = () => {
                const req = {
                    method: 'DELETE',
                    url: '/user',
                    skipAuthorization: true,
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.token
                    }
                };

                return $http(req).then(response => {
                    return response.data;
                }, error => {
                    $scope.status = error.data.message;
                });
            };

            deleteUser().then(() => {

                // Delete token and go to the login screen
                $window.sessionStorage.token = undefined;
                $state.go('login');
            }, error => {
                //TODO: error deleting user
            });
        });
    };

    // Logout
    $scope.logout = () => {

        // Delete token and go to the login screen
        $window.sessionStorage.token = undefined;
        $state.go('login');
    };

    // Update Email
    $scope.updateEmail = (event) => {

        // Check if user is tied to google account
        if (currentUser.googleOnly === true) {
            $mdDialog.show($mdDialog.alert()
                .title('Update Email')
                .clickOutsideToClose(true)
                .textContent('Your email is tied to a google account, please create a password if you would like to change your email.')
                .ariaLabel('Update Email')
                .ok('Ok')).then( () => {
                $scope.profileEmail = currentUser.email;
            });
        } else {

            // Confirm email update
            $mdDialog.show($mdDialog.confirm()
                .title('Would you like to update your email to ' + $scope.profileEmail + '?')
                .textContent('You will be logged out after updating.')
                .ariaLabel('Update Email')
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel')).then(() => {

                const data = {
                    email: $scope.profileEmail,
                    notificationsOn: currentUser.notificationsOn
                };

                // Update user
                updateUser(data).then(user => {

                    // Remove token and logout
                    $window.sessionStorage.token = undefined;
                    $state.go('login');
                }, error => {
                    // TODO: Error updating user
                });

            }, () => {

                // User canceled, revert email
                $scope.profileEmail = currentUser.email;
            });
        }
    };

    // Get Items
    $scope.selectCategory = (category) => {

        // Check if category is shared to a user
        if (category.sharedTo.length > 0)
            $scope.isSharedTo = true;
        else
            $scope.isSharedTo = false;

        // Check if category is shared
        if (category.sharedFrom) {

            $scope.isSharedFrom = true;

            const getSharedItems = () => {
                const req = {
                    method: 'GET',
                    url: '/category/' + category._id + '/share/' + category.sharedFrom,
                    skipAuthorization: true,
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.token
                    }
                };

                return $http(req).then(response => {
                    return response.data;
                }, error => {
                    $scope.status = error.data.message;
                });
            };

            getSharedItems().then(items => {
                $scope.items = items;
                $scope.selectedCategory = category;
            });
        } else {

            $scope.isSharedFrom = false;

            getItems(category).then(items => {
                $scope.items = items;
                $scope.selectedCategory = category;
            });
        }
    };

    // Add Item
    $scope.addItem = (event) => {

        // Show add item dialog
        $mdDialog.show({
            templateUrl: '/views/partials/create-item.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { category: $scope.selectedCategory },
            controller: CreateItemController
        }).then(item => {

            // Push new item to model
            $scope.items.push(item);
        }, error => {
            //TODO: Show error result
        });
    };

    // Delete Item
    $scope.deleteItem = (item, event) => {

        // Show delete item dialog
        $mdDialog.show($mdDialog.confirm()
            .title('Are you sure you want to delete this item?')
            .ariaLabel('Delete Item')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Cancel')).then(() => {

            const deleteItem = () => {
                const req = {
                    method: 'DELETE',
                    url: '/item/' + item._id,
                    skipAuthorization: true,
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.token
                    }
                };

                return $http(req).then(response => {
                    return item;
                }, error => {
                    $scope.status = error.data.message;
                });
            };

            deleteItem(item).then((deletedItem) => {

                // Filter out the deleted item
                $scope.items = _.filter((item) => {
                    return item._id !== deletedItem._id;
                });
            }, error => {
                //TODO: Show error result
            });
        });
    };

    // Edit Item
    $scope.editItem = (item, event) => {

        // Show edit item dialog
        $mdDialog.show({
            templateUrl: '/views/partials/edit-item.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { item: angular.copy(item), categories: $scope.categories },
            controller: EditItemController
        }).then(editedItem => {

            // Update item
            const i = _.findIndex($scope.items, { '_id': editedItem._id });
            $scope.items[i] = editedItem;
        }, error => {
            //TODO: Show error result
        });
    };

    // Create New Category
    $scope.addCategory = (event) => {

        // Show create category dialog
        $mdDialog.show({
            templateUrl: '/views/partials/create-category.html',
            clickOutsideToClose: true,
            targetEv: event,
            controller: CreateCategoryController
        }).then(category => {

            // Push new category to model
            $scope.categories.push(category);
        }, error => {
            //TODO: Show error result
        });
    };

    // Share Category
    $scope.shareCategory = (event) => {

        // Share dialog
        $mdDialog.show({
            templateUrl: '/views/partials/create-share.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { category: $scope.selectedCategory },
            controller: CreateShareController
        }).then(() => {

            // Refresh categories
            getCategories().then(categories => {

                // Rebind categories
                $scope.categories = categories;
                $scope.selectedCategory = _.find(categories, { _id: $scope.selectedCategory._id });

                // Mark category as shared
                $scope.isSharedTo = true;

                // Show successful result
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Share Successful')
                        .textContent('Category was successfully shared to user.')
                        .ariaLabel('Share Success')
                        .ok('Ok'));
            });
        }, error => {
            // TODO: Show error result
        });
    };

    // Delete Share
    $scope.deleteShare = (event) => {

        // Confirm unshare
        $mdDialog.show($mdDialog.confirm()
            .title('Are you sure you want to unshare this category?')
            .textContent('All shared users will lose access.')
            .ariaLabel('Unshare Category')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Cancel')).then(() => {

            const deleteShare = (friendId) => {

                const req = {
                    method: 'DELETE',
                    url: '/category/' + $scope.selectedCategory._id + '/share/' + friendId,
                    skipAuthorization: true,
                    headers: {
                        'Authorization': 'Bearer ' + $window.sessionStorage.token
                    }
                };

                return $http(req).then(response => {
                    return response.data;
                }, error => {
                    $scope.status = error.data.message;
                });
            };

            // Unshare all the shared users
            Promise.all($scope.selectedCategory.sharedTo.map(deleteShare)).then(() => {
                getCategories().then(categories => {

                    // Refresh category
                    $scope.categories = categories;
                    $scope.selectedCategory = _.find(categories, { _id: $scope.selectedCategory._id });
                    $scope.isSharedTo = false;
                });
            }, error => {
                // TODO: Error deleting shares
            });
        });
    };

    $scope.toggleProfile = buildDelayedToggler('profile');

    $scope.isOpenProfile = () => {
        return $mdSidenav('profile').isOpen();
    };

    // Close Sidenav
    $scope.closeProfile = () => {
        $mdSidenav('profile').close();
    };

};

function CreateCategoryController ($scope, $window, $http, $mdDialog) {

    $scope.create = () => {
        const req = {
            method: 'POST',
            url: '/category',
            data: {
                name: $scope.name
            },
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data);
        }, error => {
            $mdDialog.cancel(error);
            console.log('Unhandled error');
            console.log(error);
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function EditItemController ($scope, $window, $http, $mdDialog, item, categories) {

    $scope.item = item;
    $scope.item.reminder.date = new Date(item.reminder.date);
    $scope.categories = categories;
    $scope.selectedCategory = _.find($scope.categories, {_id: item.categoryId });

    $scope.edit = () => {
        const req = {
            method: 'PUT',
            url: '/item/' + item._id,
            data: {
                name: $scope.item.name,
                quantity: $scope.item.quantity,
                categoryId: $scope.selectedCategory._id,
                categoryName: $scope.selectedCategory.name,
                comments: $scope.item.comments,
                reminder: {
                    date: $scope.item.reminder.date,
                    message: $scope.item.reminder.message
                }
            },
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data);
        }, error => {
            $mdDialog.cancel(error);
            console.log('Unhandled error');
            console.log(error);
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function CreateShareController ($scope, $window, $http, $mdDialog, category) {

    $scope.create = () => {
        const req = {
            method: 'POST',
            url: '/category/' + category._id + '/share',
            data: {
                friendUsername: $scope.targetUsername,
                categoryName: category.name
            },
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data);
        }, error => {

            // If user enters a user that doesn't exist
            if (error.status === 404) {
                $scope.result = 'User not found';
            } else {
                $mdDialog.cancel(error);
                console.log('Unhandled error');
                console.log(error);
            }
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function CreateItemController ($scope, $window, $http, $mdDialog, category) {

    $scope.create = () => {
        const req = {
            method: 'POST',
            url: '/item',
            data: {
                name: $scope.name,
                quantity: $scope.quantity,
                categoryId: category._id,
                categoryName: category.name,
                comments: $scope.comments,
                reminder: {
                    date: $scope.reminder,
                    message: $scope.message
                }
            },
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data);
        }, error => {
            $mdDialog.cancel(error);
            console.log('Unhandled error');
            console.log(error);
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function UpdatePasswordController ($scope, $window, $http, $mdDialog, googleOnly) {

    $scope.updatePassword = () => {

        if ($scope.newPassword !== $scope.confirmPassword && !googleOnly) {
            $scope.passwordStatus = 'Passwords do not match.';
        } else {

            const reqAuth = {
                method: 'POST',
                url: '/user/password-confirm',
                data: {
                    password: $scope.currentPassword || 'none'
                },
                skipAuthorization: true,
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                }
            };

            $http(reqAuth).then(response => {

                const req = {
                    method: 'POST',
                    url: '/user/password',
                    data: {
                        password: $scope.newPassword
                    },
                    skipAuthorization: true,
                    headers: {
                        'Authorization': 'Bearer ' + response.data.jwt
                    }
                };

                $http(req).then(response => {
                    $mdDialog.hide(response.data);
                }, error => {
                    console.log('Unhandled error');
                    console.log(error);
                });
            }, error => {
                $mdDialog.cancel(error);
                console.log('Unhandled error');
                console.log(error);
            });
        }
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}
