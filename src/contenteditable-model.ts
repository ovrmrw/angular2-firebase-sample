/*
  参考
  https://www.namekdev.net/2016/01/two-way-binding-to-contenteditable-element-in-angular-2/
  https://gist.github.com/Namek/8387d6cc4f4d6857e277
  http://plnkr.co/edit/8YFTcQ?p=preview
*/

import { Directive, ElementRef, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { isPropertyUpdated } from "@angular/forms/src/directives/shared";


@Directive({
  selector: '[contenteditableModel]',
  host: {
    '(blur)': 'onBlur()',
    '(keyup)': 'onBlur()' // 追加
  }
})
export class ContenteditableModel implements OnChanges {
  @Input('contenteditableModel') model: any;
  @Output('contenteditableModelChange') update = new EventEmitter();

  private lastViewModel: any;


  constructor(private elRef: ElementRef) {
  }

  ngOnChanges(changes) {
    if (isPropertyUpdated(changes, this.lastViewModel)) {
      this.lastViewModel = this.model;
      this.refreshView();
    }
  }

  onBlur() {
    var value = this.elRef.nativeElement.innerText
    this.lastViewModel = value
    this.update.emit(value)
  }

  private refreshView() {
    this.elRef.nativeElement.innerText = this.model
  }
}
