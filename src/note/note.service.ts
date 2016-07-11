import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';

import { Store } from '../store';
import { FirebaseNote } from '../types';


@Injectable()
export class NoteService {
  database: firebase.database.Database;

  constructor(
    private store: Store
  ) {
    this.database = store.firebase.database();
  }

  readNote(noteid: string): Observable<FirebaseNote> {
    const refPath = 'notes/' + noteid;
    const subject = new ReplaySubject<FirebaseNote>();
    firebase.database().ref(refPath).once('value', snapshot => {
      subject.next(snapshot.val());
    });
    return subject;
  }

  writeNote(note: FirebaseNote): void {
    const refPath = /notes/ + note.noteid;
    note.timestamp = new Date().getTime();
    this.store.writeToDb(refPath, note);
  }

  deleteNote(noteid: string) {
    const refPath = 'notes/' + noteid;
    firebase.database().ref(refPath).remove(() => alert('Deleted.'));
  }
}