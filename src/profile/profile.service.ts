import { Injectable } from '@angular/core';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
import { FirebaseUser } from '../types';


@Injectable()
export class ProfileService {
  constructor(
    private store: Store
  ) { }


  readUserData(user: firebase.User) {
    const refPath = 'users/' + user.uid;
    return new Promise<{ name: string }>((resolve, reject) => {
      firebase.database().ref(refPath).on('value', snapshot => {
        resolve(snapshot.val());
      });
    });
  }

  writeUserData(user: firebase.User, profile: FirebaseUser) {
    const refPath = 'users/' + user.uid;
    firebase.database().ref(refPath).once('value', snapshot => {
      const overwriteObj = profile;
      const newData = lodash.defaultsDeep(overwriteObj, snapshot.val());
      firebase.database().ref(refPath).set(newData).then(() => console.log(newData));
    });
  }

}