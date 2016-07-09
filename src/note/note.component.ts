import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';
import { RouteParams, Router } from '@ngrx/router';
import firebase from 'firebase';

import { NoteService } from './note.service';
import { ContenteditableModel } from '../contenteditable-model';
import { Store } from '../store';


@Component({
  selector: 'sg-note',
  template: `
    {{noteid}}
    <!-- <button (click)="newNote()">Create New Note</button> -->
    <div class="markdown-body">
      <!-- <h3 contenteditable="true" [(contenteditableModel)]="(note | async).title"></h3> -->    
      <!-- <div contenteditable="true" [(contenteditableModel)]="(note | async).content"></div> -->

    </div>
    <form #form="ngForm" *ngIf="note">
      <fieldset class="form-group" ngModelGroup="note">
        <label for="note-title">Title</label>
        <input type="text" class="form-control" id="note-title" placeholder="title" name="title" [(ngModel)]="note.title">
        <label for="note-content">Content</label>
        <textarea class="form-control" id="note-content" rows="8" placeholder="content" name="content" [(ngModel)]="note.content"></textarea>
        <div contenteditable="true" [(contenteditableModel)]="note.content"></div>
      </fieldset>
    </form>
    <button type="button" class="btn btn-warning" (click)="deleteNote()">DELETE</button>
    <hr />
    <div class="markdown-body">{{note | json}}</div>
  `,
  directives: [ContenteditableModel],
  providers: [NoteService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {
  // noteid$: Observable<string>;
  noteid: string;
  noteRefPath: string;

  constructor(
    private store: Store,
    private params$: RouteParams,
    private service: NoteService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.disposableSubscriptions = [
      this.params$.pluck<string>('id')
        .do(id => {
          if (id) {
            const user = this.store.user;
            this.noteRefPath = 'notes/' + user.uid + '/' + id;
            firebase.database().ref(this.noteRefPath).once('value', snapshot => {
              const note: Note = snapshot.val();
              console.log(note);
              this.note = note;
              this.cd.markForCheck();
            });
          } else {
            this.note = {
              noteid: uuid.v4(),
              title: '',
              content: ''
            };
            this.cd.markForCheck();
          }
        })
        .subscribe(),

      Observable.fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup')
        .debounceTime(1000 * 2)
        .do(event => {
          this.service.writeNote(this.note);
        })
        .subscribe()
    ];
  }

  ngOnDestroy() {
    this.service.writeNote(this.note);
    this.disposableSubscriptions.forEach(s => s.unsubscribe());
  }

  deleteNote() {
    this.note = { title: '', content: '' };
    firebase.database().ref(this.noteRefPath).remove(() => alert('Deleted.'));
    this.router.go('/notes');
  }

  // newNote() {
  //   this.uuid = uuid.v4();
  //   this.title = 'new note';
  //   this.content = '(content)';
  // }

  uuid: string;
  title: string;
  content: string;
  note: Note;

  disposableSubscriptions: Subscription[];

}


export interface Note {
  noteid?: string;
  title: string;
  content: string;
}