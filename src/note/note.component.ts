import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';
import { RouteParams, Router } from '@ngrx/router';
import firebase from 'firebase';

import { NoteService } from './note.service';
import { ContenteditableModel } from '../contenteditable-model';
import { Store } from '../store';
import { FirebaseNote, FirebaseNoteIndex } from '../types';


@Component({
  selector: 'sg-note',
  template: `
    <form #form="ngForm" *ngIf="note">
      <fieldset class="form-group" ngModelGroup="note">
        <label for="note-title">Title</label>
        <input type="text" class="form-control" id="note-title" placeholder="title" name="title" [(ngModel)]="note.title">
        <label for="note-content">Content</label>
        <textarea class="form-control" id="note-content" rows="8" placeholder="content" name="content" [(ngModel)]="note.content"></textarea>
        <div contenteditable="true" [(contenteditableModel)]="note.content"></div>
      </fieldset>
    </form>
    <button type="button" class="btn btn-primary" (click)="writeNoteAndMove()">SAVE</button>
    <button type="button" class="btn btn-warning" (click)="deleteNote()">DELETE</button>
    <hr />
    <div class="markdown-body">{{note | json}}</div>
  `,
  directives: [ContenteditableModel],
  providers: [NoteService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

  constructor(
    private store: Store,
    private params$: RouteParams,
    private service: NoteService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    const uid = this.store.uid;
    this.store.ds = this.params$.pluck<string>('id')
      .do(noteid => {
        if (noteid) {
          this.store.ds = this.service.readNote(noteid)
            .do(note => {
              this.note = note;
              this.cd.markForCheck();
            })
            .subscribe();
        } else {
          this.note = {
            noteid: uuid.v4(),
            title: '',
            content: '',
            author: { [uid]: 999 },
          };
          this.cd.markForCheck();
        }
      })
      .subscribe();

    this.store.ds = Observable.fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup')
      .debounceTime(1000)
      .do(event => {
        // this.note.timestamp = new Date().getTime();
        // this.service.writeNote(this.note);
        this.writeNoteAndMove();
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.service.writeNote(this.note);
    this.store.disposeSubscriptions();
  }

  writeNoteAndMove() {
    // this.service.writeNote(this.note);
    
    const uid = this.store.uid;
    // const indexKey = firebase.database().ref('notesIndex/' + uid).push().key;
    this.note.timestamp = new Date().getTime();
    let obj = {};
    obj['notesIndex/' + uid + '/' + this.note.noteid] = {
      noteid: this.note.noteid,
      readonly: false,
      timestamp: this.note.timestamp,
    } as FirebaseNoteIndex;
    obj['notes/' + this.note.noteid] = this.note;
    firebase.database().ref().update(obj, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('write completed.');
      }
    });
    // this.router.go('/notes');
  }

  deleteNote() {
    const noteid = this.note.noteid;
    this.note = { title: '', content: '' };
    this.service.deleteNote(noteid);
    this.router.go('/notes');
  }


  note: FirebaseNote;
}