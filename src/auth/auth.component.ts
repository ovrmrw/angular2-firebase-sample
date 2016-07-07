import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import firebase from 'firebase';

import { AuthService } from './auth.service';


@Component({
  selector: 'sg-auth',
  template: `
    <div *ngIf="!(user$ | async)">
      <button (click)="signIn()">Google Sign In</button>
      <button (click)="firebaseui()">Firebase UI</button>
    </div>
    <div *ngIf="(user$ | async)">
      <button (click)="signOut()">Sign Out</button>
      <div>{{userName$ | async}} としてログイン中</div>
    </div>
  `,
  providers: [AuthService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit {

  constructor(
    private service: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  signIn() {
    this.service.signInGoogleAuth();
  }

  signOut() {
    this.service.signOut();
  }

  firebaseui() {
    window.location.href = '/firebase-auth.html';
  }

  get user$() { return this.service.user$; }
  get userName$() { return this.service.userName$; }

}