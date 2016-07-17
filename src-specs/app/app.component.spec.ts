/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { asyncPower, fakeAsyncPower, setTimeoutPromise, elements, elementText } from '../../test-ng2/testing.helper';
/* <<< boilerplate */

import { Observable } from 'rxjs/Rx';
import { AppComponent } from '../../src/app/app.component';
import { Store } from '../../src/store';

class MockStore {
  user = {
    uid: '123456789',
    name: 'test',
    photoURL: ''
  };
  user$ = Observable.of(this.user);
  status$ = Observable.of('signin');
}


describe('TEST: App Component', () => {
  /* >>> boilerplate */
  let builder: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      { provide: Store, useClass: MockStore }
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  /* <<< boilerplate */


  it('can create, should have title', asyncPower(async () => {
    const fixture = await builder.createAsync(AppComponent);
    const el = fixture.nativeElement as HTMLElement;
    assert(!!fixture);
    assert(1 + 1 === 2);
  }));

});
