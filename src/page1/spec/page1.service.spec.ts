declare var Zone: any;
import { Page1Service } from '../page1.service';
import { Page1Component } from '../page1.component';


/**
 *  ===== testing world =====
 */
import assert from 'power-assert';
import lolex from 'lolex';
import { describe, xdescribe, it, iit, async, expect, xit, beforeEach, beforeEachProviders, inject, afterEach } from '@angular/core/testing';
import { TestComponentBuilder, ComponentFixture } from '@angular/compiler/testing';
import { elementText, setTimeoutPromise, observableValue, asyncPower, fakeAsyncPower, tick, withPower } from '../../../test';


describe('Page1Service standalone TEST ' + '-'.repeat(40), () => {
  let service: Page1Service;
  let clock: lolex.Clock;

  beforeEachProviders(() => [
    Page1Service,
  ]);


  beforeEach(inject([Page1Service], (_service) => {
    service = _service;
  }));


  afterEach(() => {
    try {
      clock.uninstall();
    } catch (e) { }
  });


  it('can create', asyncPower(async () => {
    assert(!!service);
  }));


  // このテストはfakeAsyncテストでは通らない。asyncテストでもsetTimeoutしないと通らない。
  // ServiceからsetInterval(Observable.timer)を取り除けばこんなややこしいことをしなくてもテストが通る。
  it('counter value must be increment correctly', asyncPower(async () => {
    await setTimeoutPromise(0, true); // setTimeoutしてzoneのfirst turnから抜けた状態じゃないと下記のテストは通らない。    
    assert(observableValue(service.counter$) === 0);
    service.increment(1);
    assert(observableValue(service.counter$) === 1);
    service.increment(1);
    assert(observableValue(service.counter$) === 2);
    service.increment(2);
    assert(observableValue(service.counter$) === 4);
  }));


  // らこさんエディション
  it('counter value must be increment correctly by @laco', async(() => {
    let value: number;
    service.counter$.subscribe(counter => value = counter);

    setTimeout(() => {
      service.increment(1);
      assert(value === 1);
      service.increment(1);
      assert(value === 2);
      service.increment(2);
      assert(value === 4);
    }, 0);
  }));

  it('exprimental 2', asyncPower(async () => {
    await setTimeoutPromise(0, true);
    let counter: number;
    let currentTime: number;
    let previousTime: number;
    service.counter$.subscribe(value => counter = value);
    service.timeNow$.subscribe(value => {
      if (currentTime) {
        previousTime = currentTime;
      }
      currentTime = value;
    });

    service.increment(1);
    assert(counter === 1);
    service.increment(1);
    assert(counter === 2);
    service.increment(2);
    assert(counter === 4);

    await setTimeoutPromise(1000);
    console.log([previousTime, currentTime]);
    assert(previousTime + 1000 <= currentTime);
  }));

});


describe('Page1Service with Page1Component TEST ' + '-'.repeat(40), () => {
  let builder: TestComponentBuilder;

  beforeEach(inject([TestComponentBuilder], (_tcb) => {
    builder = _tcb;
  }));


  it('exprimental', fakeAsyncPower(() => {
    let fixture: ComponentFixture<Page1Component>;
    builder.createAsync(Page1Component).then(f => fixture = f);
    tick();
    const component = fixture.componentRef.instance;
    const el = fixture.nativeElement as HTMLElement;
    const service = component.service;

    let counter: number;
    let currentTime: number;
    let previousTime: number;
    service.counter$.subscribe(value => counter = value);
    service.timeNow$.subscribe(value => {
      if (currentTime) {
        previousTime = currentTime;
      }
      currentTime = value;
    });

    service.increment(1);
    assert(counter === 1);
    service.increment(1);
    assert(counter === 2);
    service.increment(2);
    assert(counter === 4);

    fixture.detectChanges();
    console.log(elementText(el, '#now'));
    tick(1000);
    fixture.detectChanges();
    console.log(elementText(el, '#now'));
  }));


  it('exprimental 2', asyncPower(async () => {
    const fixture = await builder.createAsync(Page1Component) as ComponentFixture<Page1Component>;
    const component = fixture.componentRef.instance;
    const el = fixture.nativeElement as HTMLElement;
    const service = component.service;

    let counter: number;
    service.counter$.subscribe(value => counter = value);
    service.timeNow$.subscribe();

    fixture.detectChanges();
    let previousTimeText = elementText(el, '#now');
    await setTimeoutPromise(1000);
    fixture.detectChanges();
    let currentTimeText = elementText(el, '#now');
    console.log([previousTimeText, currentTimeText]);
    assert(previousTimeText !== currentTimeText);
  }));


  it('exprimental 3', (done) => {
    withPower(done, () => {
      builder.createAsync(Page1Component)
        .then(fixture => {
          const component = fixture.componentRef.instance;
          const el = fixture.nativeElement as HTMLElement;
          const service = component.service;

          let counter: number;
          service.counter$.subscribe(value => counter = value);
          service.timeNow$.subscribe();

          fixture.detectChanges();
          let previousTimeText = elementText(el, '#now');

          setTimeout(() => {
            fixture.detectChanges();
            let currentTimeText = elementText(el, '#now');
            console.log([previousTimeText, currentTimeText]);
            assert(previousTimeText !== currentTimeText);
            assert(1 + 1 === 2);
            done();
          }, 10);
        });
    });
  });


});