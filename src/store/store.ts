import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs/Rx';
import firebase from 'firebase';
import 'firebase/auth';
const firebaseConfig = require('../../config/firebase.json');


@Injectable()
export class Store {
  private _firebase: firebase.app.App;
  private _user$: Observable<firebase.User>;
  private _userSubject$ = new BehaviorSubject<firebase.User>(null);
  private _stateLogout = false;

  constructor() {
    this._user$ = this._userSubject$.scan<firebase.User>((p, value) => {
      return value;
    });

    this._firebase = firebase.initializeApp(firebaseConfig);
    this._firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user) {
        console.log('Event: onAuthStateChanged: LOGIN');
        console.log(user);
        user.getToken().then(() => {
          this._userSubject$.next(user);
          window.location.hash = '';
          if (this._stateLogout) {            
            window.location.reload();
          }
        });
      } else {
        console.log('Event: onAuthStateChanged: LOGOUT');
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


  get user$() { return this._user$; }

  get firebase() { return this._firebase; }

}