AuthController.$inject = ['$rootScope', '$scope', '$state', '$location'];
export default AuthController;

function AuthController($rootScope, $scope, $state, $location) {

    const auth = this;

    auth.authType = 1; // 1 - log in, 2 - sign up
    auth.errorMessage = '';

    auth.loginForm = {
        email: '',
        password: ''
    };

    auth.signupForm = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    };

    auth.register = register;
    auth.login = login;
    auth.logout = logout;
    auth.changeAuthType = changeAuthType;

    /*window.$rootScope = $rootScope; // temp
    window.$scope = $scope; // temp*/

    function register(event) {
        event.preventDefault();
        $rootScope.AuthService.signUp(auth.signupForm.email, auth.signupForm.password)
            .then(response => {
                return firebase.firestore().collection('users').doc(response.user.uid).set({
                    firstName: auth.signupForm.firstName,
                    lastName: auth.signupForm.lastName,
                });
            })
            .then(() => {
                updateLoggedInStatus(true);
                resetForm();
                $state.go('/'); // ???
                $location.path('/'); //$state.go('/');
                //$rootScope.$apply();
            })
            .catch(err => {
                console.log(err);
                auth.errorMessage = err.message;
                $rootScope.$apply();
            });
    }

    function login(event) {
        event.preventDefault();
        $rootScope.AuthService.signIn(auth.loginForm.email, auth.loginForm.password)
            .then(response => {
                updateLoggedInStatus(true);
                resetForm();
                $location.path('/'); //$state.go('/');
                //$rootScope.$apply();
            })
            .catch(err => {
                console.log(err);
                auth.errorMessage = err.message;
                $rootScope.$apply();
            });
    }

    function logout() {
        $rootScope.AuthService.signOut().then(() => {
            updateLoggedInStatus(false);
            $location.path('/auth'); //$state.go('/auth');
        });
    }

    function updateLoggedInStatus(status = false) {
        $rootScope.userLoggedIn = status;
    }

    function changeAuthType(number) {
        auth.authType = number;
    }

    function resetForm() {
        auth.loginForm = {
            email: '',
            password: ''
        };

        auth.signupForm = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        };
    }

    $rootScope.$on('authStateChanged', () => {
        $rootScope.$apply();
    });

}
