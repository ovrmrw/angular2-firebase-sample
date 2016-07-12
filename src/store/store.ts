import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import firebase from 'firebase';
import lodash from 'lodash';
// import 'firebase/auth';
const firebaseConfig = require('../../config/firebase.json');


@Injectable()
export class Store {
  private _firebase: firebase.app.App;

  private _user$: Observable<firebase.User>;
  private _userSubject$ = new ReplaySubject<firebase.User>();
  private _status$: Observable<string>;
  private _statusSubject$ = new ReplaySubject<string>();
  private _accessToken: string;
  private _stateLogout = false;

  private _disposableSubscriptions: Subscription[] = [];
  set ds(s: Subscription) { this._disposableSubscriptions.push(s); }
  disposeSubscriptions() {
    this._disposableSubscriptions.forEach(s => s.unsubscribe());
  }

  constructor() {
    this.registerSubjects();

    this._firebase = firebase.initializeApp(firebaseConfig);
    this.firebaseOnAuthStateChangedDetector(this._firebase);
  }

  registerSubjects() {
    this._user$ = this._userSubject$
      .scan<firebase.User>((p, value) => value);
    this._status$ = this._statusSubject$
      .scan<string>((p, value) => value);
  }

  firebaseOnAuthStateChangedDetector(firebase: firebase.app.App): void {
    firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        console.log('Event: onAuthStateChanged: SIGN-IN');
        console.log(user);
        user.getToken().then((token: string) => {
          this._accessToken = token;
          this._userSubject$.next(user);
          this._statusSubject$.next('signin');
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
        this._statusSubject$.next('signout');
        this._stateLogout = true;
      }
    }, err => {
      console.log('Event: onAuthStateChanged: ERROR');
      console.log(err);
      this._userSubject$.next(null);
      this._statusSubject$.next('signout');
      this._stateLogout = true;
    });
  }

  writeToDb(refPath: string, overwriteObj: {}, priority?: string | number) {
    firebase.database().ref(refPath).once('value', snapshot => {
      console.log(snapshot.val())
      const newData = lodash.defaultsDeep(overwriteObj, snapshot.val());
      console.log(newData)
      if (priority) {
        firebase.database().ref(refPath).setWithPriority(newData, priority).then(() => console.log(newData));
      } else {
        firebase.database().ref(refPath).set(newData).then(() => console.log(newData));
      }
    });
  }


  get currentUser() { return this._firebase.auth().currentUser; }
  get uid() { return this._firebase.auth().currentUser.uid; }
  get userName() { return this._firebase.auth().currentUser.displayName || this._firebase.auth().currentUser.email; }
  get userId() { return this._firebase.auth().currentUser.uid; }
  get user$() { return this._user$; }
  get userName$() { return this._user$.map(user => user.displayName || user.email); }
  get status$() { return this._status$; }

  get firebase() { return this._firebase; }

  get accessToken() { return this._accessToken; }



}
