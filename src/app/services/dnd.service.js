/* https://gist.github.com/CodeMyUI/f1fabbe16f012f23276289cbfc2801b7 */
/* https://github.com/haltu/muuri */

export default class DNDService {

    init(StoriesService = null, ListsService = null) {
        var self = this;
        this.StoriesService = StoriesService;
        this.ListsService = ListsService;

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
                dragStartPredicate: {
                    delay: 250
                },
                dragContainer: document.body,
                dragReleaseDuration: 400,
                dragReleaseEasing: 'ease'
            })
                .on('dragStart', function (item) {
                    // Let's set fixed width/height to the dragged item
                    // so that it does not stretch unwillingly when
                    // it's happended to the document body for the
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
                    const prevSiblingOrder = (draggableItemIndexInGrid !== 0)
                        ? +gridElements[draggableItemIndexInGrid - 1].attributes.order.value
                        : null;
                    const nextSiblingOrder = (draggableItemIndexInGrid !== gridElements.length - 1)
                        ? +gridElements[draggableItemIndexInGrid + 1].attributes.order.value
                        : null;

                    const newOrderIndex = self.defineOrderOfDroppedElement(draggableItemId, draggableItemOrder, prevSiblingOrder, nextSiblingOrder);

                    self.grid = grid; //
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

        this.columnGrids = columnGrids;

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
        })
        .on('dragStart', function (item) {
            item.getElement().style.width = item.getWidth() + 'px';
            item.getElement().style.height = item.getHeight() + 'px';
        })
        .on('dragReleaseEnd', function (item) {
            item.getElement().style.width = '';
            item.getElement().style.height = '';

            const grid = item.getGrid();
            const gridElements = grid._items.map(item => item._element);

            // Define new order index
            const draggableList = item.getElement();

            const draggableListId = draggableList.id;
            const draggableListOrder = +draggableList.attributes.order.value;

            const draggableListIndexInGrid = gridElements.findIndex(el => el.id === draggableListId);
            const prevSiblingOrder = (draggableListIndexInGrid !== 0)
                ? +gridElements[draggableListIndexInGrid - 1].attributes.order.value
                : null;
            const nextSiblingOrder = (draggableListIndexInGrid !== gridElements.length - 1)
                ? +gridElements[draggableListIndexInGrid + 1].attributes.order.value
                : null;

            const newOrderIndex = self.defineOrderOfDroppedElement(draggableListId, draggableListOrder, prevSiblingOrder, nextSiblingOrder);

            self.grid = grid; //
            self.draggableListId = draggableListId;

            if (newOrderIndex === draggableListOrder) return;

            // Update list with new order index in DB
            const list = ListsService.lists.find(list => list.id === draggableListId);
            list.order = newOrderIndex;

            ListsService.editList(list)
                .then(() => {})
                .catch(e => console.log(e.message));

        })
    }

    /******************************************************************************************/

    defineOrderOfDroppedElement(
        draggableItemId,
        draggableItemOrder,
        prevSiblingOrder,
        nextSiblingOrder
    ) {
        const defaultOutput = 1000;

        if (!prevSiblingOrder && !nextSiblingOrder) return defaultOutput;

        if (!prevSiblingOrder && nextSiblingOrder) {
            if ((nextSiblingOrder / 2) === draggableItemOrder)
                return draggableItemOrder;
            return nextSiblingOrder / 2;
        }

        if (prevSiblingOrder && !nextSiblingOrder) {
            if ((prevSiblingOrder * 2) === draggableItemOrder)
                return draggableItemOrder;
            return prevSiblingOrder * 2;
        }

        if (((prevSiblingOrder + nextSiblingOrder) / 2) === draggableItemOrder) {
            return draggableItemOrder;
        }

        return (prevSiblingOrder + nextSiblingOrder) / 2;
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