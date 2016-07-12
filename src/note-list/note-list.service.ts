import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';
import firebase from 'firebase';

import { Store } from '../store';
import { FirebaseNote, FirebaseNoteIndex } from '../types';


@Injectable()
export class NoteListService {

  notes$ = new ReplaySubject<FirebaseNote[]>();
  disposablePaths: string[] = [];

  constructor(
    private store: Store
  ) { }


  initNoteListReadStream(): Observable<FirebaseNote[]> {
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid;

    /* onメソッドはObservableを生成し、offメソッドをコールするまで待機し続ける。 */
    firebase.database().ref(notesIndexRefPath).orderByChild('timestamp').limitToLast(100).on('value', snapshot => {
      const noteIndices: FirebaseNoteIndex[] = lodash.toArray(snapshot.val()); // rename, reshape
      /* array sort reverse by timestamp */
      noteIndices.sort((a, b) => a.timestamp > b.timestamp ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0));

      const notes: FirebaseNote[] = [];

      /* note取得ループの最後にnotes$.nextしてComponentにストリームを流す。 */
      /* DEPRECATED
      console.log('noteIndices.length: ' + noteIndices.length);
      const markForCheckSubject = new Subject<number>();
      const disposable = markForCheckSubject
        .scan((p, value) => p + value, 0)
        .do(counter => {
          console.log('markForCheckSubject: ' + counter);
          if (counter === noteIndices.length) {
            this.notes$.next(notes);
            disposable.unsubscribe();
          }
        })
        .subscribe();
      */

      /* 
        noteIndexに基づいてnoteを取得する。onceメソッドは非同期のため完了は順不同となる。
        そのためnotes配列に一旦集めてからnotes$.nextでComponentにまとめて送るようにしている。 
      */
      noteIndices.forEach((noteIndex, i) => {
        const notesRefPath = 'notes/' + noteIndex.noteid;
        firebase.database().ref(notesRefPath).once('value', snapshot => {
          const note: FirebaseNote = snapshot.val(); // rename
          notes.push(note);
          this.notes$.next(notes);
          // markForCheckSubject.next(1); /* DEPRECATED */
        });
      });
    }, err => {
      console.error(err);
    });
    this.disposablePaths.push(notesIndexRefPath);
    return this.notes$;
  }


  /* ComponentのngOnDestroyから呼ばれる。 */
  onDestroy(): void {
    /* onメソッドによる監視を解除する */
    lodash.uniq(this.disposablePaths).forEach(path => {
      firebase.database().ref(path).off();
    });

    this.store.disposeSubscriptions();
  }

}