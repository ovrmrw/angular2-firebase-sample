import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
import { FirebaseUser } from '../types';


@Injectable()
export class ProfileService {
  disposableRefPaths: string[];


  constructor(
    private store: Store
  ) {
    /* initialize instance values */
    this.disposableRefPaths = [];
  }


  readUserData(): Observable<FirebaseUser> {
    const uid = this.store.currentUser.uid;
    const usersRefPath = 'users/' + uid;
    const returner$ = new ReplaySubject<FirebaseUser>();

    firebase.database().ref(usersRefPath).on('value', snapshot => {
      const user: FirebaseUser = snapshot.val(); // rename
      returner$.next(user);
    });
    this.disposableRefPaths.push(usersRefPath);
    return returner$;
  }


  writeUserData(name: string): void {
    const uid = this.store.currentUser.uid;
    const usersRefPath = 'users/' + uid;
    const updateUser: FirebaseUser = {
      name: name
    };

    firebase.database().ref(usersRefPath).update(updateUser, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('writeUserData completed.');
      }
    });
  }


  onDestroy() {
    lodash.uniq(this.disposableRefPaths).forEach(path => {
      firebase.database().ref(path).off();
    });
  }

}