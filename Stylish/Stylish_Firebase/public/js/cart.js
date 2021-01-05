// take access token
import { fbInit } from './fbLogin.js';
import {
  clickCallInput,
  localStorage,
  showLoading,
  hideLoading
} from './common.js';

// mobile: click button to turn on input box
clickCallInput();

// Get current shopping cart data from localStorage.
localStorage();
let cart = JSON.parse(window.localStorage.getItem('cart'));
let list = cart.list;
let cartQty = document.getElementById('cart-qty');
let cartQtyMobile = document.getElementById('mobile-cart-qty');
cartQty.textContent = list.length;
cartQtyMobile.textContent = list.length;

const url = 'https://api.appworks-school.tw/api/1.0';
const listItems = document.querySelector('.list');
const checkPay = document.querySelector('#checkout');
let freight = 0;

/*********** 
Week2-part2
1. List items in shopping cart.
***********/

// empty cart message and disabled checkout button
function checkCartEmpty() {
  if (list.length == 0) {
    let emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty';
    emptyMessage.textContent = '購物車空空的耶！';
    listItems.appendChild(emptyMessage);
    freight = 0;
    checkPay.style.pointerEvents = 'none';
    checkPay.style.opacity = 0.3;
  }
}
checkCartEmpty();

/************
	Cart list
************/

function renderCartPage() {
  // console.log(list);
  cart = JSON.parse(window.localStorage.getItem('cart'));
  list = cart.list;

  for (let i = 0; i < list.length; i++) {
    let row = document.createElement('div');
    row.className = 'row listRow';
    listItems.appendChild(row);

    let variant = document.createElement('div');
    variant.className = 'variant';
    row.appendChild(variant);

    let picture = document.createElement('div');
    picture.className = 'picture';
    variant.appendChild(picture);

    let productImg = document.createElement('img');
    productImg.src = list[i].main_image;
    productImg.alt = 'product-main-image';
    picture.appendChild(productImg);

    let details = document.createElement('div');
    details.className = 'details';
    details.innerHTML = `${list[i].name}<br>${list[i].id}<br><br>顏色：${list[i].color.name}<br>尺寸：${list[i].size}`;
    variant.appendChild(details);

    // quantity
    let quantity = document.createElement('div');
    let select = document.createElement('select');
    select.classList.add('select');
    for (let j = 0; j < list[i].stock_origin; j++) {
      let option = document.createElement('option');
      option.value = j + 1;
      option.textContent = j + 1;
      if (option.value == list[i].qty) {
        option.selected = 'selected';
      }
      select.appendChild(option);
    }
    quantity.className = 'quantity';
    quantity.appendChild(select);
    row.appendChild(quantity);

    //each price
    let price = document.createElement('div');
    price.className = 'price';
    price.textContent = `NT. ${list[i].price}`;
    row.appendChild(price);

    // each subtotal
    let subtotal = document.createElement('div');
    subtotal.className = 'subtotal eachSubtotal';
    subtotal.textContent = `NT. ${list[i].subtotal}`;
    row.appendChild(subtotal);

    let remove = document.createElement('div');
    let removeImg = document.createElement('img');
    remove.className = 'remove eachRemove';
    remove.id = `remove-${i}`; // set id to correspond cart.list
    remove.onclick = removeItem;
    removeImg.src = './images/cart-remove.png';
    remove.appendChild(removeImg);
    row.appendChild(remove);
    // console.log(remove);
  }

  /*******************************************************************
	  click select to change quantity, stock, and subtotal value (each)
  ********************************************************************/

  let selectItems = document.querySelectorAll('.select');
  let eachSubtotal = document.querySelectorAll('.eachSubtotal');
  //console.log(eachSubtotal);

  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener('change', (e) => {
      let renewQty = parseInt(e.target.value);
      // renew data
      list[i].qty = renewQty;
      list[i].stock = list[i].stock_origin - renewQty;
      list[i].subtotal = list[i].price * renewQty;
      //console.log(list[i]);
      window.localStorage.setItem('cart', JSON.stringify(cart));
      // render view
      eachSubtotal[i].textContent = `NT. ${list[i].subtotal}`;
    });
  }
}
renderCartPage();

/********************************************
	click remove button to delete list[choose]
********************************************/

function removeItem() {
  let index = parseInt(this.id.slice(7));
  console.log(index);
  // renew data
  cart = JSON.parse(window.localStorage.getItem('cart'));
  cart.list.splice(index, 1);
  window.localStorage.setItem('cart', JSON.stringify(cart));
  window.alert('已從購物車中移除');
  // render view
  let listNode = document.querySelector('.list');
  listNode.innerHTML = '';
  renderCartPage();
  checkCartEmpty();
}

/********************
	Shipping & Payment
********************/

let area = document.querySelector('.area');

cart.shipping = area.value;
area.onchange = function () {
  cart.shipping = this.value;
};

if (list.length !== 0) {
  freight = 60;
}

let payment = document.querySelector('.payment');
cart.payment = payment.value;
payment.onchange = function () {
  cart.payment = this.value;
};
//console.log(cart);

/******************************************************
  1. Check format of email and phone input
  2. Click confirm button to get Recipient information
*******************************************************/

const recipient = document.querySelector('.recipient');
let inputRecipient = recipient.querySelectorAll('input[type="text"]');

// check email format
inputRecipient[1].addEventListener('blur', (event) => {
  if (
    event.target.value.search(
      /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    ) == -1
  ) {
    window.alert('Email格式有誤，請重新填寫');
    event.target.value = '';
  }
});

