/* @ngInject */
class AuthService {

    constructor() {
        //this.userLoggedIn = false;
    }

    signUp(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    signIn(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    signOut() {
        return firebase.auth().signOut();
    }

}

export default AuthService;


