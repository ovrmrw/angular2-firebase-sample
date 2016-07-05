import { Page1Service } from '../page1.service';
import { Observable } from 'rxjs/Rx';


export class Page1ServiceMock {
  private counter: number = 0;
  increment(value: number) {
    this.counter += value;
  }
  get counter$() { return Observable.of(this.counter); }
  get timeNow$() { return Observable.of(null) }
}


/**
 *  ===== testing world =====
 */
import assert from 'power-assert';
import { describe, it, iit, xit, async, expect, beforeEach, beforeEachProviders, inject } from '@angular/core/testing';
import { setTimeoutPromise, asyncPower } from '../../../test';

describe('Mock of Page1Service test', () => {
  let service: Page1Service;
  let mockService: Page1ServiceMock;

  beforeEachProviders(() => [Page1Service, Page1ServiceMock]);


  beforeEach(inject([Page1Service, Page1ServiceMock], (_service, _mock) => {
    service = _service;
    mockService = _mock;
  }));


  it('counter values are the same correctly between service and mock.', asyncPower(async () => {
    await setTimeoutPromise(0, true);
    let serviceValue: number;
    service.counter$.subscribe(counter => serviceValue = counter);

    service.increment(1);
    mockService.increment(1);
    mockService.counter$.subscribe(mockValue => assert(mockValue === serviceValue));
    service.increment(2);
    mockService.increment(2);
    mockService.counter$.subscribe(mockValue => assert(mockValue === serviceValue));
  }));

});