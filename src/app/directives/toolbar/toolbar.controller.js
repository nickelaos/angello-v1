ToolbarController.$inject = ['$rootScope', '$location'];

function ToolbarController($rootScope, $location) {

    const toolbar = this;
    toolbar.logout = logout;

    function logout() {
        $rootScope.AuthService.signOut().then(() => {
            $rootScope.userLoggedIn = false;
            $location.path('/auth'); //$state.go('/auth');
        });
    }

}

export default ToolbarController;
