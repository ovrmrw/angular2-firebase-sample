import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';
import lodash from 'lodash';
import { RouteParams, Router } from '@ngrx/router';

import { NoteService } from './note.service';
import { ContenteditableModel } from '../contenteditable-model';
import { Store } from '../store';
import { FirebaseNote, } from '../types';


@Component({
  selector: 'sg-note',
  template: `
    <form #form="ngForm" *ngIf="note">
      <fieldset class="form-group" ngModelGroup="note">
        <label for="note-title">Title</label>
        <input type="text" class="form-control" id="note-title" placeholder="title" name="title" [(ngModel)]="note.title">
        <label for="note-content">Content</label>
        <textarea class="form-control" id="note-content" rows="8" placeholder="content" name="content" [(ngModel)]="note.content"></textarea>
        ↓ここでもContentを編集できる。
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
export class NoteComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private params$: RouteParams,
    private service: NoteService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }


  ngOnInit() {
    const uid = this.store.currentUser.uid;

    /* URLからidを取得する */
    this.store.disposable = this.params$.pluck<string>('id')
      .do(noteid => {
        if (noteid) {
          /* 保存済みnoteを呼び出す */
          this.store.disposable = this.service.readNote$(noteid)
            .do(note => {
              this.note = note;
              this.oldNote = lodash.cloneDeep(this.note);
              this.cd.markForCheck();
            })
            .subscribe();
        } else {
          /* noteを新規作成 */
          this.note = this.service.createNote();
          this.oldNote = lodash.cloneDeep(this.note);
          this.cd.markForCheck();
        }
      })
      .subscribe();

    /* キー入力がある度にnoteを保存する */
    this.store.disposable = Observable.fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup')
      .debounceTime(1000)
      .do(() => {
        this.service.writeNote(this.note, this.oldNote);
      })
      .subscribe();
  }


  ngOnDestroy() {
    this.service.writeNote(this.note, this.oldNote);
    this.store.disposeSubscriptions();
    this.service.onDestroy();
  }


  writeNoteAndMove() {
    this.service.writeNote(this.note, this.oldNote);
    this.router.go('/notes');
  }


  deleteNote() {
    const noteid = this.note.noteid;
    this.note = { title: '', content: '' };
    this.service.removeNote(noteid);
    this.router.go('/notes');
  }


  private note: FirebaseNote;
  private oldNote: FirebaseNote;
}