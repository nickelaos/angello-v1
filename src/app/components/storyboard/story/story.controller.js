StoryController.$inject = ['$rootScope', '$scope', '$location', '$mdDialog', 'StoriesService', 'STORY_STATUSES', 'STORY_TYPES', 'data', 'action', 'column', 'lastOrderIndex'];

function StoryController($rootScope,
                         $scope,
                         $location,
                         $mdDialog,
                         StoriesService,
                         STORY_STATUSES,
                         STORY_TYPES,
                         data,
                         action,
                         column,
                         lastOrderIndex) {

    $scope.storyData = angular.copy(data);
    $scope.action = action;
    $scope.column = column;
    $scope.statuses = STORY_STATUSES;
    $scope.types = STORY_TYPES;

    $scope.closeDialog = closeDialog;
    $scope.deleteStory = deleteStory;

    init();

    // METHODS ---------------------------------

    function init() {
        defineActionLabel();
        setDefaultStoryData();
        defineSubmitAction();
    }

    function defineActionLabel() {
        if (action === 'edit') $scope.actionLabel = 'Edit story';
        else $scope.actionLabel = 'Create story';
    }

    function defineSubmitAction() {
        if (action === 'edit') $scope.submitAction = editStory;
        else $scope.submitAction = createStory;
    }

    function setDefaultStoryData() {
        const userUID = localStorage.getItem('userUID');

        if ($scope.storyData) {
            $scope.storyData.userUID = userUID;
        } else {
            $scope.storyData = {
                status: STORY_STATUSES[0].value,
                type: STORY_TYPES[0].value,
                order: lastOrderIndex + 1,
                userUID: userUID
            }
        }

        if ($scope.storyData && column) {
            $scope.storyData.status = column;
        }
    }

    function createStory() {
        StoriesService.addStory($scope.storyData)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function editStory() {
        const editedData = angular.copy($scope.storyData);
        StoriesService.editStory(editedData)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function deleteStory() {
        StoriesService.deleteStory($scope.storyData.id)
            .then(response => {
                closeDialog();
            })
            .catch(e => console.log(e.message));
    }

    function resetForm() {
        $scope.storyData = null;
    }

    function closeDialog() {
        resetForm();
        $mdDialog.hide();
    }


}

export default StoryController;
