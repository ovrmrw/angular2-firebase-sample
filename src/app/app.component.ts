import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { Store } from '../store';
import { NoteComponent } from '../note/note.component';
import { NoteListComponent } from '../note-list/note-list.component';
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
          <a class="navbar-brand hidden-sm-up" linkTo="/">Sample</a>
        </div>
        <div class="nabvar-collapse collapse navbar-toggleable-xs" id="bd-main-nav">
          <nav class="nav navbar-nav">       
            <a class="nav-item nav-link" linkTo="/notes">Notes</a>
            <a class="nav-item nav-link" linkTo="/note">Note</a>
            <a class="nav-item nav-link" linkTo="/profile">Profile</a>
            <a class="nav-item nav-link" linkTo="#" (click)="signOut()">Sign Out</a>
          </nav>
        </div>
      </header>
    </ng-container>    

    <ng-container *ngIf="(user$ | async)">
      <!-- <button type="button" class="btn btn-primary-outline" (click)="writeUserData()">Write User Data</button> -->
      <route-view></route-view>
      <hr />
      <footer>
        <div>UserId: {{userId}}, UserName: {{userName}}</div>
        <div><img [src]="photoURL" class="img-circle" width=80 height=80 alt="photo"></div>
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
  providers: [AppService, AuthService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService,
    private auth: AuthService,
    private store: Store,
    private cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    this.user$
      .do(user => {
        if (user) {
          // サインイン後の処理をここに書く。
          this.service.readUserData(user)
            .subscribe(userData => {
              if (user) { // これがないとnull checkで引っかかる。
                this.userId = user.uid.slice(0, 8) + '....';
                this.userName = userData.name || '(unknown)';
                this.photoURL = user.photoURL;
                this.cd.markForCheck();
              }
            });
          this.service.writeUserData(user);
        }
      })
      .subscribe();
  }


  firebaseUiAuth() {
    window.location.href = '/firebaseui-auth.html';
  }


  signOut() {
    this.auth.signOut();
  }


  get user$() { return this.store.user$; }
  get status$() { return this.store.status$; }


  userId: string;
  userName: string;
  photoURL: string;
  title: string = 'firebase-sample';
}


/////////////////////////////////////////////////////////////////////////////////
// Routes
import { Routes } from '@ngrx/router';
export const routes: Routes = [
  {
    path: '/',
    component: NoteListComponent
  },
  {
    path: '/notes',
    component: NoteListComponent,
  },
  {
    path: '/notes/:id',
    component: NoteComponent
  },
  {
    path: '/note',
    component: NoteComponent
  },
  {
    path: '/profile',
    component: ProfileComponent
  },
];