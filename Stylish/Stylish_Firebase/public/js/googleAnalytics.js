/**************** 
week3-part3
Google Analytics
*****************/

//loads the gtag.js library
//establishes GA_MEASUREMENT_ID as the default Google Analytics property ID

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag('js', new Date());

// configure a target
gtag('config', 'G-LJF1G4C9EM');
