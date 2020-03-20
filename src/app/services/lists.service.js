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
            .orderBy('order');
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

        return firebase.firestore()
            .collection('stories')
            .where('listId', '==', listId)
            .get()
            .then(snapshot => {
                const batch = firebase.firestore().batch();

                if (deleteAllStoriesInList) {
                    snapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                } else {
                    snapshot.docs.forEach(doc => {
                        batch.update(doc.ref, {'listId': targetListId});
                    });
                }

                batch.commit().then(() => {
                    firebase.firestore()
                        .collection('lists')
                        .doc(listId)
                        .delete();
                });
            });

    }

}

export default ListsService;


