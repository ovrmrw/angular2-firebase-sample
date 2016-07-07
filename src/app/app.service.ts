import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Store } from '../store';


@Injectable()
export class AppService {
  private database: firebase.database.Database;

  constructor(
    private store: Store
  ) {
    this.database = store.firebase.database();
  }

  get user$() { return this.store.user$; }
  get user() { return this.store.user; }

  writeUserData() {
    const user = this.store.firebase.auth().currentUser;
    try {
      this.database.ref(`users/${user.uid}`).set({
        displayName: user.displayName,
        email: user.email,
        providerId: user.providerId,
        timestamp: new Date().getTime()
      });
    } catch (err) {
      console.error(err);
    }
  }

}