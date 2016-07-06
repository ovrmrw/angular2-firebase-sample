import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { AppService } from './app.service';
import { Page1Component } from '../page1/page1.component';
import { AuthComponent } from '../auth/auth.component';


@Component({
  selector: 'sg-app',
  template: `
    <sg-auth></sg-auth>

    <ng-container *ngIf="(user$ | async)">
      <h3>{{title}}</h3>
      <nav>
        <a linkTo="/">Home</a>
        <a linkTo="/blog">Foo(empty)</a>
      </nav>
      <button (click)="writeUserData()">writeUserData</button>
      <route-view></route-view>
    </ng-container>    
  `,
  directives: [AuthComponent],
  providers: [AppService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService
  ) { }

  ngOnInit() { }

  writeUserData(){
    this.service.writeUserData();
  }

  get user$() { return this.service.user$; }

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