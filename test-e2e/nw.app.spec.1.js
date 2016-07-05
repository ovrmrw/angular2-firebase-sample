'use strict';

var maxWait = 5000;

module.exports = {
  'Nightwatch test 1': function (browser) {
    browser
      .url('http://localhost:5000')

      .waitForElementVisible('body', maxWait)
      .assert.title('Angular 2 QuickStart')

      .waitForElementVisible('sg-app h3', maxWait)
      .assert.containsText('sg-app h3', 'top component')
      .waitForElementVisible('sg-page1 h4', maxWait)
      .assert.containsText('sg-page1 h4', 'page1 content.')

      // ボタンクリックでテキストが変わる。
      .click('sg-page1 button[name="change"]', function () {
        this.assert.containsText('sg-page1 h4', 'page1 content changed.')
      })

      .end();
  }
};
