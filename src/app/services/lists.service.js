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

    deleteList(id) {
        return firebase.firestore()
            .collection('lists')
            .doc(id)
            .delete();
    }

}

export default ListsService;