// check phone number format
inputRecipient[2].addEventListener('blur', (event) => {
  if (event.target.value.search(/^[09]{2}[0-9]{8}$/) == -1) {
    window.alert('手機號碼格式有誤，請重新填寫');
    event.target.value = '';
  }
});

checkPay.addEventListener('click', () => {
  if (inputRecipient[0].value == false) {
    window.alert('請輸入收件人姓名');
  } else if (inputRecipient[1].value == false) {
    window.alert('請輸入 Email');
  } else if (inputRecipient[2].value == false) {
    window.alert('請輸入手機號碼');
  } else if (inputRecipient[3].value == false) {
    window.alert('請輸入收件地址');
  }

  for (let i = 0; i < inputRecipient.length; i++) {
    getRecipient('name');
    getRecipient('email');
    getRecipient('phone');
    getRecipient('address');
  }
});

function getRecipient(item) {
  let itemValue = document.querySelector(`input[name="recipient-${item}"]`)
    .value;
  cart.recipient[item] = itemValue;
}

// recipient-time
let time = document.getElementsByName('recipient-time');
for (let i = 0; i < time.length; i++) {
  time[i].addEventListener('click', () => {
    for (let j = 0; j < time.length; j++) {
      time[j].checked = false;
    }
    time[i].checked = true;
    cart.recipient.time = time[i].value;
    console.log(cart);
  });

  if (time[i].checked) {
    cart.recipient.time = time[i].value;
  }
}
//console.log(cart);

/***********************************************
	Calculate subtotal, freight, and  total price
***********************************************/

function calculatePay() {
  // renew cart data
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i].subtotal;
  }
  let total = sum + freight;
  cart.subtotal = sum;
  cart.freight = freight;
  cart.total = total;

  // render view
  let subtotalView = document.getElementById('subtotal');
  let freightView = document.getElementById('freight');
  let totalView = document.getElementById('total');
  subtotalView.textContent = sum;
  freightView.textContent = freight;
  totalView.textContent = total;
}

calculatePay();
//console.log(cart);

/****************************
	Update window localStorage
*****************************/

const view = document.querySelector('.view');
view.addEventListener('change', () => {
  window.localStorage.setItem('cart', JSON.stringify(cart));
});

view.addEventListener('click', () => {
  // update cart qty
  cartQty.textContent = list.length;
  cartQtyMobile.textContent = list.length;
  //update subtotal, freight, and  total price
  calculatePay();
  window.localStorage.setItem('cart', JSON.stringify(cart));
});

/*********** 

Week2-part3
1. TapPay: get prime
2. send prime and other order information to "Check Out API" (back-end) 

***********/

/************************
	1-1. Set up TapPay SDK
************************/

const appId = '12348';
const appKey =
  'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF';
TPDirect.setupSDK(appId, appKey, 'sandbox');

/**************************
	1-2. TPDirect.card.setup
**************************/

TPDirect.card.setup({
  fields: {
    number: {
      // css selector
      element: '#card-number',
      placeholder: '**** **** **** ****'
    },
    expirationDate: {
      // DOM object
      element: document.getElementById('card-expiration-date'),
      placeholder: 'MM / YY'
    },
    ccv: {
      element: '#card-ccv',
      placeholder: 'ccv'
    }
  }
});

/***************
	1-3. getPrime
***************/

checkPay.onclick = onSubmit;

function onSubmit(event) {
  event.preventDefault();
  // Get TapPay Fields  status
  const tappayStatus = TPDirect.card.getTappayFieldsStatus();

  // Check can getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('信用卡資訊填寫錯誤');
    return;
  }

  // Get prime
  TPDirect.card.getPrime((result) => {
    console.log(result);
    if (result.status !== 0) {
      alert('get prime error ' + result.msg);
      return;
    }
    // alert('get prime success');
    let prime = result.card.prime;
    let order = prepareOrder(prime);
    console.log(order);
    sendOrder(order);
  });
}

/**************************
	2-1. Prepare Order Data
**************************/

function prepareOrder(prime) {
  //	console.log(cart);

  let order = {
    prime: prime,
    order: {
      shipping: 'delivery',
      payment: 'credit_card',
      subtotal: cart.subtotal,
      freight: cart.freight,
      total: cart.total,
      recipient: {
        name: cart.recipient.name,
        phone: cart.recipient.phone,
        email: cart.recipient.email,
        address: cart.recipient.address,
        time: cart.recipient.time
      },
      list: cart
    }
  };
  showLoading();
  return order;
}

/************************
week2-part3  
2-2. Send Ajax Request
//
week3-part2
get access token from FB API and send to CheckOut API
************************/

// get access token from FB API
let accessToken;
fbInit(takeToken);
function takeToken(auth) {
  console.log(2, auth);
  accessToken = auth;
}

function sendOrder(order) {
  console.log(3, accessToken);
  const orderRequest = new XMLHttpRequest();
  const src = `${url}/order/checkout`;
  orderRequest.onreadystatechange = () => {
    if (orderRequest.readyState === 4 && orderRequest.status === 200) {
      hideLoading();
      let result = JSON.parse(orderRequest.responseText);
      if (result.error) {
        alert(`交易失敗，請再試一次：${result.error}`);
      } else {
        alert(`交易成功，訂單編號：${result.data.number}`);
        window.localStorage.clear();
        window.location = `./thankyou.html?number=${result.data.number}`;
      }
    }
  };

  orderRequest.open('POST', src, true);
  orderRequest.setRequestHeader('Content-type', 'application/json');

  // if user already signed in, add access token in request header
  if (accessToken) {
    orderRequest.setRequestHeader('Authorization', `Bearer ${accessToken}`);
  }
  orderRequest.send(JSON.stringify(order));
}
