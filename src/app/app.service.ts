import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'firebase/auth';
const firebaseConfig = require('../../config/firebase.json');


@Injectable()
export class AppService {
  firebase: firebase.app.App;
  user: firebase.User;

  constructor() {
    this.firebase = firebase.initializeApp(firebaseConfig);
  }

  jumpSignInPageIfUserIsNotLoggedIn() {
    const accessToken = window.sessionStorage.getItem('uid') as string;
    // const db = firebase.initializeApp(firebaseConfig);
    // const user = this.firebase.auth().currentUser;
    if (!accessToken) { // ログインしていない場合は…
      location.href = '/signin.html'; // signinページに飛ばす。      
      // db.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    }
  }

  login() {
    (async () => {
      const user = JSON.parse(window.sessionStorage.getItem('user')) as firebase.User;
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/plus.login');
      // this.user = this.firebase.auth().currentUser;
      if (!user) {
        await this.firebase.auth().signInWithRedirect(provider);
        const result = await this.firebase.auth().getRedirectResult();
        console.log(result);
        window.sessionStorage.setItem('user', JSON.stringify(result.user));
      }
      console.log(user);
    })();
  }
}