import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import firebase from 'firebase';
import lodash from 'lodash';

import { Store } from '../store';
import { ContenteditableModel } from '../contenteditable-model';


@Component({
  moduleId: module.id,
  selector: 'sg-profile',
  template: `
    <form #form="ngForm">
      <fieldset class="form-group" ngModelGroup="profile">
        <label for="profile-name">Name</label>
        <input type="text" class="form-control" id="profile-name" placeholder="your name" name="name" ngModel>
      </fieldset>
    </form>
    <pre>{{form.value | json}}</pre>
    <button type="button" class="btn btn-primary-outline" (click)="rewriteUser(form.value)">Rewrite User Data</button>
    <hr />
    <button type="button" class="btn btn-primary-outline" (click)="ok()">OK</button>
    <button type="button" class="btn btn-secondary-outline" (click)="cancel()">CANCEL</button>
  `,
  directives: [ContenteditableModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  constructor(
    private store: Store
  ) { }

  ngOnInit() {
    const user = this.store.user;
  }

  rewriteUser(value: Profile) {
    const profile = lodash.cloneDeep(value.profile);
    const user = this.store.user;
    profile.uid = this.store.user.uid;
    const refPath = 'users/' + user.uid;
    firebase.database().ref(refPath).once('value').then(snapshot => {
      const newData = lodash.defaultsDeep(profile, snapshot.val());
      firebase.database().ref(refPath).set(newData);
    });
  }

  ok() {
    alert('TODO: ok!');
  }

  cancel() {
    alert('TODO: cancel!');
  }

  profile: Profile;
  text: string;
}



export interface Profile {
  profile: {
    uid: string;
    name: string;
  }
}