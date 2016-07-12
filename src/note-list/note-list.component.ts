import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import firebase from 'firebase';
import lodash from 'lodash';
import { Router } from '@ngrx/router';
// import uuid from 'node-uuid';

// import { NoteService } from './note.service';
import { ContenteditableModel } from '../contenteditable-model';
import { Store } from '../store';
import { ReplaceLinePipe } from './replace-line.pipe';
import { FirebaseNote, FirebaseNoteIndex } from '../types';

@Component({
  selector: 'sg-note-list',
  template: `
    <div class="card-columns">
      <div class="card card-block" *ngFor="let note of notes" (click)="toNote(note)">
        <h4 class="card-title">{{note.title}}</h4>
        <div class="card-text" [innerHtml]="note.content | replaceLine"></div>
      </div>
    </div>
  `,
  styles: [require('./note-list.style.css')],
  pipes: [ReplaceLinePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent implements OnInit {
  notes: FirebaseNote[] = [];

  constructor(
    // private service: NoteService,
    private router: Router,
    private store: Store,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid;
    firebase.database().ref(notesIndexRefPath).orderByChild('timestamp').limitToLast(100).on('value', snapshot => {
      let noteIndices: FirebaseNoteIndex[] = lodash.toArray(snapshot.val());
      /* reverse by timestamp */
      noteIndices.sort((a, b) => a.timestamp > b.timestamp ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0));
      this.notes = [];
      // console.log('note-list');
      // console.log(noteIndices);
      noteIndices.forEach((noteIndex, i) => {
        const notesRefPath = 'notes/' + noteIndex.noteid;
        firebase.database().ref(notesRefPath).once('value', snapshot => {
          const note: FirebaseNote = snapshot.val();
          // this.notes.push(snapshot.val());          
          // console.log(notesRefPath);
          // console.log(note);
          this.notes.push(note);
          // if (i === noteIndices.length - 1) {
            this.cd.markForCheck();
          // }
        });
      });
    }, err => {
      console.error(err);
    });
  }

  ngOnDestroy() {
    const uid = this.store.currentUser.uid;
    const notesIndexRefPath = 'notesIndex/' + uid;
    firebase.database().ref(notesIndexRefPath).off(); // これを書かないと表示がおかしくなる。
  }

  toNote(note: FirebaseNote) {
    this.router.go('/notes/' + note.noteid);
  }

  subscriptions: Subscription[];

}