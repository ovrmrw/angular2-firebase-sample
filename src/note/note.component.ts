import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';

import { NoteService } from './note.service';
import { ContenteditableModel } from '../contenteditable-model';


@Component({
  selector: 'sg-note',
  template: `
    <button (click)="newNote()">Create New Note</button>
    <div class="markdown-body">
      <h3 contenteditable="true" [(contenteditableModel)]="title"></h3>    
      <div contenteditable="true" [(contenteditableModel)]="content"></div>
    </div>
    <hr />
    <div class="markdown-body">{{title}}</div>
    <div class="markdown-body">{{content}}</div>
  `,
  styles: [require('./github-markdown.css')],
  directives: [ContenteditableModel],
  providers: [NoteService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

  constructor(
    private service: NoteService,
    private cd: ChangeDetectorRef,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.subscriptions = [
      Observable.fromEvent<KeyboardEvent>(this.el.nativeElement, 'keyup')
        .debounceTime(1000)
        .do(event => {
          const note: Note = { uuid: this.uuid, title: this.title, content: this.content };
          console.log(note);
          this.service.writeNote(note);
        })
        .subscribe(() => this.cd.markForCheck())
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  newNote() {
    this.uuid = uuid.v4();
    this.title = 'new note';
    this.content = '(content)';
  }

  uuid: string;
  title: string;
  content: string;

  subscriptions: Subscription[];

}


export interface Note {
  uuid: string;
  title: string;
  content: string;
}