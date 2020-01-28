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

        //console.log(storyboard.stories);

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
        console.log('drop', ev);
        ev.preventDefault();

        const draggableItemId = ev.dataTransfer.getData("id");
        const draggableEl = document.getElementById(draggableItemId);

        const targetEl = ev.target.closest('.story');
        //const targetList = ev.target.closest('.list');

        //targetList.insertBefore(draggableEl, targetEl);
        insertAfter(draggableEl, targetEl);

        ev.dataTransfer.clearData();
        dragEnd();
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

    function dragEnd() {
        /*const el = document.getElementById($scope.draggableItemId);
        el.classList.remove('dragging-story');*/

        hideDropZones();

        $scope.draggableItemId = null;
        $scope.draggableItemHeight = 0;
        $scope.targetItemId = null;
    }

}
