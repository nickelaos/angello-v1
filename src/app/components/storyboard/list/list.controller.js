ListController.$inject = ['$rootScope', '$scope', '$location', '$mdDialog', 'ListsService', 'data', 'action'];

function ListController($rootScope,
                        $scope,
                        $location,
                        $mdDialog,
                        ListsService,
                        data,
                        action) {

    $scope.listData = angular.copy(data);
    $scope.action = action;

    $scope.closeDialog = closeDialog;
    $scope.deleteList = deleteList;

    init();

    // METHODS ---------------------------------

    function init() {
        defineActionLabel();
        setDefaultListData();
        defineSubmitAction();
    }

    function defineActionLabel() {
        if (action === 'edit') $scope.actionLabel = 'Edit List';
        else $scope.actionLabel = 'Create List';
    }

    function defineSubmitAction() {
        if (action === 'edit') $scope.submitAction = editList;
        else $scope.submitAction = createList;
    }

    function setDefaultListData() {
        const userUID = localStorage.getItem('userUID');

        if ($scope.listData) {
            $scope.listData.userUID = userUID;
        } else {
            $scope.listData = {
                userUID: userUID
            }
        }
    }

    function createList() {
        ListsService.addList($scope.listData)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function editList() {
        const editedData = angular.copy($scope.listData);
        ListsService.editList(editedData)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function deleteList() {
        ListsService.deleteList($scope.listData.id)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function resetForm() {
        $scope.listData = null;
    }

    function closeDialog() {
        resetForm();
        $mdDialog.hide();
    }


}

export default ListController;
