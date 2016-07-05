declare var Zone: any;

/**
 * Wraps a test function in an asynchronous test zone. The test will automatically
 * complete when all asynchronous calls within this zone are done. Can be used
 * to wrap an {@link inject} call.
 *
 * Example:
 *
 * ```
 * it('...', async(inject([AClass], (object) => {
 *   object.doSomething.then(() => {
 *     expect(...);
 *   })
 * });
 * ```
 */
export function async(fn: Function): Function {
  return () => new Promise<void>((finishCallback, failCallback) => {
    var AsyncTestZoneSpec = (Zone as any /** TODO #9100 */)['AsyncTestZoneSpec'];
    var testZoneSpec = new AsyncTestZoneSpec(finishCallback, failCallback, 'test (@ovrmrw)');
    testZoneSpec.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error): boolean {
      // Let the parent try to handle the error.
      const result = parentZoneDelegate.handleError(targetZone, error);
      if (result) {
        console.error(error);
        this._failCallback(error.message ? error.message : 'unknown error');        
        // this._failCallback(error);
        this._alreadyErrored = true;
      }
      return false;
    };
    testZoneSpec.onScheduleTask = function (delegate, currentZone, targetZone, task) {
      if (task.type == 'macroTask' && task.source == 'setInterval') {
        // this._failCallback('Cannot use setInterval from within an async zone test.');
        // return;
        console.warn('Should not use setInterval from within an async zone test.')
      }
      return delegate.scheduleTask(targetZone, task);
    };
    var testZone = Zone.current.fork(testZoneSpec);
    return testZone.run(fn);
  });
}