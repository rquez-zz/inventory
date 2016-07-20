const _ = require('lodash');

module.exports = function($scope, $http, $window, $timeout, $mdSidenav, $mdDialog) {

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

    // Fill Dashboard
    getCategories().then(categories => {
        $scope.categories = categories;
        $scope.selectedCategory = categories[0];
        getItems(categories[0]).then(items => {
            $scope.items = items;
        });
    });

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
