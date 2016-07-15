module.exports = ($scope, $window, $auth, $http, Login) => {

    $scope.loginResponse = '';

    $scope.login = () => {
        var login = new Login();
        login.username = $scope.username;
        login.password = $scope.password;

        Login.save(login, (data) => {
            $window.sessionStorage.token = data.jwt;
        });
    };

    $scope.loginGoogle = () => {
        $auth.authenticate('google').then((response) => {
            $window.sessionStorage.token = response.data.jwt;
        });
    };
};

