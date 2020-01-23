import StoryController from './story/story.controller';
import StoryTemplate from './story/story.html';

StoryboardController.$inject = ['$rootScope', '$scope', '$state', '$location', '$mdDialog', 'StoriesService', 'STORY_STATUSES', 'STORY_TYPES'];
export default StoryboardController;

function StoryboardController($rootScope,
                              $scope,
                              $state,
                              $location,
                              $mdDialog,
                              StoriesService,
                              STORY_STATUSES,
                              STORY_TYPES) {

    const storyboard = this;

    storyboard.currentStoryId = null;
    storyboard.currentStory = null;
    storyboard.editedStory = {};
    storyboard.stories = [];
    storyboard.types = STORY_TYPES;
    storyboard.statuses = STORY_STATUSES;

    storyboard.setCurrentStory = setCurrentStory;
    storyboard.showStoryDialog = showStoryDialog;

    /*window.$rootScope = $rootScope; // temp
    window.$scope = $scope; // temp*/

    init();

    // METHODS --------------------------------------------------------

    function init() {
        getStories();
    }

    function setCurrentStory(story) {
        storyboard.currentStoryId = story ? story.id : null;
        storyboard.currentStory = story;
        storyboard.editedStory = angular.copy(storyboard.currentStory);
    }

    function getStories() {
        const userUID = localStorage.getItem('userUID');
        if (!userUID) return;
        StoriesService.fetchStoriesByUserId(userUID)
            .onSnapshot(snapshot => {
                setStories(snapshot);
            }, err => console.log(err.message));
    }

    function setStories(snapshot) {
        storyboard.stories = snapshot.docs.map(doc => {
            let docData = doc.data();
            docData.id = doc.id;
            return docData;
        });

        console.log(storyboard.stories);

        storyboard.lastOrderIndex = defineLastOrderIndex();
        $rootScope.$apply();
    }


    function showStoryDialog(ev, action, column) {
        $mdDialog.show({
            controller: StoryController,
            template: StoryTemplate,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true,
            locals: {
                data: storyboard.editedStory,
                action: action, // create or edit
                column: column, // status
                lastOrderIndex: storyboard.lastOrderIndex || 0
            }
        })
            .then(response => {

            })
            .catch(e => console.log(e.message));
    }

    function defineLastOrderIndex() {
        let lastOrderIndex = 0;
        storyboard.stories.forEach(story => {
            if (story.order > lastOrderIndex)
                lastOrderIndex = story.order;
        });
        return lastOrderIndex;
    }

    /*$rootScope.$on('storiesUpdated', (snapshot) => {
        console.log(snapshot);
        setStories(snapshot)
    });*/

}
