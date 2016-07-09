import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
import { FirebaseUser } from '../types';


@Injectable()
export class ProfileService {
  constructor(
    private store: Store
  ) { }


  readUserData(user: firebase.User): Observable<FirebaseUser> {
    const refPath = 'users/' + user.uid;
    const subject = new ReplaySubject<FirebaseUser>();
    firebase.database().ref(refPath).on('value', snapshot => {
      subject.next(snapshot.val());
    });
    return subject;
  }

  writeUserData(user: firebase.User, profile: FirebaseUser): void {
    const refPath = 'users/' + user.uid;
    firebase.database().ref(refPath).once('value', snapshot => {
      const overwriteObj = profile;
      const newData = lodash.defaultsDeep(overwriteObj, snapshot.val());
      firebase.database().ref(refPath).set(newData).then(() => console.log(newData));
    });
  }

}