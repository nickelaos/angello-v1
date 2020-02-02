/* @ngInject */
class StoriesService {

    constructor() {
        this.stories = [];
    }

    setStories(stories) {
        this.stories = stories;
    }

    fetchStoriesByUserId(userUID) {
        return firebase.firestore()
            .collection('stories')
            .where('userUID', '==', userUID)
            //.orderBy('order');
    }

    addStory(story) {
        return firebase.firestore()
            .collection('stories')
            .add(story);
    }

    editStory(story) {
        const id = story.id;
        delete story.id;
        return firebase.firestore()
            .collection('stories')
            .doc(id)
            .update(story);
    }

    deleteStory(id) {
        return firebase.firestore()
            .collection('stories')
            .doc(id)
            .delete();
    }

}

export default StoriesService;


