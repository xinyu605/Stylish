//Create new promise to send Ajax request by get method
import { localStorage, getAjax, clickCallInput } from './common.js';

/*********** 
Week2-part1
1. Get current shopping cart data from localStorage.
2. If no data in localStorage, initialize it to an empty structure.
***********/

localStorage();
let cart = JSON.parse(window.localStorage.getItem('cart'));
let list = cart.list;
let cartQty = document.getElementById('cart-qty');
let cartQtyMobile = document.getElementById('mobile-cart-qty');
cartQty.textContent = list.length;
cartQtyMobile.textContent = list.length;

/*********** 
Week1-part1
Search feature
***********/
const url = 'https://api.appworks-school.tw/api/1.0/';
let belowPage;
let scrollCounter = 0;
let container = document.querySelector('.products');

// get query string to choose category (or search keyword)
let params = new URLSearchParams(window.location.search);
let thisCategory = params.get('tag');
let keyword = params.get('keyword');

if (keyword == undefined) {
  console.log('no search');
  if (!thisCategory) {
    thisCategory = 'all';
  }
  getProductData(thisCategory);
} else if (keyword == '') {
  console.log('search nothing');
  alert(`You haven't give search keyword!`);
  window.history.back();
} else {
  console.log('search');
  searchProductReq(keyword);
}

/*********** 

Week0-part3
1. Ajax: Connect to Product API to get Product data.
2. Update Products List in different category. 
	 Product categories: all, women, men, accessories

***********/

function getProductData(category, nextPage = null) {
  let src = '';
  if (nextPage) {
    src = `${url}/products/${category}?paging=${nextPage}`;
  } else {
    src = `${url}/products/${category}`;
  }
  getAjax(src).then((res) => {
    // console.log(res);
    outputData(res.data, res.next_paging);
  });
}

// function getProductData(category, nextPage = null) {
//   const productReq = new XMLHttpRequest();
//   let src = '';
//   if (nextPage) {
//     src = `${url}/products/${category}?paging=${nextPage}`;
//   } else {
//     src = `${url}/products/${category}`;
//   }

//   productReq.onreadystatechange = () => {
//     if (productReq.readyState === 4 && productReq.status === 200) {
//       const productData = JSON.parse(productReq.responseText).data;
//       const productPage = JSON.parse(productReq.responseText).next_paging;
//       outputData(productData, productPage);
//     }
//   };
//   productReq.open('GET', src, true);
//   productReq.send();
// }

function outputData(items, page) {
  items.forEach((item) => {
    let product = document.createElement('a');
    let productId = item.id;
    product.className = 'product';
    product.href = `product.html?id=${productId}`;
    container.appendChild(product);

    let productImg = item.main_image;
    let img = document.createElement('img');
    img.src = productImg;
    img.alt = `product-${productId}`;
    img.style.width = '100%';
    product.appendChild(img);

    let productColors = item.colors;
    productColors.forEach((productColor) => {
      let color = document.createElement('div');
      color.className = 'product-color';
      color.style.backgroundColor = `#${productColor.code}`;
      product.appendChild(color);
    });

    let productName = item.title;
    let name = document.createElement('p');
    name.className = 'product-intro';
    name.textContent = productName;
    product.appendChild(name);

    let productPrice = item.price;
    let price = document.createElement('p');
    price.className = 'product-intro';
    price.textContent = `TWD.${productPrice}`;
    product.appendChild(price);
  });

  // for infinite scroll
  if (page) {
    belowPage = page;
    scrollCounter = 0;
  }
}

/*********** 
Week1-part1
Step2 / Infinite scroll feature 
load more data when user scrolls down til the end of the page.
***********/

window.addEventListener('scroll', infiniteScroll);

function infiniteScroll() {
  //document bottom
  let windowRelativeBottom = document.documentElement.getBoundingClientRect()
    .bottom;
  //client window height
  let clientHeight = document.documentElement.clientHeight;
  if (windowRelativeBottom - clientHeight < 100) {
    scrollCounter += 1;
    if (belowPage && scrollCounter == 1) {
      // prevent to repeat append the same page when scrolling trigger
      console.log('Get Next Page');
      if (thisCategory) {
        getProductData(thisCategory, belowPage);
      }
    }
  }
}

/*********** 
Week1-part1
Step1 / Search feature
1. Ajax: Connect to Product Search API to get data.
2. Update Products List.
3. Event (mobile and tablet): click button to turn on search input box.
***********/

function searchProductReq(keyword, nextPage = null) {
  let src = '';
  if (nextPage) {
    src = `${url}/products/search?keyword=${keyword}&paging=${nextPage}`;
  } else {
    src = `${url}/products/search?keyword=${keyword}`;
  }
  getAjax(src).then((res) => {
    const productData = res.data;
    const productPage = res.next_paging;
    if (productData.length === 0) {
      let noResult = document.createElement('p');
      noResult.textContent = '沒有搜尋到任何產品哦！';
      container.appendChild(noResult);
      console.log('nothing');
    } else {
      outputData(productData, productPage);
      console.log('we have what you want!');
    }
  });
}

// mobile: click button to turn on input box
clickCallInput();

/*********** 
Week1-part2
Step1 / Get Marketing Campaigns
1. Ajax: Connect to Marketing Hots API to get data.
2. insert picture to keyvisual.
***********/

let src = `${url}/marketing/campaigns`;
getAjax(src).then((res) => {
  outputVisual(res.data);
});

const keyVisual = document.querySelector('.keyvisual');
const step = document.querySelector('.step');
let visualPic = [];
let visualStory = [];
let circle = [];
let slideIndex = 0;

keyVisual.onmouseover = function () {
  stopTimer();
};

keyVisual.onmouseout = function () {
  timer = window.setInterval(movingBanner, 3000);
};

function outputVisual(pics) {
  for (let i = 0; i < pics.length; i++) {
    let path = pics[i].picture;
    let story = pics[i].story;
    let productId = pics[i].product_id;
    story = story.replaceAll('\r\n', '<br>');
    visualPic[i] = document.createElement('a');
    visualPic[i].className = 'visual';
    visualPic[i].style.backgroundImage = `url(${path})`;
    visualPic[i].href = `./product.html?id=${productId}`;
    visualStory[i] = document.createElement('span');
    visualStory[i].className = 'story';
    visualStory[i].innerHTML = story;
    visualPic[i].appendChild(visualStory[i]);
    keyVisual.insertBefore(visualPic[i], step);

    circle[i] = document.createElement('a');
    circle[i].className = 'circle';
    circle[i].onclick = function () {
      stopTimer;
      clickCircle(i);
    };
    step.appendChild(circle[i]);
  }
  movingBanner(visualPic);
}

let timer = window.setInterval(movingBanner, 3000);

function stopTimer() {
  window.clearInterval(timer);
  console.log('stop');
}

function movingBanner() {
  visualPic.forEach((pic) => {
    pic.className = 'visual';
    pic.classList.remove('current');
  });

  visualPic[slideIndex].classList.add('current');
  circle.forEach((dot) => {
    dot.style.backgroundColor = '#fff';
  });
  circle[slideIndex].style.backgroundColor = '#000';

  if (slideIndex < visualPic.length - 1) {
    slideIndex = slideIndex + 1;
  } else {
    slideIndex = 0;
  }
}

function clickCircle(i) {
  visualPic.forEach((pic) => {
    pic.classList.remove('current');
  });
  visualPic[i].classList.add('current');
  circle.forEach((dot) => {
    dot.style.backgroundColor = '#fff';
  });
  circle[i].style.backgroundColor = '#000';
}
