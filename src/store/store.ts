import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs/Rx';
import firebase from 'firebase';
// import 'firebase/auth';
const firebaseConfig = require('../../config/firebase.json');


@Injectable()
export class Store {
  private _firebase: firebase.app.App;

  private _user$: Observable<firebase.User>;
  private _userSubject$ = new ReplaySubject<firebase.User>();
  private _accessToken: string;
  private _stateLogout = false;

  constructor() {
    this.registerSubjects();

    this._firebase = firebase.initializeApp(firebaseConfig);
    this.firebaseOnAuthStateChangedDetector(this._firebase);
  }

  registerSubjects() {
    this._user$ = this._userSubject$
      .scan<firebase.User>((p, value) => value);
  }

  firebaseOnAuthStateChangedDetector(firebase: firebase.app.App): void {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        console.log('Event: onAuthStateChanged: SIGN-IN');
        console.log(user);
        user.getToken().then((token: string) => {
          this._accessToken = token;
          this._userSubject$.next(user);
          this._firebase.database().ref('users/' + user.uid).on('value', snapshot => {
            console.log(snapshot.val());
          });
          window.location.hash = '';
          if (this._stateLogout) {
            window.location.reload();
          }
        });
      } else {
        console.log('Event: onAuthStateChanged: SIGN-OUT');
        this._userSubject$.next(null);
        this._stateLogout = true;
      }
    }, err => {
      console.log('Event: onAuthStateChanged: ERROR');
      console.log(err);
      this._userSubject$.next(null);
      this._stateLogout = true;
    });
  }


  get user() { return this._firebase.auth().currentUser; }
  get userName() { return this._firebase.auth().currentUser.displayName || this._firebase.auth().currentUser.email; }
  get user$() { return this._user$; }
  get userName$() { return this._user$.map(user => user.displayName || user.email); }

  get firebase() { return this._firebase; }

  get accessToken() { return this._accessToken; }



}
