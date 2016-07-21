const _ = require('lodash');

module.exports = function($scope, $http, $window, $timeout, $mdSidenav, $mdDialog, $state) {

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

    const updatePasswordAuth = (password) => {
        const req = {
            method: 'POST',
            url: '/user/password-confirm',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            },
            data: { password: password }
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    const updatePassword = (jwt, password) => {
        const req = {
            method: 'POST',
            url: '/user/password',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + jwt
            },
            data: { password: password }
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

    const updateNotifications = (updateUser) => {
        const req = {
            method: 'PUT',
            url: '/user',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            },
            data: updateUser
        };

        return $http(req).then(response => {
            return response.data;
        }, error => {
            $scope.status = error.data.message;
        });
    };

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

    const deleteItem = (item) => {
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
        updateNotifications(updateUser).then(()=>{
            currentUser.notificationsOn = $scope.notificationsOn;
        });
    };

    // Change Password
    $scope.updatePassword = (event) => {
        $mdSidenav('profile').close();
        $mdDialog.show({
            templateUrl: '/views/partials/update-password.html',
            clickOutsideToClose: true,
            targetEv: event,
            controller: UpdatePasswordController
        }).then(item => {
            $window.sessionStorage.token = undefined;
            $state.go('login');
        }, error => {
        });
    };

    // Delete Account
    $scope.deleteAccount = () => {
        $mdDialog.show($mdDialog.confirm()
            .title('Are you sure you want to delete your profile?')
            .textContent('All items will be deleted.')
            .ariaLabel('Delete Profile')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Cancel')).then(() => {

            deleteUser().then(() => {
                $window.sessionStorage.token = undefined;
                $state.go('login');
            });
        });
    };

    // Logout
    $scope.logout = () => {
        $window.sessionStorage.token = undefined;
        $state.go('login');
    };

    // Update Email
    $scope.updateEmail = (event) => {

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
            const confirm = $mdDialog.confirm()
                .title('Would you like to update your email to ' + $scope.profileEmail + '?')
                .textContent('You will be logged out after updating.')
                .ariaLabel('Update Email')
                .targetEvent(event)
                .ok('Ok')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(() => {
                updateUser({ email: $scope.profileEmail, notificationsOn: currentUser.notificationsOn }).then(user => {
                    $window.sessionStorage.token = undefined;
                    $state.go('login');
                });
            }, () => {
                $scope.profileEmail = currentUser.email;
            });
        }
    };

    // Get Items
    $scope.select = (category) => {
        getItems(category).then(items => {
            $scope.items = items;
            $scope.selectedCategory = category;
        });
    };

    // Add Item
    $scope.addItem = (event) => {
        $mdDialog.show({
            templateUrl: '/views/partials/create-item.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { category: $scope.selectedCategory },
            controller: CreateItemController
        }).then(item => {
            $scope.items.push(item);
        }, error => {
        });
    };

    // Delete Item
    $scope.deleteItem = (item, event) => {
        $mdDialog.show($mdDialog.confirm()
            .title('Are you sure you want to delete this item?')
            .ariaLabel('Delete Item')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Cancel')).then(() => {

            deleteItem(item).then((deletedItem) => {
                $scope.items = _.filter((item) => {
                    return item._id !== deletedItem._id;
                });
            });
        });
    };

    // Edit Item
    $scope.editItem = (item, event) => {
        $mdDialog.show({
            templateUrl: '/views/partials/edit-item.html',
            clickOutsideToClose: true,
            targetEv: event,
            locals: { item: angular.copy(item), categories: $scope.categories },
            controller: EditItemController
        }).then(editedItem => {
            getItems($scope.selectedCategory).then(items => {
                $scope.items = items;
            });
        }, error => {
        });
    };

    // Create New Category
    $scope.addCategory = (event) => {
        $mdDialog.show({
            templateUrl: '/views/partials/create-category.html',
            clickOutsideToClose: true,
            targetEv: event,
            controller: CreateCategoryController
        }).then(category => {
            $scope.categories.push(category);
        }, error => {
        });
    };

    $scope.toggleProfile = buildDelayedToggler('profile');

    $scope.isOpenProfile = () => {
        return $mdSidenav('profile').isOpen();
    };

    $scope.closeProfile = () => {
        $mdSidenav('profile').close();
    };

    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        }, 200);
    }

    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
            args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        };
    }
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
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function UpdatePasswordController ($scope, $window, $http, $mdDialog) {

    $scope.updatePassword = () => {

        if ($scope.newPassword !== $scope.confirmPassword) {
            $scope.passwordStatus = 'Passwords do not match.';
        } else {

            const reqAuth = {
                method: 'POST',
                url: '/user/password-confirm',
                data: {
                    password: $scope.currentPassword
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
                });
            }, error => {
                $mdDialog.cancel(error);
            });
        }
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}
