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
    this.watcher();
  }

  get user$() { return this.store.user$; }

  watcher() {
    this.store.user$
      .combineLatest(x => x)
      .do(user => {
        this.database.ref('users/' + user.uid).on('value', snapshot => {
          console.log(snapshot.val());
        });
      })
      .subscribe();
  }

  writeUserData() {
    this.store.user$
      .do(user => {
        this.database.ref('users/' + user.uid).set({
          username: user.displayName,
          email: user.email
        });
      })
      .subscribe().unsubscribe();
  }
}