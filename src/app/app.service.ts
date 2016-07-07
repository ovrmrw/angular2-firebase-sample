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
    if (this.user && this.user.uid) {
      this.database.ref('users/' + this.user.uid).set({
        username: this.user.displayName,
        email: this.user.email
      });
    }
  }

}