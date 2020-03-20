import ListController from './list/list.controller';
import ListTemplate from './list/list.html';

import StoryController from './story/story.controller';
import StoryTemplate from './story/story.html';

StoryboardController.$inject = ['$rootScope', '$scope', '$state', '$location', '$mdDialog', 'StoriesService', 'ListsService', 'STORY_TYPES'];
export default StoryboardController;

function StoryboardController($rootScope,
                              $scope,
                              $state,
                              $location,
                              $mdDialog,
                              StoriesService,
                              ListsService,
                              STORY_TYPES) {

    const storyboard = this;

    storyboard.currentListId = null;
    storyboard.currentList = {};
    storyboard.editedList = {};

    storyboard.currentStoryId = null;
    storyboard.currentStory = null;
    storyboard.editedStory = {};

    storyboard.stories = [];
    storyboard.types = STORY_TYPES;
    storyboard.lists = [];

    storyboard.setCurrentList = setCurrentList;
    storyboard.showListDialog = showListDialog;
    storyboard.setCurrentStory = setCurrentStory;
    storyboard.showStoryDialog = showStoryDialog;

    $scope.drag = drag;
    $scope.drop = drop;
    $scope.dragOver = dragOver;
    $scope.dragLeave = dragLeave;
    $scope.dragEnd = dragEnd;

    $scope.draggableItemId = null;
    $scope.draggableItemHeight = 0;
    $scope.targetItemId = null;

    /*window.$rootScope = $rootScope; // temp
    window.$scope = $scope; // temp*/

    init();

    // METHODS --------------------------------------------------------

    function init() {
        getLists();
        getStories();
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

        //console.log(storyboard.lists);

        //storyboard.lastOrderIndex = defineLastOrderIndex();
        $rootScope.$apply();
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

        StoriesService.setStories(storyboard.stories);

        //console.log(storyboard.stories);

        //storyboard.lastOrderIndex = defineLastOrderIndex();
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

    /*function defineLastOrderIndex() {
        let lastOrderIndex = 0;
        storyboard.stories.forEach(story => {
            if (story.order > lastOrderIndex)
                lastOrderIndex = story.order;
        });
        return lastOrderIndex;
    }*/

    /* EVENT LISTENERS & WATCHERS */
    /*$rootScope.$watch('lists', () => {
        $rootScope.$apply();
    });*/
    /*document.addEventListener('storyboard.lists', () => {
        console.log(111);
    });*/

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

    /*$rootScope.$on('storiesUpdated', (snapshot) => {
        console.log(snapshot);
        setStories(snapshot)
    });*/

    /******************************************************************************************/

    /* DRAG & DROP*/
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function drag(ev) {
        const draggableItemId = ev.target.closest('.story').id;
        const draggableItemHeight = String(ev.target.closest('.story').clientHeight);

        /*const el = document.getElementById(draggableItemId);
        const fakeGhost = el.cloneNode(true);
        fakeGhost.style.opacity = '100%';
        document.body.appendChild(fakeGhost);
        ev.dataTransfer.setDragImage(fakeGhost, 0, 0);*/
        /*const el = document.getElementById(draggableItemId);
        el.classList.add('dragging-story');*/

        ev.dataTransfer.setData('id', draggableItemId);
        ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.effectAllowed = 'move';

        $scope.draggableItemId = draggableItemId;
        $scope.draggableItemHeight = draggableItemHeight;
    }

    function drop(ev) {
        ev.preventDefault();

        const draggableItemId = ev.dataTransfer.getData("id");
        const draggableEl = document.getElementById(draggableItemId);

        const targetEl = ev.target.closest('.story');
        const targetList = ev.target.closest('.list');

        //targetList.insertBefore(draggableEl, targetEl);
        insertAfter(draggableEl, targetEl);

        const newOrderIndex = defineOrderOfDroppedElement(targetEl.id, targetList.id);

        ev.dataTransfer.clearData();
        dragEnd(draggableItemId, newOrderIndex, targetList.id);
    }

    function hideDropZones() {
        const dropZones = document.getElementsByClassName('drop-zone');
        if (!dropZones) return;
        for (let i = 0; i < dropZones.length; i++) {
            dropZones[i].style.height = '5px';
            dropZones[i].style.opacity = '0';
        }
    }

    function dragOver(ev) {
        ev.preventDefault();

        const targetEl = ev.target.closest('.story');
        if ($scope.draggableItemId === targetEl.id) return;

        let targetZone = ev.target.closest('.drop-zone') || targetEl.querySelector('.drop-zone');
        if (!targetZone || !targetEl) return;

        targetZone.style.height = $scope.draggableItemHeight + 'px';
        targetZone.style.opacity = '100%';
    }

    function dragLeave(ev) {
        ev.preventDefault();
        hideDropZones();
    }

    function dragEnd(storyId, newOrderIndex, newListId) {
        /*const el = document.getElementById($scope.draggableItemId);
        el.classList.remove('dragging-story');*/
        hideDropZones();

        $scope.draggableItemId = null;
        $scope.draggableItemHeight = 0;
        $scope.targetItemId = null;

        const story = StoriesService.stories.find(story => story.id === storyId);
        story.order = newOrderIndex;
        story.listId = newListId;

        StoriesService.editStory(story)
            .then(() => {
                $rootScope.$apply();
            })
            .catch(e => console.log(e.message));

    }

    function defineOrderOfDroppedElement(targetStoryId, targetListId) {
        const defaultOutput = 1000;

        const storiesInList = StoriesService.stories.filter(story => story.listId === targetListId);
        const orderNumbersInList = storiesInList.map(story => story.order);

        if (!orderNumbersInList.length)
            return defaultOutput;

        const targetStoryOrder = storiesInList.find(story => story.id === targetStoryId).order;

        let targetStoryIndex = orderNumbersInList.indexOf(targetStoryOrder);

        const nextStoryOrder = storiesInList[targetStoryIndex + 1].order;

        debugger

        return (nextStoryOrder + targetStoryOrder) / 2;
    }

}
