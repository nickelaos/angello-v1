/* @ngInject */
export default function routes($stateProvider) {

    $stateProvider
        .state('storyboard', {
            url: '/',
            template: require('./storyboard.html'),
            controller: 'StoryboardController',
            controllerAs: 'storyboard'
        });

}
