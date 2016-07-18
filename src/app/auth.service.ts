import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Store } from '../store';


@Injectable()
export class AuthService {
  private googleProvider: firebase.auth.GoogleAuthProvider;

  constructor(
    private store: Store
  ) {
    // this.googleProvider = new firebase.auth.GoogleAuthProvider();
    // this.googleProvider.addScope('https://www.googleapis.com/auth/plus.login');
  }

  signInGoogleAuth() {
    this.store.firebase.auth().signInWithRedirect(this.googleProvider);
  }

  signOut() {
    this.store.firebase.auth().signOut();
    window.location.reload();
  }

  // get user$() { return this.store.user$; }
  // get userName$() { return this.store.userName$; }
}