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
    const user = this.store.currentUser;
    const refPath = 'notes/' + user.uid;
    // const refPath = 'notes';
    firebase.database().ref(refPath).on('value', snapshot => {
      console.log(snapshot.val());
      console.log(lodash.toArray(snapshot.val()));
      this.notes = lodash.toArray<Note>(snapshot.val());
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {

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