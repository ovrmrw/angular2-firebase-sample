import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Page1Component } from '../page1/page1.component';
import { AppService } from './app.service';


@Component({
  selector: 'sg-app',
  template: `
    <h3>{{title}}</h3>
    <nav>
      <a linkTo="/">Home</a>
      <a linkTo="/blog">Foo(empty)</a>
    </nav>
    <route-view></route-view>
  `,
  providers: [AppService],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  constructor(
    private service: AppService
  ) {
    this.service.jumpSignInPageIfUserIsNotLoggedIn();
  }

  ngOnInit() { }

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