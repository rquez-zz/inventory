module.exports = function($scope, $window, $auth, $http, $state, $mdDialog) {

    // Login
    $scope.login = {
        // Using Username/Password
        normal: () => {
            const req = {
                method: 'POST',
                url: '/login',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            };

            $http(req).then(response => {

                // Store JWT
                $window.sessionStorage.token = response.data.jwt;

                // Go to Dashboard
                $state.go('dashboard');
            }, (error) => {

                $scope.status = "Invalid username/password entered.";
            });
        },

        // Using Google Authentication
        google: (event) => {
            $auth.authenticate('google').then((response) => {
                if (response.data.jwt) {

                    // Store JWT
                    $window.sessionStorage.token = response.data.jwt;

                    // Go to Dashboard
                    $state.go('dashboard');

                } else {

                    // User hasn't been created, choose username
                    $mdDialog.show({
                        templateUrl: '/views/partials/create-user-google.html',
                        clickOutsideToClose: true,
                        targetEv: event,
                        locals: { jwt: response.data.email },
                        controller: CreateGoogleUserController
                    })
                    .then((jwt) => {

                        // Store JWT
                        $window.sessionStorage.token = jwt;

                        // Go to Dashboard
                        $state.go('dashboard');
                    });
                }

            }, (error) => {
                $scope.status = "Error authenticating with google.";
            });
        }
    };

    // Create User
    $scope.create = (event) => {
        $mdDialog.show({
            templateUrl: '/views/partials/create-user-normal.html',
            clickOutsideToClose: true,
            targetEv: event,
            controller: CreateUserController
        })
        .then((status) => {
            // Store JWT
            $window.sessionStorage.token = status;

            // Go to Dashboard
            $state.go('dashboard');

        }, error => {

            $scope.status = "Error registering a user.";
        });
    };

    // Forgot Password, get user email
    $scope.forgot = (event) => {
        $mdDialog.show({
            templateUrl: '/views/partials/forgot-password.html',
            clickOutsideToClose: true,
            targetEv: event,
            controller: ForgotPasswordController
        })
        .then((status) => {
            $scope.status = 'Email Sent!';
        });
    };
};

function CreateGoogleUserController($scope, $window, $http, $mdDialog, jwt) {

    // Create User With Username/Password
    $scope.create = () => {
        const req = {
            method: 'POST',
            url: '/user/auth',
            data: {
                username: $scope.username,
                email: $scope.email
            },
            skipAuthorization: true,
            headers: {
                'Authorization': 'Bearer ' + jwt
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data.jwt);
        }, error => {
            $scope.result = error.data.message;
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function ForgotPasswordController($scope, $http, $mdDialog) {

    $scope.send = () => {
        const req = {
            method: 'POST',
            url: '/reset-password',
            data: {
                email: $scope.email
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.status);
        }, (error) => {
            $scope.status = error.data.message;
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}

function CreateUserController($scope, $http, $mdDialog) {

    // Create User With Username/Password
    $scope.create = () => {
        const req = {
            method: 'POST',
            url: '/user',
            data: {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            }
        };

        $http(req).then(response => {
            $mdDialog.hide(response.data.jwt);
        }, error => {
            $scope.status = error.data.message;
        });
    };

    $scope.cancel = () => {
        $mdDialog.cancel();
    };
}
