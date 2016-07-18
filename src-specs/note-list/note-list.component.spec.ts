/* >>> boilerplate */
import assert from 'power-assert';
import lodash from 'lodash';
import { inject, async, fakeAsync, tick, addProviders, TestComponentBuilder, ComponentFixture } from '@angular/core/testing';
import { asyncPower, fakeAsyncPower, setTimeoutPromise, elements, elementText } from '../../test-ng2/testing.helper';
/* <<< boilerplate */

import { Observable } from 'rxjs/Rx';
import { Router, provideRouter, PathLocationStrategy } from '@ngrx/router';
import firebase from 'firebase';
const firebaseConfig = require('../../config/firebase.json');
import { routes } from '../../src/app/app.component';
import { NoteListComponent } from '../../src/note-list/note-list.component';
import { NoteListService } from '../../src/note-list/note-list.service';
import { Store } from '../../src/store';
import { FirebaseUser, FirebaseNote } from '../../src/types';

const user = {
  uid: '1234567890',
  name: 'test user',
  photoURL: ''
};

class MockStore {
  constructor() {
    console.log('MockStore');
  }
  user$ = Observable.of(user);
  status$ = Observable.of('signin');
}

class MockNoteListService {
  constructor() {
    console.log('MockNoteListService')
  }
  initNoteListReadStream(): Observable<FirebaseNote[]> {
    const notes: FirebaseNote[] = [
      { noteid: '1234', title: '1', content: 'a', timestamp: 1 },
      { noteid: '2345', title: '2', content: 'b', timestamp: 2 },
      { noteid: '3456', title: '3', content: 'c', timestamp: 3 },
    ];
    return Observable.of(notes);
  }
}


describe('TEST: NoteList Component', () => {
  /* >>> boilerplate */
  let builder: TestComponentBuilder;

  beforeEach(() => {
    addProviders([
      { provide: Store, useClass: MockStore },
      provideRouter(routes, PathLocationStrategy),
      Router,
    ]);
  });

  beforeEach(inject([TestComponentBuilder], (tcb) => {
    builder = tcb;
  }));
  /* <<< boilerplate */


  it('can create, should have title', asyncPower(async () => {
    const fixture = await builder
      .overrideProviders(NoteListComponent, [{ provide: NoteListService, useClass: MockNoteListService }])
      .createAsync(NoteListComponent);
    const el = fixture.nativeElement as HTMLElement;
    const component = fixture.componentRef.instance;
    assert(!!fixture);

    fixture.detectChanges();

// assert(component.notes.)
    //assert(component.notes[0].noteid === '34561');
  }));

});
