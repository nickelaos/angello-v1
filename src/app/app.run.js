import AuthService from './services/auth.service';

run.$inject = ['$rootScope', '$location', '$transitions', '$state'];

export default function run($rootScope, $location, $transitions, $state) {
    $rootScope.AuthService = new AuthService();

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            localStorage.setItem('userUID', user.uid);
            $rootScope.userLoggedIn = true;
        } else {
            localStorage.setItem('userUID', null);
            $rootScope.userLoggedIn = false;
            $state.go('/auth');
        }
        $rootScope.$emit('authStateChanged');
    });

    // TODO: LoadingService
    /*$rootScope.$on('$routeChangeStart', function (e, curr, prev) {
        //LoadingService.setLoading(true);
    });*/

    /*$rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        //LoadingService.setLoading(false);
    });*/

    /*$rootScope.$on('$locationChangeStart', function () {
        let user = firebase.auth().currentUser || localStorage.getItem('userUID');
        if (user === 'null') user = null;
        if (!user) $location.path('/auth');
        if (user && $location.path() === '/auth') $location.path('/');
    });*/

    $transitions.onBefore({}, function (transition) {
        let user = firebase.auth().currentUser || localStorage.getItem('userUID');
        if (user === 'null') user = null;

        if (!user && transition.to().name !== 'auth') {
            $state.go('/auth');
            return false;
        }

        if (user && transition.to().name === 'auth') {
            $state.go('/');
            return false;
        }
    });

}
