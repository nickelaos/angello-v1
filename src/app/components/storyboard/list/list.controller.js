ListController.$inject = ['$rootScope', '$scope', '$location', '$mdDialog', 'ListsService', 'data', 'action', 'storiesInList'];

function ListController($rootScope,
                        $scope,
                        $location,
                        $mdDialog,
                        ListsService,
                        data,
                        action,
                        storiesInList) {

    $scope.listData = angular.copy(data);
    $scope.action = action;
    $scope.lists = ListsService.lists.filter(list => list.id !== $scope.listData.id);
    $scope.storiesInList = angular.copy(storiesInList);

    $scope.settings = {
        deleteAllStoriesInList: action === 'delete',
        targetListId: $scope.lists.length ? $scope.lists[0].id : null
    };

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
        switch (action) {
            case 'edit': $scope.actionLabel = 'Edit List'; break;
            case 'delete': $scope.actionLabel = 'Delete List'; break;
            default: $scope.actionLabel = 'Create List';
        }
    }

    function defineSubmitAction() {
        switch (action) {
            case 'edit': $scope.submitAction = editList; break;
            case 'delete': $scope.submitAction = deleteList; break;
            default: $scope.submitAction = createList;
        }
    }

    function setDefaultListData() {
        const userUID = localStorage.getItem('userUID');

        if ($scope.listData) {
            $scope.listData.userUID = userUID;
        } else {
            $scope.listData = {
                userUID: userUID,
            }
        }
    }

    function createList() {
        const ordersArr = $scope.lists.map(list => list.order);
        $scope.listData.order = ordersArr.length
            ? Math.max(...ordersArr) + 1
            : 1;
        $scope.listData.createdAt = Date.now();
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
        if ($scope.settings.deleteAllStoriesInList) $scope.settings.targetListId = null;

        ListsService.deleteList($scope.listData.id, $scope.settings.targetListId)
            .then(() => {
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
