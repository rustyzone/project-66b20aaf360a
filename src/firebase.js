// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxx",
  authDomain: "coupon-xxx-xxx.firebaseapp.com",
  databaseURL: "https://coupon-xxx-xxx.firebaseio.com",
  projectId: "coupon-finder-xxx",
  storageBucket: "coupon-finder-xxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "1:xxxxx:web:xxxx",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if (msg.command == "fetch") {
    var domain = msg.data.domain;
    var enc_domain = btoa(domain);
    firebase
      .database()
      .ref("/domain/" + enc_domain)
      .once("value")
      .then(function (snapshot) {
        response({
          type: "result",
          status: "success",
          data: snapshot.val(),
          request: msg,
        });
      });
  }

  //submit coupon data..
  if (msg.command == "post") {
    var domain = msg.data.domain;
    var enc_domain = btoa(domain);
    var code = msg.data.code;
    var desc = msg.data.desc;

    try {
      var newPost = firebase
        .database()
        .ref("/domain/" + enc_domain)
        .push()
        .set({
          code: code,
          description: desc,
        });

      var postId = newPost.key;
      response({
        type: "result",
        status: "success",
        data: postId,
        request: msg,
      });
    } catch (e) {
      console.log("error:", e);
      response({ type: "result", status: "error", data: e, request: msg });
    }
  }

  return true;
});
