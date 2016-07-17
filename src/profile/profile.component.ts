import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
// import firebase from 'firebase';
import lodash from 'lodash';

import { FirebaseUser } from '../types';
import { ContenteditableModel } from '../contenteditable-model';
import { ProfileService } from './profile.service';
import { Store } from '../store';


@Component({
  selector: 'sg-profile',
  template: `
    <form #form="ngForm">
      <label for="profile-name">Name</label>
      <input type="text" class="form-control" id="profile-name" placeholder="your name" name="name" [(ngModel)]="name">
    </form>
    <button type="button" class="btn btn-primary-outline" (click)="writeUserData()">Overwrite User Data</button>
  `,
  directives: [ContenteditableModel],
  providers: [ProfileService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private service: ProfileService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }


  ngOnInit() {
    this.store.disposable = this.service.readUserData()
      .do(userData => {
        this.name = userData.name || '';
        this.cd.markForCheck();
      })
      .subscribe();

    this.store.disposable = Observable.fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup')
      .debounceTime(100)
      .do(() => {
        this.writeUserData();
      })
      .subscribe();
  }


  ngOnDestroy() {
    this.store.disposeSubscriptions();
    this.service.onDestroy();
  }


  writeUserData() {
    this.service.writeUserData(this.name);
  }


  private name: string;
}