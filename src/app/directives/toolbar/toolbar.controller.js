ToolbarController.$inject = ['$rootScope', '$location'];

function ToolbarController($rootScope, $location) {

    const toolbar = this;
    toolbar.emitAction = emitAction;
    toolbar.logout = logout;

    toolbar.menuItems = [
        {
            title: 'Create List',
            value: 'create_list'
        },
        {
            title: 'Create Story',
            value: 'create_story'
        },
        {
            title: 'Create Type',
            value: 'create_type'
        }
    ];

    function emitAction(value) {
        $rootScope.$emit(value);
    }

    function logout() {
        $rootScope.AuthService.signOut().then(() => {
            $rootScope.userLoggedIn = false;
            $location.path('/auth'); //$state.go('/auth');
        });
    }

}

export default ToolbarController;
