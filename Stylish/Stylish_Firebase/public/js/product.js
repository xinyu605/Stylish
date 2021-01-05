import { localStorage, getAjax } from './common.js';
/*********** 
Week2-part1
1. Get current shopping cart data from localStorage.
2. If no data in localStorage, initialize it to an empty structure.
***********/
localStorage();
let cart = JSON.parse(window.localStorage.getItem('cart'));
let list = cart.list;

const host = 'https://api.appworks-school.tw';
const url = `${host}/api/1.0/`;

/*********** 
Week1-part4
1. Ajax: Connect to Product API to get Product details data.
2. Update Products details and render product.html.
***********/

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
const src = `${url}/products/details?id=${productId}`;
let detailsData;

getAjax(src).then((res) => {
  detailsData = res.data;
  renderInitial(detailsData);
});

const mainImage = document.querySelector('.main-image');
const name = document.querySelector('.name');
const id = document.querySelector('.id');
const price = document.querySelector('.price');
const colors = document.querySelector('.colors');
const sizes = document.querySelector('.sizes');
const operators = document.querySelectorAll('div.operator');
let value = document.querySelector('.value');
let qty = 1;
let cartQty = document.getElementById('cart-qty');
let cartQtyMobile = document.getElementById('mobile-cart-qty');
const summary = document.querySelector('.summary');
const story = document.querySelector('.story');
const images = document.querySelector('.images');

function renderInitial(data) {
  const mainImg = document.createElement('img');
  mainImg.src = data.main_image;
  mainImg.alt = `product-${productId}`;
  mainImage.appendChild(mainImg);

  // name, id, price
  name.innerHTML = data.title;
  id.innerHTML = productId;
  price.innerHTML = `TWD.${data.price}`;

  // colors
  for (let i = 0; i < data.colors.length; i++) {
    let color = document.createElement('div');
    color.className = 'color';
    color.id = data.colors[i].code;
    color.name = data.colors[i].name;
    color.style.backgroundColor = `#${data.colors[i].code}`;
    color.onclick = selectColor;
    colors.appendChild(color);
  }
  const colorList = colors.querySelectorAll('div.color');
  colorList[0].classList.add('current');

  // sizes
  for (let i = 0; i < data.sizes.length; i++) {
    let size = document.createElement('div');
    size.className = 'size';
    size.textContent = data.sizes[i];
    size.onclick = selectSize;
    sizes.appendChild(size);
  }
  const sizeList = sizes.querySelectorAll('div.size');
  sizeList[0].classList.add('current');

  // quantity
  value.textContent = qty;
  cartQty.textContent = list.length;
  cartQtyMobile.textContent = list.length;
  operators[0].onclick = minusQty;
  operators[1].onclick = addQty;

  // summary
  const description = data.description.replace('\r\n', '<br/>');
  summary.innerHTML = `${data.note}<br/><br/>${data.texture}<br/>${description}<br/><br/>清洗：${data.wash}<br/>產地：${data.place}`;

  // story
  story.innerHTML = data.story;

  // images
  for (let i = 0; i < 2; i++) {
    let img = document.createElement('img');
    img.src = data.images[i];
    img.alt = `product-detail-${i}`;
    images.appendChild(img);
  }

  //initial state (week1-part5)
  getColorStock();
  stockRecord();
}

/*********** 

Week1-part5
Handle stock of product variants.

***********/

// 1.select current color: initialize size and quantity
function selectColor() {
  let colorList = colors.querySelectorAll('div.color');
  for (let i = 0; i < colorList.length; i++) {
    colorList[i].classList.remove('current');
  }
  this.classList.add('current');

  // initialize size
  let sizeList = sizes.querySelectorAll('div.size');
  for (let i = 0; i < sizeList.length; i++) {
    sizeList[i].className = 'size';
    sizeList[i].style.opacity = 1;
    sizeList[i].style.pointerEvents = 'auto';
  }
  sizeList[0].classList.add('current');

  // initialize quantity
  qty = 1;
  value.textContent = qty;

  getColorStock();
  stockRecord();
}

