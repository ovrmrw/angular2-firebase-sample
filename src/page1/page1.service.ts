import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, TestScheduler } from 'rxjs/Rx';
import lodash from 'lodash';

const initCounter = 0;
const initTimeNow = lodash.now();

@Injectable()
export class Page1Service {
  private inCounter$ = new Subject<number>();
  private outCounter$ = new BehaviorSubject<number>(initCounter);
  private outTimeNow$ = new BehaviorSubject<number>(initTimeNow);

  constructor() {
    timerObservable()
      .map(() => lodash.now())
      .do(value => this.outTimeNow$.next(value))
      .subscribe();

    counterObservable(this.inCounter$)
      .do(value => this.outCounter$.next(value))
      .subscribe();

    this.inCounter$.next(0); // Observableループをkick
  }

  increment(value: number): void {
    this.inCounter$.next(value);
  }

  get counter$() { return this.outCounter$ as Observable<number>; }

  get timeNow$() { return this.outTimeNow$ as Observable<number>; }
}


export function counterObservable(subject: Subject<number>): Observable<number> {
  const watchingObservables = [
    subject.scan((p, value) => {
      return p + value;
    }, 0)
  ];
  
  return Observable
    .combineLatest(...watchingObservables)
    .map(values => values[0])
    .do(value => console.log(value));
}


export function timerObservable(dueTime: number = 0, period: number = 1000, scheduler: TestScheduler = null): Observable<number> {
  return Observable
    .timer(dueTime, period, scheduler)
    .do(value => console.log(value));
}


export function counterAndTimerObservable(subject: Subject<number>, dueTime: number = 0, period: number = 1000, scheduler: TestScheduler = null): Observable<number[]> {
  const watchingObservables = [
    subject.scan((p, value) => {
      return p + value;
    }, 0),

    Observable.timer(dueTime, period, scheduler),
  ];

  return Observable
    .combineLatest(...watchingObservables)
    // .map(values => values[0])
    .do(values => console.log(values));
}