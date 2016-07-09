import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { FormGroup, FormControl } from '@angular/forms';
import firebase from 'firebase';
import lodash from 'lodash';

import { FirebaseUser } from '../types';
import { ContenteditableModel } from '../contenteditable-model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'sg-profile',
  template: `
    <form #form="ngForm">
      <label for="profile-name">Name</label>
      <input type="text" class="form-control" id="profile-name" placeholder="your name" name="name" [(ngModel)]="name">
    </form>
    <button type="button" class="btn btn-primary-outline" (click)="writeUserData(form.value)">Overwrite User Data</button>
  `,
  directives: [ContenteditableModel],
  providers: [ProfileService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  constructor(
    private service: ProfileService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.disposableSubscriptions = [
      this.service.readUserData()
        .subscribe(userData => {
          this.name = userData.name;
          this.cd.markForCheck();
        }),
    ];
  }

  ngOnDestroy() {
    this.disposableSubscriptions.forEach(s => s.unsubscribe());
  }

  writeUserData(profile: FirebaseUser) {
    this.service.writeUserData(profile);
  }


  name: string;
  disposableSubscriptions: Subscription[] = [];
}