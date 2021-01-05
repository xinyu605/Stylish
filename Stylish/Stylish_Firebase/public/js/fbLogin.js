/*********** 
Week3-part1
Facebook Login
Set up FB JavaScript SDK.
***********/
window.onload = fbInit;
console.log(typeof fbInit);
export function fbInit(takeToken) {
  window.fbAsyncInit = function () {
    //initialization
    FB.init({
      appId: '362362971692814',
      cookie: true,
      xfbml: true,
      version: 'v8.0'
    });

    // user behavior record (can be reviewed at back-end)
    FB.AppEvents.logPageView();

    // check if user login
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        console.log('已登入');
        console.log(response);
        let auth = response.authResponse.accessToken;
        console.log(1, auth);
        if (typeof takeToken == 'function') {
          takeToken(auth);
        } //for cart.js CheckOut API
      }
    });
  };

  // Load the SDK asynchronously
  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
}

/****
response = {
    status: 'connected',  // connected (已登入FB與App) | not_authorized (已登入FB但未登入App) | unknown (未登入FB所以不知是否已登入App)
    authResponse: {
        accessToken: '...', // include user's access token
        expiresIn:'...',    // when will user need to login again
        signedRequest:'...',  // include user's information
        userID:'...'
    }
}
****/

// Click member button to login / redirect to profie page
let memberButtons = document.querySelectorAll('.member');
memberButtons.forEach((memberButton) => {
  memberButton.addEventListener('click', () => {
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        console.log('已登入');
        console.log(1, response);
        let accessToken = response.authResponse.accessToken;
        let memberInfo = {
          provider: 'facebook',
          access_token: accessToken
        };
        signIn(memberInfo);
        window.location = './profile.html';
      } else {
        login();
      }
    });
  });
});

// SignIn API
const url = 'https://api.appworks-school.tw/api/1.0';
function signIn(memberInfo) {
  const req = new XMLHttpRequest();
  const src = `${url}/user/signin`;
  req.onreadystatechange = () => {
    if (req.readyState === 4 && req.status === 200) {
      let userInfo = JSON.parse(req.responseText);
      console.log(userInfo);
    }
  };
  req.open('POST', src, true);
  req.setRequestHeader('Content-type', 'application/json');
  req.send(JSON.stringify(memberInfo));
}

// pop up FB login window
function login() {
  FB.login(
    function (response) {
      console.log(response);
      if (response.status === 'connected') {
        FB.api(
          '/me',
          {
            fields: 'id,name,email,picture.width(200).height(200)'
          },
          function (response) {
            window.alert('已成功登入！');
            console.log(response);
          }
        );
      }
    },
    {
      scope: 'email',
      auth_type: 'rerequest'
    }
  );
}
