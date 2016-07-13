import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';
import firebase from 'firebase';

import { Store } from '../store';
import { FirebaseNote, FirebaseNoteIndex } from '../types';


@Injectable()
export class NoteListService {

  notes$: ReplaySubject<FirebaseNote[]>;
  disposableRefPaths: string[];


  constructor(
    private store: Store
  ) {
    /* initialize instance values */
    this.notes$ = new ReplaySubject<FirebaseNote[]>();
    this.disposableRefPaths = [];
  }


  // TODO: timestampが変わっているnoteだけ新しいデータを取得するようにする。現状は毎回全noteを取得している。
  /* notesIndexツリーのindexを取得してからnotesツリーのnote実体を取得する、という多段クエリ */
  initNoteListReadStream(): Observable<FirebaseNote[]> {
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid;

    /* onメソッドはObservableを生成し、offメソッドをコールするまで待機し続ける。 */
    firebase.database().ref(notesIndexRefPath).orderByChild('timestamp').limitToLast(100).on('value', snapshot => {
      let noteIndices: FirebaseNoteIndex[] = lodash.toArray(snapshot.val()); // rename, reshape
      noteIndices = lodash.orderBy(noteIndices, ['timestamp'], ['desc']); // timestampをキーとして降順で並び替え

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

      /* noteIndexに基づいてnoteを取得する。onceメソッドは非同期のため完了は順不同となる。(本当に？) */
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
    this.disposableRefPaths.push(notesIndexRefPath);
    return this.notes$;
  }


  /* ComponentのngOnDestroyから呼ばれる。 */
  onDestroy(): void {
    /* onメソッドによる監視を解除する */
    lodash.uniq(this.disposableRefPaths).forEach(path => {
      firebase.database().ref(path).off();
    });

    this.store.disposeSubscriptions();
  }

}