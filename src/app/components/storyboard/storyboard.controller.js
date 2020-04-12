import ListController from './list/list.controller';
import ListTemplate from './list/list.html';

import StoryController from './story/story.controller';
import StoryTemplate from './story/story.html';

StoryboardController.$inject = ['$rootScope', '$scope', '$state', '$location', '$mdDialog', '$timeout', 'StoriesService', 'ListsService', 'DNDService', 'STORY_TYPES'];
export default StoryboardController;

function StoryboardController($rootScope,
                              $scope,
                              $state,
                              $location,
                              $mdDialog,
                              $timeout,
                              StoriesService,
                              ListsService,
                              DNDService,
                              STORY_TYPES) {

    const storyboard = this;

    storyboard.setCurrentList = setCurrentList;
    storyboard.showListDialog = showListDialog;
    storyboard.setCurrentStory = setCurrentStory;
    storyboard.showStoryDialog = showStoryDialog;

    window.$rootScope = $rootScope; // temp
    window.$scope = $scope; // temp
    window.stories = storyboard.stories; // temp
    window.DNDService = DNDService; // temp
    window.StoriesService = StoriesService; // temp

    init();

    // METHODS --------------------------------------------------------

    function init() {
        resetStoryboard();
        getLists();
        getStories();
    }

    function resetStoryboard() {
        storyboard.currentListId = null;
        storyboard.currentList = {};
        storyboard.editedList = {};

        storyboard.currentStoryId = null;
        storyboard.currentStory = null;
        storyboard.editedStory = {};

        storyboard.stories = [];
        storyboard.types = STORY_TYPES;
        storyboard.lists = [];

        $rootScope.DNDinited = false;
    }

    function setCurrentList(list) {
        storyboard.currentListId = list ? list.id : null;
        storyboard.currentList = list;
        storyboard.editedList = angular.copy(storyboard.currentList);
    }

    function setCurrentStory(story) {
        storyboard.currentStoryId = story ? story.id : null;
        storyboard.currentStory = story;
        storyboard.editedStory = angular.copy(storyboard.currentStory);
    }

    function getLists() {
        const userUID = localStorage.getItem('userUID');
        if (!userUID) return;
        ListsService.fetchListsByUserId(userUID)
            .onSnapshot(snapshot => {
                setLists(snapshot);
            }, err => console.log(err.message));
    }

    function setLists(snapshot) {
        storyboard.lists = snapshot.docs.map(doc => {
            let docData = doc.data();
            docData.id = doc.id;
            return docData;
        });
        ListsService.setLists(storyboard.lists);
        setBodyWidth(); //
        $rootScope.$apply();
    }

    function getStories() {
        const userUID = localStorage.getItem('userUID');
        if (!userUID) return;
        StoriesService.fetchStoriesByUserId(userUID)
            .onSnapshot(snapshot => {
                setStories(snapshot);

                if ((DNDService.originListId !== DNDService.targetListId) && DNDService.originListId) {
                    DNDService.columnGrids && DNDService.columnGrids.forEach(grid => {
                        DNDService.deleteDraggedElement(grid);
                    });

                    DNDService.originListId = null;
                    DNDService.targetListId = null;

                    $timeout(() => {
                        $rootScope.$emit('refreshStoryboard');
                    }, 250);
                }

                if (!$rootScope.DNDinited) {
                    DNDService.init(StoriesService, ListsService);
                    $rootScope.DNDinited = true;
                }

                $rootScope.$apply();

            }, err => console.log(err.message));
    }

    function setStories(snapshot) {
        storyboard.stories = snapshot.docs.map(doc => {
            let docData = doc.data();
            docData.id = doc.id;
            return docData;
        });
        StoriesService.setStories(storyboard.stories);
        $rootScope.$apply();
    }

    function showStoryDialog(ev, action, listId) {
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
                listId: listId, // status
                lastOrderIndex: storyboard.lastOrderIndex || 0
            }
        })
            .then(response => {

            })
            .catch(e => console.log(e.message));
    }

    function showListDialog(ev, action) {
        $mdDialog.show({
            controller: ListController,
            template: ListTemplate,
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: true,
            locals: {
                data: storyboard.editedList || {},
                action: action, // create or edit or delete
                storiesInList: action !== 'create' ? storyboard.stories.filter(story => story.listId === storyboard.editedList.id).map(story => story.id) : [],
                //lastOrderIndex: storyboard.lastOrderIndex || 0
            }
        })
        .then(response => {

        })
        .catch(e => console.log(e.message));
    }

    function setBodyWidth() {
        if (window.innerWidth < storyboard.lists.length * 330) {
            document.body.style.width = (storyboard.lists.length * 330) + 'px';
        }
    }

    $rootScope.$on('create_list', () => {
        setCurrentList(null);
        showListDialog(null, 'create');
    });

    $rootScope.$on('edit_list', (e) => {
        showListDialog(e, 'edit');
    });

    $rootScope.$on('delete_list', (e) => {
        showListDialog(e, 'delete');
    });

    $rootScope.$on('create_story', () => {
        setCurrentStory(null);
        showStoryDialog(null, 'create', 1);
    });

    $rootScope.$on('refreshStoryboard', () => {
        init();
    });

}
