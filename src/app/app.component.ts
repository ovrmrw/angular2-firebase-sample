import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { Store } from '../store';
import { Page1Component } from '../page1/page1.component';
import { AuthComponent } from '../auth/auth.component';
import { NoteComponent } from '../note/note.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'sg-app',
  template: `
    <ng-container *ngIf="(user$ | async)">
      <header class="navbar navbar-light navbar-static-top bd-navbar" role="banner">
        <div class="clearfix">
          <button class="navbar-toggler pull-xs-right hidden-sm-up" type="button" data-toggle="collapse" data-target="#bd-main-nav">
            &#9776;
          </button>
          <a class="navbar-brand hidden-sm-up" linkTo="/">Bootstrap</a>
        </div>
        <div class="nabvar-collapse collapse navbar-toggleable-xs" id="bd-main-nav">
          <nav class="nav navbar-nav">
              <a class="nav-item nav-link" linkTo="/">Home</a>
              <a class="nav-item nav-link" linkTo="/profile">Profile</a>
              <a class="nav-item nav-link" linkTo="/note">Note</a>            
              <a class="nav-item nav-link" linkTo="#" (click)="signOut()">Sign Out</a>
          </nav>
        </div>
      </header>
    </ng-container>    

    <ng-container *ngIf="(user$ | async)">
      <button type="button" class="btn btn-primary-outline" (click)="writeUserData()">Write User Data</button>
      <route-view></route-view>
      <hr />
      <footer>
        <div>UserId: {{userId$ | async}}</div>
      </footer>
    </ng-container>

    <ng-container *ngIf="(status$ | async) === 'signout'">
      <h3>firebase-sample</h3>
      <button type="button" class="btn btn-primary-outline" (click)="firebaseUiAuth()">Sign In</button>
    </ng-container>
    <ng-container *ngIf="!(status$ | async)">
      <div>Loading...</div>
    </ng-container>
  `,
  styles: [require('./app.style.css')],
  directives: [AuthComponent],
  providers: [AppService, AuthService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService,
    private auth: AuthService,
    private store: Store
  ) { }

  ngOnInit() { }

  writeUserData() {
    this.service.writeUserData();
  }

  firebaseUiAuth() {
    window.location.href = '/firebaseui-auth.html';
  }

  signOut() {
    this.auth.signOut();
  }

  get user$() { return this.service.user$; }
  get userId$() { return this.user$.map(user => user.uid.slice(0, 6) + '....'); }
  get status$() { return this.store.status$; }

  title: string = 'firebase-sample';
}


import { Routes } from '@ngrx/router';
export const routes: Routes = [
  {
    path: '/',
    component: Page1Component
  },
  {
    path: '/note',
    component: NoteComponent
  },
  {
    path: '/profile',
    component: ProfileComponent
  },
  // {
  //   path: '/blog',
  //   component: BlogPage,
  //   children: [
  //     {
  //       path: ':id',
  //       component: PostPage
  //     }
  //   ]
  // }
];