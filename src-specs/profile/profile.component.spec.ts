/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { asyncPower, fakeAsyncPower, setTimeoutPromise, elements, elementText } from '../../test-ng2/testing.helper';
/* <<< boilerplate */

import { provide, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';
const firebaseConfig = require('../../config/firebase.json');
import { ProfileComponent } from '../../src/profile/profile.component';
import { ProfileService } from '../../src/profile/profile.service';
import { Store } from '../../src/store';
import { FirebaseUser } from '../../src/types'

const user = {
  uid: '123456789',
  photoURL: ''
};



class MockStore {
  constructor() {
    console.log('MockStore')
    firebase.initializeApp(firebaseConfig);
  }
  // user = {
  //   uid: '123456789',
  //   name: 'test',
  //   photoURL: ''
  // };
  user$ = Observable.of(user);
  status$ = Observable.of('signin');
  currentUser = user;
}


class MockProfileService {
  subject = new ReplaySubject();
  constructor() {
    console.log('MockService')
  }
  readUserData(): Observable<FirebaseUser> {
    console.log('readUserData')
    const user: FirebaseUser = {
      name: 'test'
    }
    this.subject.next(user);
    return this.subject;
  }
  writeUserData(name: string): void {
    console.log(name);
    console.log('writeUserData');
    // console.log('writeUserData');
  }
}


describe('TEST: Profile Component', () => {
  /* >>> boilerplate */
  let builder: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      { provide: Store, useClass: MockStore },
      // provide(ProfileService, { useClass: MockProfileService }), // Componentに直接インジェクトされているものはここには書かない。overrideProvidersに書く。
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  /* <<< boilerplate */


  it('can create, should have title', asyncPower(async () => {
    const fixture = await builder
      .overrideProviders(ProfileComponent, [{ provide: ProfileService, useClass: MockProfileService }]) // ComponentのServiceをモックにすり替える場合はここに書く。
      .createAsync(ProfileComponent);
    const el = fixture.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(!!fixture);

    fixture.detectChanges();
    assert(component.name === 'test');
  }));

});
