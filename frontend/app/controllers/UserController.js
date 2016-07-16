module.exports = ($scope, $window, $http) => {

    $scope.create = {
        // Create Signed In Google User
        google: () => {
            const req = {
                method: 'POST',
                url: '/user/auth',
                skipAuthorization: true,
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                },
                data: {
                    username: $scope.create.google.username
                }
            };

            $http(req).then(response => {
                console.log(response.data);
            }, error => {
                $scope.create.google.result = error.data.message;
            });
        },
        // Create User With Username/Password
        normal: () => {
            const req = {
                method: 'POST',
                url: '/user',
                data: {
                    username: $scope.create.normal.username,
                    password: $scope.create.normal.password,
                    email: $scope.create.normal.email
                }
            };

            $http(req).then(response => {
                console.log(response.data);
            }, error => {
                $scope.create.normal.result = error.data.message;
            });
        }
    };

    $scope.update = {
        // Update Password
        password: () => {
            const req = {
                method: 'POST',
                url: '/user/password',
                data: {
                    password: $scope.update.password.password
                },
                skipAuthorization: true,
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                }
            };
            $http(req).then(response => {
                $window.sessionStorage.jwt = response.data.jwt
            }, error => {
                $scope.update.password.result = error.data.message;
            });
        },
        // Update User
        user: () => {
            const req = {
                method: 'PUT',
                url: '/user',
                data: {
                    email: $scope.update.user.email,
                    notificationsOn: $scope.update.user.notificationsOn
                },
                skipAuthorization: true,
                headers: {
                    'Authorization': 'Bearer ' + $window.sessionStorage.token
                }
            };
            $http(req).then(response => {
                console.log(response.data);
            }, error => {
                $scope.update.password.result = error.data.message;
            });
        }
    };

    // Get User
    $scope.get = () => {
        const req = {
            method: 'GET',
            url: '/user',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };
        $http(req).then(response => {
            console.log(response.data);
        }, error => {
            $scope.get.result = error.data.message;
        });
    };

    // Delete User
    $scope.delete = () => {
        const req = {
            method: 'DELETE',
            url: '/user',
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + $window.sessionStorage.token
            }
        };
        $http(req).then(response => {
            console.log(response.data);
        }, error => {
            $scope.delete.result = error.data.message;
        });
    };
};

