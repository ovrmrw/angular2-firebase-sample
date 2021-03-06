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
import { FirebaseUser } from '../../src/types';

const user = {
  uid: '1234567890',
  name: 'test user',
  photoURL: ''
};

class MockStore {
  constructor() {
    console.log('MockStore');
    // firebase.initializeApp(firebaseConfig);
  }
  // user = {
  //   uid: '123456789',
  //   name: 'test',
  //   photoURL: ''
  // };
  user$ = Observable.of(user);
  status$ = Observable.of('signin');
}

class MockAppService {
  constructor() {
    console.log('MockAppService')
  }
  readUserData(): Observable<FirebaseUser> {
    return Observable.of(user);
  }
  writeUserData(user: firebase.User | null) {
    // console.log('writeUserData');
  }
}


describe('TEST: App Component', () => {
  /* >>> boilerplate */
  let builder: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      { provide: Store, useClass: MockStore },
      // { provide: AppService, useClass: MockService }
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  /* <<< boilerplate */


  it('can create, should have title', asyncPower(async () => {
    const fixture = await builder
      .overrideProviders(AppComponent, [{ provide: AppService, useClass: MockAppService }])
      .createAsync(AppComponent);
    const el = fixture.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(!!fixture);

    fixture.detectChanges();
    assert(component.userId === '12345678....');
    assert(component.userName === 'test user');
  }));

});
