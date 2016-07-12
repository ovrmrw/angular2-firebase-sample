import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
import { FirebaseUser } from '../types';

@Injectable()
export class AppService {
  constructor(
    private store: Store
  ) { }


  readUserData(user: firebase.User): Observable<FirebaseUser> {
    const usersRefPath = 'users/' + user.uid;
    const returner$ = new ReplaySubject<FirebaseUser>();
    firebase.database().ref(usersRefPath).on('value', snapshot => {
      returner$.next(snapshot.val());
    });
    return returner$;
  }

  writeUserData(user: firebase.User): void {
    const usersRefPath = 'users/' + user.uid;
    const updateUser: FirebaseUser = {
      displayName: user.displayName,
      email: user.email,
      providerId: user.providerId,
      photoURL: user.photoURL,
      timestamp: new Date().getTime()
    };

    firebase.database().ref(usersRefPath).update(updateUser, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('writeUserData completed.');
      }
    });
  }

}