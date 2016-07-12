module.exports = ($scope, $http, BASE) => {
    $scope.loginResponse = '';
    $scope.login = () => {
        $http({
                method: 'POST',
                url: BASE + '/login',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            }).then((res) => {
                $scope.loginResponse = res.data;
                console.log(res);
            });
    };
};

