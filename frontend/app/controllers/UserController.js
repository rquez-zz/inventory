module.exports = function($scope, $window, $http) {

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

