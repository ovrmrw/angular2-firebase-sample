import { provide } from '@angular/core';
import { Page1Component } from '../page1.component';
import { Page1Service } from '../page1.service';
import { Page1ServiceMock } from './page1.service.mock.spec';


/**
 *  ===== testing world =====
 */
import assert from 'power-assert';
import { describe, xdescribe, it, xit, async, expect, beforeEach, beforeEachProviders, inject } from '@angular/core/testing';
import { TestComponentBuilder, ComponentFixture } from '@angular/compiler/testing';


describe('* * * * * Report to @t_Wada * * * * *', () => {
  let builder: TestComponentBuilder;

  beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    builder = tcb.overrideProviders(Page1Component, [
      provide(Page1Service, { useClass: Page1ServiceMock })
    ]);
  }));


  ///////////////////////////////////////////////////////////////////////////////////////
  // Jasmine "expect" for assertion.

  it('1) should have text: "page1 content." --- This is a normal style for Angular2 test.', (done) => {
    // Not inside AsyncTestZoneSpec 
    builder.createAsync(Page1Component)
      .then(fixture => {
        const el = fixture.nativeElement as HTMLElement;
        const CONTENT = 'h4';

        expect(el.querySelector(CONTENT).textContent).toBe('');
        fixture.detectChanges();
        expect(el.querySelector(CONTENT).textContent).toBe('page1 content.');
        done();
      });
  });


  it('2) should have text: "page1 content." --- This is also a normal style for Angular2 test without done().', async(() => {
    // Inside AsyncTestZoneSpec
    builder.createAsync(Page1Component)
      .then(fixture => {
        const el = fixture.nativeElement as HTMLElement;
        const CONTENT = 'h4';

        expect(el.querySelector(CONTENT).textContent).toBe('');
        fixture.detectChanges();
        expect(el.querySelector(CONTENT).textContent).toBe('page1 content.');
      });
  }));


  ///////////////////////////////////////////////////////////////////////////////////////
  // Power-assert "assert" for assertion.

  /*
    (3)はテストが落ちるのにそこで止まらずに処理は流れていきます。（期待される挙動ではない）
    (4)はテストが落ちると同時に処理も止まります。
    (done) => { ... } と async(()=> { ... }) では生成されるZoneが異なるためにassert()エラー発生時の挙動が変わっていると思われます。
  　元々Angular2はJasmineでテストされることを想定していますのでPower-assertを正常に動作させることはできないのかもしれませんが…
  */

  // change "xit" to "it" to run test
  xit('3) should fail with stopping on error point... but that won\'t!!!', (done) => {
    // Not inside AsyncTestZoneSpec
    builder.createAsync(Page1Component)
      .then(fixture => {
        const el = fixture.nativeElement as HTMLElement;
        const CONTENT = 'h4';

        assert(el.querySelector(CONTENT).textContent === '');
        fixture.detectChanges();
        assert(el.querySelector(CONTENT).textContent === 'page1 content.(fail)'); // change 'page1 content.' to pass test.
        done();
      });
  });

  // change "xit" to "it" to run test
  xit('4) should fail with stopping on error point.', async(() => {
    // Inside AsyncTestZoneSpec
    builder.createAsync(Page1Component)
      .then(fixture => {
        const el = fixture.nativeElement as HTMLElement;
        const CONTENT = 'h4';

        assert(el.querySelector(CONTENT).textContent === '');
        fixture.detectChanges();
        assert(el.querySelector(CONTENT).textContent === 'page1 content.(fail)');
      });
  }));

});