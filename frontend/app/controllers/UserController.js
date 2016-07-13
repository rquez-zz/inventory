module.exports = ($scope, User) => {

    $scope.create = () => {
        var user = new User();
        user.username = $scope.username;
        user.password = $scope.password;
        user.email = $scope.email;

        User.save(user, (createdUser) => {
            $scope.createUserResponse = createdUser;
            console.log(createdUser);
        });
    };
};

