import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable, Subscription, Subject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';
import { Router } from '@ngrx/router';

import { NoteListService } from './note-list.service';
import { Store } from '../store';
import { ReplaceLinePipe } from './replace-line.pipe';
import { FirebaseNote } from '../types';


@Component({
  selector: 'sg-note-list',
  template: `
    <div class="card-columns">
      <div class="card card-block" *ngFor="let note of notes$ | async" (click)="toNote(note)">
        <h4 class="card-title">{{note.title}}</h4>
        <div class="card-text" [innerHtml]="note.content | replaceLine"></div>
      </div>
    </div>
  `,
  styles: [require('./note-list.style.css')],
  pipes: [ReplaceLinePipe],
  providers: [NoteListService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteListComponent implements OnInit, OnDestroy {
  constructor(
    private service: NoteListService,
    private router: Router,
    private store: Store,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.notes$ = this.service.initNoteListReadStream();
  }

  ngOnDestroy() {
    this.service.onDestroy();
  }

  toNote(note: FirebaseNote) {
    this.router.go('/notes/' + note.noteid);
  }

  private notes$: Observable<FirebaseNote[]>;
  private notes: FirebaseNote[];
}