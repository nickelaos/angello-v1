StoryController.$inject = ['$rootScope', '$scope', '$location', '$mdDialog', 'StoriesService', 'ListsService', 'STORY_TYPES', 'data', 'action', 'listId', 'lastOrderIndex'];

function StoryController($rootScope,
                         $scope,
                         $location,
                         $mdDialog,
                         StoriesService,
                         ListsService,
                         STORY_TYPES,
                         data,
                         action,
                         listId,
                         lastOrderIndex) {

    $scope.storyData = angular.copy(data);
    $scope.action = action;
    $scope.listId = listId;
    $scope.statuses = ListsService.lists;
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
        if (action === 'edit') $scope.actionLabel = 'Edit Story';
        else $scope.actionLabel = 'Create Story';
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
                listId: ListsService.lists[0].id,
                type: STORY_TYPES[0].value,
                order: lastOrderIndex + 1,
                userUID: userUID
            }
        }

        if ($scope.storyData && listId) {
            $scope.storyData.listId = listId;
        }
    }

    function createStory() {
        $scope.storyData.order = defineMaxStoryIndexWithinList();
        $scope.storyData.createdAt = Date.now();
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

    function defineMaxStoryIndexWithinList() {
        let maxOrderIndex = 1000;
        const storiesInList = StoriesService.stories.filter(story => story.listId === $scope.storyData.listId).map(story => story.order);
        if (!storiesInList.length) return maxOrderIndex;
        maxOrderIndex = Math.max(...storiesInList) + 1000;
        return maxOrderIndex;
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
