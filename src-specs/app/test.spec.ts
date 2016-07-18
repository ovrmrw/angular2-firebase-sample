/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { asyncPower, fakeAsyncPower, setTimeoutPromise, elements, elementText } from '../../test-ng2/testing.helper';
/* <<< boilerplate */

import { Observable } from 'rxjs/Rx';
import firebase from 'firebase';
const firebaseConfig = require('../../config/firebase.json');
import { AppComponent } from '../../src/app/app.component';
import { AppService } from '../../src/app/app.service';
import { Store } from '../../src/store';


const user = {
  uid: '123456789',
  name: 'test',
  photoURL: ''
};

class MockStore {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }
  // user = {
  //   uid: '123456789',
  //   name: 'test',
  //   photoURL: ''
  // };
  user$ = Observable.of(user);
  status$ = Observable.of('signin');
}

class MockService {
  readUserData(user: firebase.User) {
    return user;
  }
  writeUserData(user: firebase.User | null) {
    // console.log('writeUserData');
  }
  test() {
    console.log('test method');
  }
}


describe('TEST: Test', () => {
  /* >>> boilerplate */
  let builder: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      // { provide: Store, useClass: MockStore },
      // { provide: AppService, useClass: MockService }
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  /* <<< boilerplate */


  it('checking testing environment', asyncPower(async () => {
    assert(1 + 1 === 2);
  }));

});
