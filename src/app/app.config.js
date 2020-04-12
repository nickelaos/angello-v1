/* @ngInject */
function routing($stateProvider, $urlRouterProvider) {
    const falsyValues = [null, 'null', undefined, ''];
    const userUID = localStorage.getItem('userUID');
    const redirectPath = falsyValues.includes(userUID) ? '/auth' : '/';
    $urlRouterProvider.otherwise(redirectPath);
}

export default {
    routing
}
