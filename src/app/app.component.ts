import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Page1Component } from '../page1/page1.component';
import { AppService } from './app.service';
import { FirebaseUiComponent } from '../firebaseui/fbui.component';


@Component({
  selector: 'sg-app',
  template: `
    <h3>{{title}}</h3>
    <nav>
      <a linkTo="/">Home</a>
      <a linkTo="/blog">Foo(empty)</a>
    </nav>

    <div *ngIf="!(user | async)">
      <button (click)="login()">Google LogIn</button>
    </div>
    <div *ngIf="(user | async)">
      <button (click)="logout()">Google LogOut</button>
      <div>{{email | async}} としてログイン中</div>
    </div>
    
    <route-view *ngIf="(user | async)"></route-view>
  `,
  providers: [AppService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService
  ) { }

  ngOnInit() { }

  login() {
    this.service.loginGoogleAuth();
  }

  logout() {
    this.service.logout();
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