import { Injectable } from '@angular/core';
import firebase from 'firebase';

import { Store } from '../store';
import { Note } from './note.component';


@Injectable()
export class NoteService {
  database: firebase.database.Database;

  constructor(
    private store: Store
  ) {
    this.database = store.firebase.database();
  }

  writeNote(note: Note) {
    const user = this.store.firebase.auth().currentUser;
    try {
      this.database.ref(`notes/${user.uid}/${note.uuid}`).set({
        title: note.title,
        content: note.content,
        timestamp: new Date().getTime()
      });
    } catch (err) {
      console.error(err);
    }
  }
}