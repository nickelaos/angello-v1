/* https://gist.github.com/CodeMyUI/f1fabbe16f012f23276289cbfc2801b7 */

export default class DNDService {

    init(StoriesService) {
        var self = this;
        this.StoriesService = StoriesService;

        var itemContainers = [].slice.call(document.querySelectorAll('.list-content'));
        var columnGrids = [];
        var boardGrid;

        // Define the column grids so we can drag those
        // items around.
        itemContainers.forEach(function (container) {

            // Instantiate column grid.
            var grid = new Muuri(container, {
                items: '.list-item',
                layoutDuration: 400,
                layoutEasing: 'ease',
                dragEnabled: true,
                dragSort: function () {
                    return columnGrids;
                },
                dragSortInterval: 0,
                dragContainer: document.body,
                dragReleaseDuration: 400,
                dragReleaseEasing: 'ease'
            })
                .on('dragStart', function (item) {
                    // Let's set fixed widht/height to the dragged item
                    // so that it does not stretch unwillingly when
                    // it's appended to the document body for the
                    // duration of the drag.
                    item.getElement().style.width = item.getWidth() + 'px';
                    item.getElement().style.height = item.getHeight() + 'px';
                    self.originListId = StoriesService.stories.find(story => story.id === item.getElement().id).listId;
                })
                .on('dragReleaseEnd', function (item) {
                    // Let's remove the fixed width/height from the
                    // dragged item now that it is back in a grid
                    // column and can freely adjust to it's
                    // surroundings.
                    item.getElement().style.width = '';
                    item.getElement().style.height = '';
                    // Just in case, let's refresh the dimensions of all items
                    // in case dragging the item caused some other items to
                    // be different size.
                    columnGrids.forEach(function (grid) {
                        grid.refreshItems();
                    });

                    // Define new order index
                    const draggableItem = item.getElement();

                    const draggableItemId = draggableItem.id;
                    const draggableItemOrder = +draggableItem.attributes.order.value;

                    const originListId = self.originListId;
                    const targetListId = draggableItem.closest('.list').id;

                    if (!draggableItemId || !targetListId) return;

                    const grid = item.getGrid();
                    const gridElements = grid._items.map(item => item._element);

                    const draggableItemIndexInGrid = gridElements.findIndex(el => el.id === draggableItemId);
                    const prevSiblingId = (draggableItemIndexInGrid !== 0) ? gridElements[draggableItemIndexInGrid - 1].id : null;
                    const nextSiblingId = (draggableItemIndexInGrid !== gridElements.length - 1) ? gridElements[draggableItemIndexInGrid + 1].id : null;

                    const newOrderIndex = self.defineOrderOfDroppedElement(draggableItemId, draggableItemOrder, prevSiblingId, nextSiblingId, targetListId);

                    self.grid = grid;
                    self.draggableItemId = draggableItemId;
                    self.draggableItemIndexInGrid = draggableItemIndexInGrid;
                    self.targetListId = targetListId;

                    if (newOrderIndex === draggableItemOrder && originListId === targetListId) return;

                    // Update story with new order index in DB
                    const story = StoriesService.stories.find(story => story.id === draggableItemId);
                    story.order = newOrderIndex;
                    story.listId = targetListId;

                    StoriesService.editStory(story)
                        .then(() => {})
                        .catch(e => console.log(e.message));

                })
                .on('layoutStart', function () {
                    // Let's keep the board grid up to date with the
                    // dimensions changes of column grids.
                    boardGrid.refreshItems().layout();
                });

            // Add the column grid reference to the column grids
            // array, so we can access it later on.
            columnGrids.push(grid);

        });

        this.columnGrids = columnGrids; // temp
        window.columnGrids = this.columnGrids; // temp

        // Instantiate the board grid so we can drag those
        // columns around.
        boardGrid = new Muuri('#storyboard', {
            layoutDuration: 400,
            layoutEasing: 'ease',
            dragEnabled: true,
            dragSortInterval: 0,
            dragStartPredicate: {
                handle: '.list-header'
            },
            dragReleaseDuration: 400,
            dragReleaseEasing: 'ease'
        });
    }

    /******************************************************************************************/

    defineOrderOfDroppedElement(draggableItemId, draggableItemOrder, prevSiblingId, nextSiblingId, targetListId) {
        const defaultOutput = 1000;

        const storiesInList = this.StoriesService.stories.filter(story => story.listId === targetListId);
        const orderNumbersInList = storiesInList.map(story => story.order);

        if (!orderNumbersInList.length) return defaultOutput;

        const prevStoryOrder = prevSiblingId
            ? storiesInList.find(story => story.id === prevSiblingId).order
            : null;
        const nextStoryOrder = nextSiblingId
            ? storiesInList.find(story => story.id === nextSiblingId).order
            : null;

        if (!prevStoryOrder && !nextStoryOrder) return defaultOutput;

        if (!prevStoryOrder && nextStoryOrder) {
            if ((nextStoryOrder / 2) === draggableItemOrder)
                return draggableItemOrder;
            return nextStoryOrder / 2;
        }

        if (prevStoryOrder && !nextStoryOrder) {
            if ((prevStoryOrder * 2) === draggableItemOrder)
                return draggableItemOrder;
            return prevStoryOrder * 2;
        }

        if (((prevStoryOrder + nextStoryOrder) / 2) === draggableItemOrder) {
            return draggableItemOrder;
        }

        return (prevStoryOrder + nextStoryOrder) / 2;
    }

    deleteDraggedElement(grid) {
        const elements = grid._element.children;
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].classList.contains('muuri-item-shown')) {
                elements[i].remove();
            }
        }
    }

}