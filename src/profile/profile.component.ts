import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
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
export class ProfileComponent implements OnInit {
  constructor(
    private store: Store,
    private service: ProfileService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const user = this.store.user;
    this.service.readUserData(user)
      .then(userData => {
        this.name = userData.name;
        this.cd.markForCheck();
      });
  }

  writeUserData(profile: FirebaseUser) {
    const user = this.store.user;
    this.service.writeUserData(user, profile);
  }


  name: string;
}