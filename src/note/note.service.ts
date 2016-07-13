import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import firebase from 'firebase';
import uuid from 'node-uuid';
import lodash from 'lodash';

import { Store } from '../store';
import { FirebaseNote, FirebaseNoteIndex } from '../types';


@Injectable()
export class NoteService {
  disposableRefPaths: string[];


  constructor(
    private store: Store
  ) {
    /* initialize instance values */
    this.disposableRefPaths = [];
  }


  readNote$(noteid: string): Observable<FirebaseNote> {
    const notesRefPath = 'notes/' + noteid;
    const returner$ = new ReplaySubject<FirebaseNote>();

    /* onメソッドで監視することで変更検知してViewが更新される。 */
    firebase.database().ref(notesRefPath).on('value', snapshot => {
      const note: FirebaseNote = snapshot.val(); // rename
      returner$.next(note);
    });
    this.disposableRefPaths.push(notesRefPath);
    return returner$;
  }


  createNote(): FirebaseNote {
    const uid = this.store.currentUser.uid;
    return {
      noteid: uuid.v4(),
      title: '',
      content: '',
      author: { [uid]: true },
      sharedTo: {}
    };
  }


  /* notesIndexツリーとnotesツリーの両方に同時にwriteする */
  writeNote(note: FirebaseNote, oldNote: FirebaseNote): void {
    /* noteの内容に変更がある場合だけ処理を続行する */
    if (!note || !note.noteid || !oldNote || !oldNote.noteid || lodash.isEqual(note, oldNote)) {
      console.info('writeNote proccess is skipped, because updating is not needed.');
      return;
    }
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid + '/' + note.noteid;
    const notesRefPath = 'notes/' + note.noteid;
    note.timestamp = new Date().getTime();

    /* multiple writeするオブジェクトを前以って作成する。 */
    let updateMultiObj = {};
    updateMultiObj[notesIndexRefPath] = {
      noteid: note.noteid,
      readonly: false,
      timestamp: note.timestamp,
    } as FirebaseNoteIndex;
    updateMultiObj[notesRefPath] = note;

    /* multiple writeはsetメソッドでは不可。updateメソッドを使うこと。 */
    firebase.database().ref().update(updateMultiObj, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('writeNote completed.');
        // setPriorityをしてもorderByPriorityの結果は全くあてにならない。
        // firebase.database().ref(notesIndexRefPath).setPriority(this.note.timestamp, err => {
        //   if (err) {
        //     console.error(err);
        //   } else {
        //     console.log('setPriority completed.');
        //   }
        // });
      }
    });
  }


  /* noteをremoveするときはnotesとnotesIndexの両方をremoveする必要がある。 */
  removeNote(noteid: string): void {
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid + '/' + noteid;
    const notesRefPath = 'notes/' + noteid;
    firebase.database().ref(notesIndexRefPath).remove(() => {
      firebase.database().ref(notesRefPath).remove(() => {
        alert('Removed from 2 json trees.');
      });
    });
  }


  onDestroy() {
    lodash.uniq(this.disposableRefPaths).forEach(path => {
      firebase.database().ref(path).off();
    });
  }

}