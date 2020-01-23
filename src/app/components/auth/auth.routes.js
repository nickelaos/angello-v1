/* @ngInject */
export default function routes($stateProvider) {

    $stateProvider
        .state('auth', {
            url: '/auth',
            template: require('./auth.html'),
            controller: 'AuthController',
            controllerAs: 'auth'
        });

}
