import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Store } from '../store/store';

@Injectable()
export class FirebaseUiService {
  private googleProvider: firebase.auth.GoogleAuthProvider;

  constructor(
    private store: Store
  ) {
    this.googleProvider = new firebase.auth.GoogleAuthProvider();
    this.googleProvider.addScope('https://www.googleapis.com/auth/plus.login');
  }

  loginGoogleAuth() {
    this.store.firebase.auth().signInWithRedirect(this.googleProvider);
  }

  logout() {
    this.store.firebase.auth().signOut();
  }

  get user$() { return this.store.user$; }
}