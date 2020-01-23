StorySummaryController.$inject = ['$rootScope', '$scope', '$location'];

function StorySummaryController($rootScope, $scope, $location) {

    const storySummary = this;
    storySummary.data = $scope.data;


}

export default StorySummaryController;
