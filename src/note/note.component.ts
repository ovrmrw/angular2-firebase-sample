import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { NoteService } from './note.service';


@Component({
  moduleId: module.id,
  selector: 'sg-auth',
  template: `
    <h3>note</h3>
    <div class="markdown-body">
      <textarea />
    </div>
  `,
  styleUrls: [require('./github-markdown.css')],
  providers: [NoteService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteComponent implements OnInit {

  constructor(
    private service: NoteService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() { }


}