// login.js
'use strict';

// Initializes EasyChat.
function EasyChat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.signInButton = document.getElementById('sign-in');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
}

// Sets up Firebase features.
EasyChat.prototype.initFirebase = function() {
  // TODO : 11. 認証を追加
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in Easy Chat.
EasyChat.prototype.signIn = function() {
  // TODO : 11. サインインボタン
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
EasyChat.prototype.onAuthStateChanged = function(user) {
  if (user) {
    // ログイン成功時にチャット画面に遷移
    window.location.href = './';
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
EasyChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions and make ' +
      'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  // Initializes EasyChat.
  window.easyChat = new EasyChat();
};
