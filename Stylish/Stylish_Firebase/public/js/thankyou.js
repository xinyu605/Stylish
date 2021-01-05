// mobile: click button to turn on input box
import { clickCallInput } from './common.js';
clickCallInput();

// get query string
let params = new URLSearchParams(window.location.search);
let number = params.get('number');

if (!number) {
  window.location = './';
} else {
  let orderNumber = document.getElementById('number');
  orderNumber.textContent = number;
}
