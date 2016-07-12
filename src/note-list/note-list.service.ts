import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';
import firebase from 'firebase';

import { Store } from '../store';
import { FirebaseNote, FirebaseNoteIndex } from '../types';


@Injectable()
export class NoteListService {

  notesIndexRefPath: string;
  notes$ = new ReplaySubject<FirebaseNote[]>();

  constructor(
    private store: Store
  ) { }


  initNoteListReadStream(): Observable<FirebaseNote[]> {
    const uid = this.store.currentUser.uid;
    this.notesIndexRefPath = 'notesIndex/' + uid;

    /* onメソッドはObservableを生成し、offメソッドをコールするまで待機し続ける。 */
    firebase.database().ref(this.notesIndexRefPath).orderByChild('timestamp').limitToLast(100).on('value', snapshot => {
      const noteIndices: FirebaseNoteIndex[] = lodash.toArray(snapshot.val());
      /* array sort reverse by timestamp */
      noteIndices.sort((a, b) => a.timestamp > b.timestamp ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0));

      const notes: FirebaseNote[] = [];

      /* note取得ループの最後にnotes$.nextしてComponentにストリームを流す。 */
      console.log('noteIndices.length: ' + noteIndices.length);
      const markForCheckSubject = new Subject<number>();
      const disposable = markForCheckSubject
        .scan((p, value) => p + value, 0)
        .do(counter => {
          console.log('counterSubject: ' + counter);
          if (counter === noteIndices.length) {
            this.notes$.next(notes);
            disposable.unsubscribe();
          }
        })
        .subscribe();

      /* 
        noteIndexに基づいてnoteを取得する。onceメソッドは非同期のため完了は順不同となる。
        そのためnotes配列に一旦集めてからnotes$.nextでComponentにまとめて送るようにしている。 
      */
      noteIndices.forEach((noteIndex, i) => {
        const notesRefPath = 'notes/' + noteIndex.noteid;
        firebase.database().ref(notesRefPath).once('value', snapshot => {
          const note: FirebaseNote = snapshot.val();
          notes.push(note);
          markForCheckSubject.next(1);
        });
      });
    }, err => {
      console.error(err);
    });
    return this.notes$ as Observable<FirebaseNote[]>;
  }


  /* ComponentのngOnDestroyから呼ばれる。 */
  destroy(): void {
    const uid = this.store.currentUser.uid;
    firebase.database().ref(this.notesIndexRefPath).off(); // これを書かないと表示がおかしくなる。
    this.store.disposeSubscriptions();
  }

}