import './css/editor.css';
import './css/custom-element.css';
import { element as testerElement} from './element';

let height = 400;
let value = '';

function storeValue() {
  value = 'This is a test';
  CustomElement.setValue(value);
}

function updateDisabled(disabled) {
  document.querySelector('#editor').innerHTML = testerElement;
  storeValue();
};


CustomElement.init((element, _context) => {
  height = (element.config || {}).height || 400;
  value = element.value;
  CustomElement.setHeight(height);
  updateDisabled(element.disabled);
  CustomElement.onDisabledChanged(updateDisabled);
});
