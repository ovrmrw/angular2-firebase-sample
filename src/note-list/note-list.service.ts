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


  /* この仕組みを使って差分だけデータを取得する関数を作る */
  experiment() {
    let a = [{ key: 'x', timestamp: '100' }];
    let b = [{ key: 'x', timestamp: '200' }];
    let c = lodash.union(a, b); // 2つの配列を1つにまとめる。
    console.log(c); // [{ key: 'x', timestamp: '100' }, { key: 'x', timestamp: '200' }]

    let d = lodash.unionBy(a, b, 'key'); // 2つの配列を1つにまとめ、同一キーのオブジェクトは左にあるものが生きる。(この場合はa)
    console.log(d); // [{ key: 'x', timestamp: '100' }]

    let e = lodash.unionBy(b, a, 'key'); // 2つの配列を1つにまとめ、同一キーのオブジェクトは左にあるものが生きる。(この場合はb)
    console.log(e); // [{ key: 'x', timestamp: '200' }]

    let f = [{ key: 'x', timestamp: '100' }, { key: 'x', timestamp: '200' }];
    let g = lodash.uniqBy(f, 'key'); // 同一キーのオブジェクトは左にあるものが生きる。
    console.log(g); // [{ key: 'x', timestamp: '100' }]

    let h = [{ key: 'x', timestamp: '200' }, { key: 'x', timestap: '100' }];
    let i = lodash.uniqBy(h, 'key');
    console.log(i); // [{ key: 'x', timestamp: '200' }]
  }


  /* 
    notesIndexツリーのindexを取得してからnotesツリーのnote実体を取得する、という多段クエリ。
    Data Transferを節約するため、更新の必要があるnodeIndexだけを抽出する。 
  */
  initNoteListReadStream(): Observable<FirebaseNote[]> {
    // this.experiment();
    const uid = this.store.currentUser.uid; // shorthand
    const notesIndexRefPath = 'notesIndex/' + uid;

    /* onメソッドはObservableを生成し、offメソッドをコールするまで待機し続ける。 */
    firebase.database().ref(notesIndexRefPath).orderByChild('timestamp').limitToLast(100).on('value', snapshot => {
      const noteIndices: FirebaseNoteIndex[] = lodash.toArray(snapshot.val()); // rename, reshape

      let cachedNotes = this.store.cachedNotes; // Storeに保存してあるcachedNotesを取得する

      /* 更新の必要があるnoteIndexだけを抽出する */
      let differenceNoteIndices = noteIndices
        .filter(noteIndex => {
          const notes = cachedNotes.filter(note => note.noteid === noteIndex.noteid);
          if (notes.length > 0 && notes[0].timestamp === noteIndex.timestamp) {
            return false; // noteidとtimestampが同一のnoteは更新の必要がない
          }
          return true;
        });
      differenceNoteIndices = lodash.orderBy(differenceNoteIndices, ['timestamp'], ['desc']); // timestampの降順で並び替える
      console.log('differenceNoteIndices: ');
      console.log(differenceNoteIndices);

      /* noteIndexに基づいてnoteを取得する。onceメソッドは非同期のため完了は順不同となる。(本当に？) */
      if (differenceNoteIndices.length > 0) {
        differenceNoteIndices.forEach(noteIndex => {
          const notesRefPath = 'notes/' + noteIndex.noteid;
          firebase.database().ref(notesRefPath).once('value', snapshot => {
            const note: FirebaseNote = snapshot.val(); // rename
            cachedNotes.unshift(note); // cachedNotesの先頭にnoteを追加
            cachedNotes = lodash.uniqBy(cachedNotes, 'noteid'); // noteidの重複をまとめる。(先頭寄りにあるものを生かす)
            cachedNotes = lodash.orderBy(cachedNotes, ['timestamp'], ['desc']); // timestampの降順で並べ替える
            this.notes$.next(cachedNotes);
            this.store.cachedNotes = cachedNotes; // 新しいcachedNotesをStoreのcachedNotesに書き戻す
          });
        });
      } else {
        this.notes$.next(cachedNotes);
      }
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