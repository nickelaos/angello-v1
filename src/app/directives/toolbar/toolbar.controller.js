ToolbarController.$inject = ['$rootScope', '$location'];

function ToolbarController($rootScope, $location) {

    const toolbar = this;
    toolbar.logout = logout;

    toolbar.menuItems = [
        {
            title: 'Create Story',
            value: 'create_story'
        },
        {
            title: 'Create List',
            value: 'create_list'
        },
        /*{
            title: 'Create Type',
            value: 'create_type'
        }*/
    ];

    function logout() {
        $rootScope.AuthService.signOut().then(() => {
            $rootScope.userLoggedIn = false;
            $location.path('/auth'); //$state.go('/auth');
        });
    }

}

export default ToolbarController;