// 2.select current size: initialize quantity
function selectSize() {
  let sizeList = sizes.querySelectorAll('div.size');
  for (let i = 0; i < sizeList.length; i++) {
    sizeList[i].classList.remove('current');
  }
  this.classList.add('current');

  // initialize quantity
  qty = 1;
  value.textContent = qty;

  getColorStock('doSelect');
  stockRecord();
}

function minusQty() {
  if (qty > 0) {
    qty = qty - 1;
  } else {
    qty = 0;
  }
  value.textContent = qty;
  stockRecord();
}

function addQty() {
  if (qty < stock) {
    qty = qty + 1;
    value.textContent = qty;
  }
  stockRecord();
}

// 3. get stock data: correspond to current color and size
let stock = 0;
let stock_origin = 0;

function getColorStock(clickSelectSize) {
  const variants = detailsData.variants;
  const color = colors.querySelector('.current');

  // let data.variants.color_code becomes one color array
  let colorSelect = [];
  for (let i = 0; i < variants.length; i++) {
    if (color.id === variants[i].color_code) {
      colorSelect.push(variants[i]);
    }
  }
  //	console.log(colorSelect);

  let selectableSize = [];
  let sizeList = sizes.querySelectorAll('div.size');
  for (let i = 0; i < colorSelect.length; i++) {
    if (colorSelect[i].stock == 0) {
      sizeList[i].style.opacity = 0.3;
      sizeList[i].style.pointerEvents = 'none';
      sizeList[i].classList.remove('current');
      //			console.log(i);
    } else {
      selectableSize.push(sizeList[i]);
    }
  }
  //  	console.log(selectableSize);

  if (clickSelectSize == 'doSelect') {
    console.log('size current has already existed');
  } else {
    selectableSize[0].classList.add('current');
  }

  const size = sizes.querySelector('.current');
  //	console.log(size);

  // get stock of selected size
  for (let j = 0; j < colorSelect.length; j++) {
    if (size.textContent === colorSelect[j].size) {
      stock = colorSelect[j].stock;
      stock_origin = stock;
    }
  }
}

// 4. stock record: set up max limit of quantity and update UI

let count = list.length; // count+1 when click cart button

function stockRecord() {
  //	console.log('stock:', stock, 'qty:', qty);

  // week2-part1 add-to-cart button click event
  const cartButton = document.getElementById('product-add-cart-btn');
  cartButton.onclick = function () {
    count += 1;
    window.alert('已加入購物車');
    cartStorage();
  };
}

/*********** 

Week2-part1
Shopping cart implementation

***********/

function cartStorage() {
  let item;
  let currentStock = stock - qty;
  item = {
    main_image: detailsData.main_image,
    name: name.innerHTML,
    id: id.innerHTML,
    price: detailsData.price,
    color: {
      code: colors.querySelector('.current').id,
      name: colors.querySelector('.current').name
    },
    size: sizes.querySelector('.current').innerHTML,
    qty: qty,
    stock: currentStock,
    stock_origin: stock_origin,
    subtotal: detailsData.price * qty
  };
  list[count - 1] = item;

  for (let i = 0; i < list.length - 1; i++) {
    // merge same color and size quantity
    if (item.color.code === list[i].color.code && item.size === list[i].size) {
      if (list[i].stock - qty >= 0) {
        list[i].qty += qty;
        list[i].stock -= qty;
      } else {
        window.alert(`Here is no more than ${list[i].stock}`);
      }
      list.pop();
      count -= 1;
    }
  }

  console.log('list:', list);
  //	console.log(cart.list);

  cartQty.textContent = list.length;
  cartQtyMobile.textContent = list.length;

  window.localStorage.setItem('cart', JSON.stringify(cart));
}
