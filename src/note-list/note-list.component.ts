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

  constructor(
    // private service: NoteService,
    private router: Router,
    private store: Store,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  notes: Note[] = [];

  ngOnInit() {
    console.log('note-list.component - ngOnInit')
    const user = this.store.currentUser;
    // const refPath = 'notes/' + user.uid;
    const refPath = 'notes';
    firebase.database().ref(refPath).orderByChild('author/' + user.uid).startAt(true).endAt(true).on('value', snapshot => {
      firebase.database().ref(refPath).orderByChild('sharedTo/' + user.uid).startAt(true).endAt(true).on('value', snapshot2 => {
        console.log('note-list');
        console.log(snapshot);
        console.log(snapshot.val());
        console.log(snapshot2.val());
        const merged = lodash.defaultsDeep(snapshot2.val() || {}, snapshot.val() || {});
        console.log(lodash.toArray(merged));
        this.notes = lodash.toArray<Note>(merged);
        this.cd.markForCheck();
      });
    });
  }

  ngOnDestroy() {
    const refPath = 'notes';
    firebase.database().ref(refPath).off();
  }

  toNote(note: Note) {
    this.router.go('/notes/' + note.noteid);
  }

  subscriptions: Subscription[];

}

interface Note {
  noteid: string;
  title: string;
  content: string;
}