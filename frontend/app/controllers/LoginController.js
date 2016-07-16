app.module('app').controller('AuthController', ($scope, $window, $auth, $http) => {

    $scope.login = {
        // Default Login Using Username/Password
        normal: () => {
            const req = {
                method: 'POST',
                url: '/login',
                data: {
                    username: $scope.login.username,
                    password: $scope.login.password
                }
            };

            $http(req).then(response => {
                $window.sessionStorage.token = response.jwt;
            }, (error) => {
                $scope.login.result = error.data.message;
            });
        },
        // Google Authentication Login
        google: () => {
            $auth.authenticate('google').then((response) => {
                $window.sessionStorage.token = response.data.jwt;
            }, (error) => {
                $scope.login.result = error.data.message;
            });
        }
    };

    // Reset Password, Email Workflow
    $scope.forgotPassword = () => {
        const req = {
            method: 'POST',
            url: '/reset-password',
            data: {
                email: $scope.forgotPassword.email
            }
        };

        $http(req).then(res => {
            $scope.forgotPassword.result = 'Email Sent!';
        }, (error) => {
            $scope.forgotPassword.result = error.data.message;
        });
    };
};
