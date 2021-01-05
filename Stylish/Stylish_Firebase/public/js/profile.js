import { getFbData } from './fbProfile.js';
import { localStorage } from './common.js';

// render fb profile
// getFbData(renderProfile);

getFbData(signIn);
function signIn(memberInfo) {
  console.log(memberInfo);
  const url = 'https://api.appworks-school.tw/api/1.0';
  const req = new XMLHttpRequest();
  const src = `${url}/user/signin`;
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      let auth = JSON.parse(req.responseText);
      console.log(auth);
      renderProfile(auth);
    }
  };
  req.open('POST', src, true);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(memberInfo));
}

// render member profile (picture use FB.api directly in fbProfile.js)
function renderProfile(res) {
  console.log('a');
  console.log(res);
  // const picture = document.querySelector('.picture');
  // const userPhoto = document.createElement('img');
  const name = document.querySelector('.name');
  const email = document.querySelector('.email');
  // userPhoto.src = res.data.user.picture;
  // console.log(res.data.user.picture);
  // picture.appendChild(userPhoto);
  name.textContent = res.data.user.name;
  email.textContent = res.data.user.email;
}

// get and render cart data
localStorage();
let cart = JSON.parse(window.localStorage.getItem('cart'));
let list = cart.list;
let cartQty = document.getElementById('cart-qty');
let cartQtyMobile = document.getElementById('mobile-cart-qty');
cartQty.textContent = list.length;
cartQtyMobile.textContent = list.length;

// logout
const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  FB.getLoginStatus(function (response) {
    if (response.status === 'connected') {
      FB.logout(function () {
        window.localStorage.clear();
      });
      window.alert('已成功登出！');
      window.location.replace('./');
    }
  });
});
