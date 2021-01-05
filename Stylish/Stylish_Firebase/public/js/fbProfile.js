export function getFbData(handleInfo) {
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

    //get and handle user data
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        console.log(1, response);
        let accessToken = response.authResponse.accessToken;
        let memberInfo = {
          provider: 'facebook',
          access_token: accessToken
        };
        // console.log(memberInfo);
        handleInfo(memberInfo); //argument: handleInfo

        // take FB photo
        FB.api(
          '/me',
          {
            fields: 'id,name,email,picture'
          },
          function (response) {
            console.log(2, response);
            //render picture
            const picture = document.querySelector('.picture');
            const userPhoto = document.createElement('img');
            userPhoto.src = response.picture.data.url;
            picture.appendChild(userPhoto);
          }
        );
      } else {
        // login();
        document.querySelector('.view').innerHTML =
          '<h1>您尚未登入，網頁將於5秒後自動跳轉回首頁</h1>';

        let timer;
        timer = function timeHandler() {
          window.location.replace('./');
        };
        setTimeout(timer, 5000);
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

// pop up FB login window
// export function login() {
//   FB.login(
//     function (response) {
//       console.log(response);
//       if (response.status === 'connected') {
//         FB.api(
//           '/me',
//           {
//             fields: 'id,name,email,picture.width(200).height(200)'
//           },
//           function (response) {
//             console.log(response);
//             window.alert('已成功登入！');
//           }
//         );
//       }
//     },
//     {
//       scope: 'email',
//       auth_type: 'rerequest'
//     }
//   );
// }
