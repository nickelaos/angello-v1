import AuthService from './services/auth.service';

run.$inject = ['$rootScope', '$location', '$transitions', '$state', 'StoriesService'];

export default function run($rootScope, $location, $transitions, $state, StoriesService) {
    $rootScope.AuthService = new AuthService();
    //console.log(StoriesService);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log('User logged IN');
            localStorage.setItem('userUID', user.uid);
            $rootScope.userLoggedIn = true;
        } else {
            console.log('User logged OUT');
            localStorage.setItem('userUID', null);
            $rootScope.userLoggedIn = false;
            $state.go('/auth');
        }
        $rootScope.$emit('authStateChanged');
    });

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
