/*********** 
Week0-part3
Create new promise to send Ajax request by get method
***********/

export function getAjax(src) {
  return new Promise((resolve, reject) => {
    //define HTTP Request
    const req = new XMLHttpRequest();
    req.open('GET', src);
    req.onload = function () {
      if (req.status == 200) {
        // resolve: promise fulfilled
        resolve(JSON.parse(req.responseText));
      } else {
        //reject: promise rejected (customize error)
        reject(new Error(req));
      }
    };
    req.send();
  });
}

/*********** 
Week1-part1
mobile: click button to turn on input box
***********/

function clickCallInput() {
  const callInputButton = document.getElementById('callInputButton');
  const searchForm = document.getElementById('searchForm');
  const logo = document.querySelector('.logo');
  const mobileFeature = document.querySelector('.feature');

  callInputButton.addEventListener('click', callInput);

  function callInput() {
    logo.style.display = 'none';
    callInputButton.style.display = 'none';
    mobileFeature.style.margin = 'auto';
    searchForm.style.display = 'flex';
    searchForm.style.justifyContent = 'flex-end';
  }
}
export { clickCallInput };

/*********** 
Week2-part1
1. Get current shopping cart data from localStorage.
2. If no data in localStorage, initialize it to an empty structure.
***********/

function localStorage() {
  let cart = {};
  let cartData = window.localStorage.getItem('cart');
  if (!cartData) {
    cart = {
      freight: 0,
      list: [],
      payment: ' ',
      recipient: {},
      shipping: ' ',
      subtotal: 0,
      total: 0
    };
    window.localStorage.setItem('cart', JSON.stringify(cart));
  }
}
export { localStorage };

/**********
	Loading
***********/
export function showLoading() {
  let loading = document.querySelector('.loading');
  loading.style.display = 'block';
}

export function hideLoading() {
  let loading = document.querySelector('.loading');
  loading.style.display = 'none';
}
