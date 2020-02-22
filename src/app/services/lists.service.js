/* @ngInject */
class ListsService {

    constructor() {
        this.lists = [];
    }

    setLists(lists) {
        this.lists = lists;
    }

    fetchListsByUserId(userUID) {
        return firebase.firestore()
            .collection('lists')
            .where('userUID', '==', userUID)
            //.orderBy('order');
    }

    addList(list) {
        return firebase.firestore()
            .collection('lists')
            .add(list);
    }

    editList(list) {
        const id = list.id;
        delete list.id;
        return firebase.firestore()
            .collection('lists')
            .doc(id)
            .update(list);
    }

    deleteList(listId, targetListId = null) {
        const deleteAllStoriesInList = targetListId === null;

        if (deleteAllStoriesInList) {
            return this.deleteAllStoriesInList(listId).then(() => {
                deleteListFromCollection(listId);
            });
        } else {
            return this.moveStoriesToAnotherList(listId, targetListId).then(() => {
                deleteListFromCollection(listId);
            });
        }

        function deleteListFromCollection(listId) {
            firebase.firestore()
                .collection('lists')
                .doc(listId)
                .delete();
        }

    }

    deleteAllStoriesInList(listId) {
        return firebase.firestore()
            .collection('stories')
            .where('listId', '==', listId)
            .get()
            .then(snapshot => {
                const batch = firebase.firestore().batch();
                snapshot.docs.forEach(doc => {
                    batch.delete(doc.ref);
                });
                batch.commit();
            });
    }

    moveStoriesToAnotherList(listId, targetListId) {
        return firebase.firestore()
            .collection('stories')
            .where('listId', '==', listId)
            .get()
            .then(snapshot => {
                const batch = firebase.firestore().batch();
                snapshot.docs.forEach(doc => {
                    batch.update(doc.ref, {'listId': targetListId});
                });
                batch.commit();
            });
    }

}

export default ListsService;


