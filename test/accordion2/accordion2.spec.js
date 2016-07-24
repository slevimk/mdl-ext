'use strict';

import requireUncached from 'require-uncached';
import jsdomify from 'jsdomify';
import { removeChilds } from '../testutils/domHelpers';

const describe = require('mocha').describe;
const before = require('mocha').before;
const after = require('mocha').after;
const it = require('mocha').it;
const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');

describe('MaterialExtAccordion2', () => {

  const VK_ENTER = 13;
  const VK_SPACE = 32;
  const VK_END = 35;
  const VK_HOME = 36;
  const VK_ARROW_LEFT = 37;
  const VK_ARROW_UP = 38;
  const VK_ARROW_RIGHT = 39;
  const VK_ARROW_DOWN = 40;

  const PANEL = 'mdlext-accordion2__panel';
  const TAB = 'mdlext-accordion2__tab';
  const TABPANEL = 'mdlext-accordion2__tabpanel';

  const fixture = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Accordion Fixture</title>
</head>
<body>
<ul id="accordion-1" class="mdlext-accordion2 mdlext-js-accordion2 mdlext-accordion2--vertical">
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" aria-expanded="true">
      <span class="mdlext-accordion2__tab__caption">Tab #1</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #2</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" disabled>
      <span class="mdlext-accordion2__tab__caption">Tab #3, disabled</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <h5>Content #3 goes here</h5>
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #4</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
</ul>

<div id='mount'>
</div>
</body>
</html>`;

  const accordion2_no_aria_multiselectable = `
<ul id="accordion-2" class="mdlext-accordion2 mdlext-js-accordion2 mdlext-accordion2--horizontal">
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" aria-expanded="true">
      <span class="mdlext-accordion2__tab__caption">Tab #1</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
</ul>`;

  const accordion3_missing_class = `
<ul id="accordion-3" class="mdlext-accordion2 mdlext-js-accordion2">
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" aria-expanded="true">
      <span class="mdlext-accordion2__tab__caption">Tab #1</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
</ul>`;

  const accordion4_missing_tab = `
<ul id="accordion-4" class="mdlext-accordion2 mdlext-js-accordion2 mdlext-accordion2--vertical">
  <li class="mdlext-accordion2__panel">
    <header class="not-an-accordion-tab-class"></header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
</ul>`;

  const accordion5_missing_tabpanel = `
<ul id="accordion-5" class="mdlext-accordion2 mdlext-js-accordion2 mdlext-accordion2--vertical">
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" aria-expanded="true">
      <span class="mdlext-accordion2__tab__caption">Tab #1</span>
    </header>
  </li>
</ul>`;

  const accordion6_multiselectable = `
<ul id="accordion-6" class="mdlext-accordion2 mdlext-js-accordion2 mdlext-accordion2--vertical" aria-multiselectable="true">
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #1</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #2</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" disabled>
      <span class="mdlext-accordion2__tab__caption">Tab #3</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #4</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab">
      <span class="mdlext-accordion2__tab__caption">Tab #5</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Some content</p>
    </section>
  </li>
</ul>`;

  const panel_to_insert = `
  <li class="mdlext-accordion2__panel">
    <header class="mdlext-accordion2__tab" aria-expanded="true">
      <span class="mdlext-accordion2__tab__caption">Inserted Tab</span>
    </header>
    <section class="mdlext-accordion2__tabpanel">
      <p>Inserted content</p>
    </section>
  </li>`;


  before ( () => {
    jsdomify.create(fixture);

    // Must load MDL after jsdom, see: https://github.com/mochajs/mocha/issues/1722
    requireUncached( 'material-design-lite/material');
    global.componentHandler = window.componentHandler;
    assert.isObject(componentHandler, 'No global MDL component handler');

    requireUncached('../../src/accordion2/accordion2');
    assert.isNotNull(window.MaterialExtAccordion2, 'Expected MaterialExtAccordion not to be null');
    global.MaterialExtAccordion = window.MaterialExtAccordion2;
  });

  after ( () => {
    jsdomify.destroy();
  });

  it('is globally available', () => {
    assert.isFunction(window['MaterialExtAccordion2'], 'Expected MaterialExtAccordion to be globally available');
  });

  it('upgrades successfully', () => {
    const element = document.querySelector('#accordion-1');
    assert.isTrue(element.classList.contains('is-upgraded'), 'Expected accordion to upgrade');

    const dataUpgraded = element.getAttribute('data-upgraded');
    assert.isNotNull(dataUpgraded, 'Expected attribute "data-upgraded" to exist');
    assert.isAtLeast(dataUpgraded.indexOf('MaterialExtAccordion'), 0, 'Expected "data-upgraded" attribute to contain "MaterialExtAccordion');
  });

  it('should be a widget', () => {
    const element = document.querySelector('#accordion-1');
    expect(element.MaterialExtAccordion2).to.be.a('object');
  });

  it('should have public methods available via widget', () => {
    const element = document.querySelector('#accordion-1');
    const methods = [
      'upgradeTab',
      'openTab',
      'closeTab',
      'toggleTab'
    ];
    methods.forEach((fn) => {
      expect(element.MaterialExtAccordion2[fn]).to.be.a('function');
    });
  });

  it('has expected attributes', () => {
    const element = document.querySelector('#accordion-1');
    assert.equal(element.getAttribute('role'), 'tablist', 'Expected accordion to have role="tablist"');
    assert.isTrue(element.hasAttribute('aria-multiselectable'), 'Expected accordion to have attribute "aria-multiselectable"');

    [...element.querySelectorAll(`.${PANEL}`)].forEach( panel => expectedPanelAttributes(panel) );
  });

  it('has expected expanded tab attributes', () => {
    const element = document.querySelector('#accordion-1');
    const panel = document.querySelector(`#accordion-1 .${PANEL}:first-child`);
    element.MaterialExtAccordion2.openTab(panel);

    const tab = panel.querySelector(`.${TAB}`);
    const tabpanel = panel.querySelector(`.${TABPANEL}`);

    assert.isTrue(panel.classList.contains('is-expanded'), 'Expected an expanded accordion panel to have class "is-expanded"');
    assert.equal(tab.getAttribute('aria-expanded'), 'true', 'Expected an expanded accordion panel tab to have attribute aria-expanded="true"');
    assert.equal(tabpanel.getAttribute('aria-hidden'), 'false', 'Expected an expanded accordion panel tabpanel to have attribute aria-hidden="false"');
  });

  it('has expected closed tab attributes', () => {
    const element = document.querySelector('#accordion-1');
    const panel = document.querySelector(`#accordion-1 .${PANEL}:nth-child(2)`);
    element.MaterialExtAccordion2.closeTab(panel);

    const tab = panel.querySelector(`.${TAB}`);
    const tabpanel = panel.querySelector(`.${TABPANEL}`);

    assert.isFalse(panel.classList.contains('is-expanded'), 'Expected a closed accordion panel to not have class "is-expanded"');
    assert.equal(tab.getAttribute('aria-expanded'), 'false', 'Expected a closed accordion panel tab to have attribute aria-expanded="false"');
    assert.equal(tabpanel.getAttribute('aria-hidden'), 'true', 'Expected a closed accordion panel tabpanel to have attribute aria-hidden="true"');
  });

  it('upgrades successfully when a new component is appended to the DOM', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion2_no_aria_multiselectable);
      const element = document.querySelector('#accordion-2');

      assert.isFalse(element.classList.contains('is-upgraded'), 'Expected class "is-upgraded" to not exist before upgrade');
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');
      assert.isTrue(element.classList.contains('is-upgraded'), 'Expected accordion to upgrade');

      const dataUpgraded = element.getAttribute('data-upgraded');
      assert.isNotNull(dataUpgraded, 'Expected attribute "data-upgraded" to exist');
      assert.isAtLeast(dataUpgraded.indexOf('MaterialExtAccordion2'), 0, 'Expected "data-upgraded" attribute to contain "MaterialExtAccordion"');
    }
    finally {
      removeChilds(container);
    }
  });

  it('downgrades successfully', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion2_no_aria_multiselectable);
      const element = document.querySelector('#accordion-2');

      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');
      assert.isTrue(element.classList.contains('is-upgraded'), 'Expected accordion to upgrade before downgrade');

      componentHandler.downgradeElements(element);
      expect(element.getAttribute('data-upgraded')).to.not.include('MaterialExtAccordion2');
    }
    finally {
      removeChilds(container);
    }
  });

  it('should have aria-multiselectable="false" if attribute not given in markup', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion2_no_aria_multiselectable);
      let element = document.querySelector('#accordion-2');
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');

      element = document.querySelector('#accordion-2');
      assert.isTrue(element.hasAttribute('aria-multiselectable'), 'Expected accordion to have attribute "aria-multiselectable"');
      assert.equal(element.getAttribute('aria-multiselectable'), 'false', 'Expected accordion to have attribute aria-multiselectable="false"');
    }
    finally {
      removeChilds(container);
    }
  });

  it('throws an error if required accordion class is missing', () => {
    const container = document.querySelector('#mount');
    container.insertAdjacentHTML('beforeend', accordion3_missing_class);
    const element = document.querySelector('#accordion-3');
    expect( () => {
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');
    }).to.throw(Error);

    removeChilds(container);
  });

  it('throws an error if tab class is missing', () => {
    const container = document.querySelector('#mount');
    container.insertAdjacentHTML('beforeend', accordion4_missing_tab);
    const element = document.querySelector('#accordion-4');
    expect( () => {
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');
    }).to.throw(Error);

    removeChilds(container);
  });

  it('throws an error if tabpanel class is missing', () => {
    const container = document.querySelector('#mount');
    container.insertAdjacentHTML('beforeend', accordion5_missing_tabpanel);
    const element = document.querySelector('#accordion-5');
    expect( () => {
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');
    }).to.throw(Error);

    removeChilds(container);
  });

  it('inserts a new accordion tab', () => {
    const element = document.querySelector('#accordion-1');
    element.insertAdjacentHTML('beforeend', panel_to_insert);

    let insertedPanel  = element.querySelector(`.${PANEL}:last-child`);
    assert.isNotNull(insertedPanel, 'Expected handle to inserted accordion panel');

    element.MaterialExtAccordion2.upgradeTab(insertedPanel);

    insertedPanel  = element.querySelector(`.${PANEL}:last-child`);
    expectedPanelAttributes(insertedPanel);
  });

  it('interacts with the keyboard', () => {
    const tab = document.querySelector(`#accordion-1 .${PANEL}:nth-child(2) .${TAB}`);
    spyOnKeyboardEvent(tab, VK_ARROW_DOWN);
    spyOnKeyboardEvent(tab, VK_ARROW_UP);
    spyOnKeyboardEvent(tab, VK_ARROW_LEFT);
    spyOnKeyboardEvent(tab, VK_ARROW_RIGHT);
    spyOnKeyboardEvent(tab, VK_ENTER);
    spyOnKeyboardEvent(tab, VK_SPACE);
    spyOnKeyboardEvent(tab, VK_END);
    spyOnKeyboardEvent(tab, VK_HOME);

    const firstTab = document.querySelector(`#accordion-1 .${PANEL}:first-child .${TAB}`);
    spyOnKeyboardEvent(firstTab, VK_ARROW_DOWN);
    spyOnKeyboardEvent(firstTab, VK_ARROW_UP);
    spyOnKeyboardEvent(firstTab, VK_ARROW_LEFT);
    spyOnKeyboardEvent(firstTab, VK_ARROW_RIGHT);
    spyOnKeyboardEvent(firstTab, VK_ENTER);
    spyOnKeyboardEvent(firstTab, VK_SPACE);
    spyOnKeyboardEvent(firstTab, VK_END);
    spyOnKeyboardEvent(firstTab, VK_HOME);

    const lastTab = document.querySelector(`#accordion-1 .${PANEL}:last-child .${TAB}`);
    spyOnKeyboardEvent(lastTab, VK_ARROW_DOWN);
    spyOnKeyboardEvent(lastTab, VK_ARROW_UP);
    spyOnKeyboardEvent(lastTab, VK_ARROW_LEFT);
    spyOnKeyboardEvent(lastTab, VK_ARROW_RIGHT);
    spyOnKeyboardEvent(lastTab, VK_ENTER);
    spyOnKeyboardEvent(lastTab, VK_SPACE);
    spyOnKeyboardEvent(lastTab, VK_END);
    spyOnKeyboardEvent(lastTab, VK_HOME);

    const disabledTab = document.querySelector(`#accordion-1 .${PANEL}:nth-child(3) .${TAB}`);
    spyOnKeyboardEvent(disabledTab, VK_ARROW_DOWN);
    spyOnKeyboardEvent(disabledTab, VK_ARROW_UP);
    spyOnKeyboardEvent(disabledTab, VK_ARROW_LEFT);
    spyOnKeyboardEvent(disabledTab, VK_ARROW_RIGHT);
    spyOnKeyboardEvent(disabledTab, VK_ENTER);
    spyOnKeyboardEvent(disabledTab, VK_SPACE);
    spyOnKeyboardEvent(disabledTab, VK_END);
    spyOnKeyboardEvent(disabledTab, VK_HOME);
  });

  it('changes state when an accordion tab is toggled', () => {
    const element = document.querySelector('#accordion-1');
    const panel = document.querySelector(`#accordion-1 .${PANEL}:first-child`);
    assert.isNotNull(panel, 'Expected handle to accordion panel');

    const tab = panel.querySelector(`.${TAB}`);
    const ariaExpanded = tab.getAttribute('aria-expanded');
    const ariaHidden = panel.querySelector(`.${TABPANEL}`).getAttribute('aria-hidden');

    // Toggle tab
    element.MaterialExtAccordion2.toggleTab(tab);

    /*
    // ... or trigger click event to toggle tab
    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    tab.dispatchEvent(evt);
    */

    assert.notEqual(ariaExpanded, panel.querySelector(`.${TAB}`).getAttribute('aria-expanded'), 'Expected accordion tab state to change');
    assert.notEqual(ariaHidden, panel.querySelector(`.${TABPANEL}`).getAttribute('aria-hidden'), 'Expected accordion tabpanel state to change');
  });

  it('does not change state when a disabled accordion tab is toggled', () => {
    const element = document.querySelector('#accordion-1');
    const tab = anyDisabledTab(element);
    assert.isNotNull(tab, 'Expected handle to disabled accordion tab');

    const panel = tab.parentNode;
    const ariaExpanded = tab.getAttribute('aria-expanded');
    const ariaHidden = panel.querySelector(`.${TABPANEL}`).getAttribute('aria-hidden');

    // Toggle tab
    element.MaterialExtAccordion2.toggleTab(tab);

    assert.equal(ariaExpanded, panel.querySelector(`.${TAB}`).getAttribute('aria-expanded'), 'Disabled accordion tab state should not change');
    assert.equal(ariaHidden, panel.querySelector(`.${TABPANEL}`).getAttribute('aria-hidden'), 'Disabled accordion tabpanel state should not change');
  });

  it('last focused tab should have aria-selected="true"', () => {
    const element = document.querySelector('#accordion-1');
    const tab = document.querySelector(`#accordion-1 .${PANEL}:nth-child(2) .${TAB}`);
    assert.isNotNull(tab, 'Expected handle to disabled accordion tab');

    const evt = new Event('focus', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    tab.dispatchEvent(evt);
    assert.equal(tab.getAttribute('aria-selected'), 'true', 'Expected tab to have aria-selected="true"');

    const nextTab = document.querySelector(`#accordion-1 .${PANEL}:first-child .${TAB}`);
    nextTab.dispatchEvent(
      new Event('focus', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );
    assert.equal(nextTab.getAttribute('aria-selected'), 'true', 'Expected tab to have aria-selected="true"');

    const selectedTabs =  [...element.querySelectorAll(`.${PANEL} .${TAB}`)].filter(tab => tab.getAttribute('aria-selected') == 'true');
    expect(selectedTabs).to.have.lengthOf(1, `Expected only one tab to have aria-selected="true"`);
  });


  it('should move "aria-selected" to next available tab if focused tab is disabled', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion6_multiselectable);
      const element = document.querySelector('#accordion-6');
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');

      element.MaterialExtAccordion2.closeTab();

      const firstTab = element.querySelector(`.${PANEL}:first-child .${TAB}`);
      const tab3 = element.querySelector(`.${PANEL}:nth-child(3) .${TAB}`);
      const lastTab = element.querySelector(`.${PANEL}:last-child .${TAB}`);

      firstTab.setAttribute('disabled', '');
      tab3.setAttribute('disabled', '');
      lastTab.setAttribute('disabled', '');

      element.MaterialExtAccordion2.upgradeTab(firstTab);
      element.MaterialExtAccordion2.upgradeTab(tab3);
      element.MaterialExtAccordion2.upgradeTab(lastTab);

      // Tab #2 and #4 are enabled
      const tab2 = element.querySelector(`.${PANEL}:nth-child(2) .${TAB}`);
      const tab4 = element.querySelector(`.${PANEL}:nth-child(4) .${TAB}`);

      // First available tab to select is tab #2
      firstTab.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: VK_HOME,
          shiftKey: false
        })
      );
      assert.isTrue(tab2.hasAttribute('aria-selected'), 'Expected accordion panel tab #2 to have attribute "aria-selected"');

      // First available tab to select is tab #4
      lastTab.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: VK_END,
          shiftKey: false
        })
      );
      assert.isTrue(tab4.hasAttribute('aria-selected'), 'Expected accordion panel tab #2 to have attribute "aria-selected"');

      // First available tab to select is tab #4
      tab2.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: VK_ARROW_DOWN,
          shiftKey: false
        })
      );
      assert.isTrue(tab4.hasAttribute('aria-selected'), 'Expected accordion panel tab #2 to have attribute "aria-selected"');

      // First available tab to select is tab #2
      tab4.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          keyCode: VK_ARROW_UP,
          shiftKey: false
        })
      );
      assert.isTrue(tab2.hasAttribute('aria-selected'), 'Expected accordion panel tab #2 to have attribute "aria-selected"');
    }
    finally {
      removeChilds(container);
    }
  });



  it('emits a custom "toggle" event when tab is toggled', () => {
    const accordion = document.querySelector('#accordion-1');
    const tab = accordion.querySelector(`.${PANEL}:first-child .${TAB}`);
    assert.isNotNull(tab, 'Expected handle to accordion tab');

    const spy = sinon.spy();
    accordion.addEventListener('toggle', spy);

    accordion.addEventListener('toggle', event => {
      assert.isDefined(event.detail, 'Expected detail to be defined in event');
      assert.isDefined(event.detail.state, 'Expected detail.state to be defined in event');
      assert.isDefined(event.detail.tab, 'Expected detail.tab to be defined in event');
      assert.isDefined(event.detail.tabpanel, 'Expected detail.tabpanel to be defined in event');
    });

    try {
      // Trigger click
      const evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      tab.dispatchEvent(evt);
    }
    finally {
      accordion.removeEventListener('toggle', spy);
      accordion.removeEventListener('toggle', accordion);
    }
    assert.isTrue(spy.called, 'Expected "toggle" event to fire');
  });

  it('listens to "command" custom events', () => {
    const accordion = document.querySelector('#accordion-1');
    const tab = accordion.querySelector(`.${PANEL}:first-child .${TAB}`);
    spyOnCommandEvent(accordion, 'open', tab);
    spyOnCommandEvent(accordion, 'close', tab);
    spyOnCommandEvent(accordion, 'toggle', tab);
    spyOnCommandEvent(accordion, 'upgrade', tab);
  });

  it('can have multiple panels open simultaneously when aria-multiselectable="true"', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion6_multiselectable);
      const element = document.querySelector('#accordion-6');
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');

      element.MaterialExtAccordion2.closeTab();
      assert.isNull(anyOpenTab(element), 'Expected all tabs to have aria-expanded="false');

      const tab1 = element.querySelector(`.${PANEL}:first-child .${TAB}`);
      const tab4 = element.querySelector(`.${PANEL}:nth-child(4) .${TAB}`);

      element.MaterialExtAccordion2.openTab(tab1);
      element.MaterialExtAccordion2.openTab(tab4);

      const openTabs =  [...element.querySelectorAll(`.${PANEL} .${TAB}`)].filter(tab => tab.getAttribute('aria-expanded') == 'true');
      expect(openTabs).to.have.lengthOf(2, 'Expected excactly two tabs to have aria-expanded="true"');
    }
    finally {
      removeChilds(container);
    }
  });

  it('can have all non diabled panels open simultaneously when aria-multiselectable="true"', () => {
    const container = document.querySelector('#mount');
    try {
      container.insertAdjacentHTML('beforeend', accordion6_multiselectable);
      const element = document.querySelector('#accordion-6');
      componentHandler.upgradeElement(element, 'MaterialExtAccordion2');

      element.MaterialExtAccordion2.openTab();

      const allTabs = [...element.querySelectorAll(`.${PANEL} .${TAB}`)];
      const disabledTabs = [...element.querySelectorAll(`.${PANEL} .${TAB}`)].filter(tab => tab.hasAttribute('disabled'));
      const openTabs =  [...element.querySelectorAll(`.${PANEL} .${TAB}`)].filter(tab => tab.getAttribute('aria-expanded') == 'true');
      const n = allTabs.length - disabledTabs.length;
      expect(openTabs).to.have.lengthOf(n, `Expected ${n} tabs to have aria-expanded="true"`);
    }
    finally {
      removeChilds(container);
    }
  });


  it('has only one panel open simultaneously when aria-multiselectable="false"', () => {
    const element = document.querySelector('#accordion-1');

    element.MaterialExtAccordion2.closeTab();
    assert.isNull(anyOpenTab(element), 'Expected all tabs to have aria-expanded="false');

    const tab1 = element.querySelector(`.${PANEL}:first-child .${TAB}`);
    const tab4 = element.querySelector(`.${PANEL}:nth-child(4) .${TAB}`);

    element.MaterialExtAccordion2.openTab(tab1);
    element.MaterialExtAccordion2.openTab(tab4);

    const openTabs =  [...element.querySelectorAll(`.${PANEL} .${TAB}`)].filter(tab => tab.getAttribute('aria-expanded') == 'true');
    expect(openTabs).to.have.lengthOf(1, 'Expected excactly one tab to have aria-expanded="true"');
  });



  const anyOpenTab = accordion => {
    return [...accordion.querySelectorAll(`.${PANEL} .${TAB}`)].find(tab => tab.getAttribute('aria-expanded') == 'true') || null;
  };

  const anyDisabledTab = accordion => {
    // accordion.querySelector(`.${PANEL} [class="${TAB}"]:disabled`) - does not work!
    return [...accordion.querySelectorAll(`.${PANEL} .${TAB}`)].find(tab => tab.hasAttribute('disabled')) || null;
  };

  const expectedPanelAttributes = panel => {
    const tab = panel.querySelector(`.${TAB}`);
    const tabpanel = panel.querySelector(`.${TABPANEL}`);
    assert.equal(panel.getAttribute('role'), 'presentation', 'Expected accordion panel to have role="presentation"');
    assert.equal(tab.getAttribute('role'), 'tab', 'Expected accordion panel tab to have role="tab"');
    assert.isTrue(tab.hasAttribute('aria-expanded'), 'Expected accordion panel tab to have attribute "aria-expanded"');
    assert.isTrue(tab.hasAttribute('tabindex'), 'Expected accordion panel tab to have attribute "tabindex"');
    assert.equal(tabpanel.getAttribute('role'), 'tabpanel', 'Expected accordion panel tabpanel to have role="tabpanel"');
    assert.isTrue(tabpanel.hasAttribute('aria-hidden'), 'Expected accordion panel tabpanel to have attribute "aria-hidden"');
  };

  const spyOnKeyboardEvent = (target, keyCode, shiftKey=false) => {
    const spy = sinon.spy();
    target.addEventListener('keydown', spy);

    try {
      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        keyCode: keyCode,
        shiftKey: shiftKey
      });
      target.dispatchEvent(event);
    }
    finally {
      target.removeEventListener('keydown', spy);
    }
    assert.isTrue(spy.calledOnce, `Expected "keydown" event to fire once for key ${keyCode}`);
  };

  const spyOnCommandEvent = (accordion, action, target = undefined) => {
    const spy = sinon.spy();
    accordion.addEventListener('command', spy);
    try {
      const event = new CustomEvent('command', { detail: { action : action, target: target } });
      accordion.dispatchEvent(event);
    }
    finally {
      accordion.removeEventListener('select', spy);
    }
    assert.isTrue(spy.calledOnce, `Expected "command" event to fire once for action ${action}`);
  };

});