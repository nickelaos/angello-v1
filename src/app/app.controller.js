AppController.$inject = ['$rootScope', '$scope', '$state', '$location'];
export default AppController;

function AppController($rootScope, $scope, $state, $location) {


    document.addEventListener('scroll', function (e) {
        const toolbarTools = document.querySelector('.md-toolbar-tools');
        if (window.scrollY === 0) {
            toolbarTools.style.opacity = '1';
        } else {
            toolbarTools.style.opacity = '0.8';
        }
    });

    /*document.addEventListener('mousedown', function(e) {

    });*/

}