import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Page1Component } from '../page1/page1.component';
import { AppService } from './app.service';
import { FirebaseUiComponent } from '../firebaseui/fbui.component';


@Component({
  selector: 'sg-app',
  template: `
    <div *ngIf="!(user | async)">
      <button (click)="signIn()">Google Sign in</button>
      <button (click)="firebaseui()">Firebase UI</button>
    </div>
    <div *ngIf="(user | async)">
      <button (click)="signOut()">Sign out</button>
      <div>{{email | async}} としてログイン中</div>
    </div>

    <div *ngIf="(user | async)">
      <h3>{{title}}</h3>
      <nav>
        <a linkTo="/">Home</a>
        <a linkTo="/blog">Foo(empty)</a>
      </nav>
      <route-view></route-view>
    </div>    
  `,
  providers: [AppService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService
  ) { }

  ngOnInit() { }

  signIn() {
    this.service.signInGoogleAuth();
  }

  signOut() {
    this.service.signOut();
  }

  firebaseui(){
    window.location.href = 'signin.html';
  }

  get user() { return this.service.user$; }
  get email() { return this.service.user$.map(user => user.email); }

  title: string = 'top component';
}


import { Routes } from '@ngrx/router';
export const routes: Routes = [
  {
    path: '/',
    component: Page1Component
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