// main.js
'use strict';

class EasyChat {
  /**
   * @desc Template for messages.
   */
  static get MESSAGE_TEMPLATE() {
    return ('<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
      '</div>');
  }

  /**
   * @desc Constructor
   */
  constructor() {
    this.checkSetup();

    // Shortcuts to DOM Elements.
    this.messageList = document.getElementById('messages');
    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');
    this.submitButton = document.getElementById('submit');
    this.imageForm = document.getElementById('image-form');
    this.mediaCapture = document.getElementById('mediaCapture');
    this.userPic = document.getElementById('user-pic');
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');
    this.signInSnackbar = document.getElementById('must-signin-snackbar');

    // Saves message on form submit.
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

    this.initFirebase();
    this.initAuth();

    // Firestoreからメッセージ読み込み
    this.loadMessages();
  }

  // Sets up Firebase features.
  initFirebase() {
    // Firestoreを使うための初期化処理
    this.firestore = firebase.firestore();
  };

  // Sets up Firebase Authentication.
  initAuth() {
  }

  // Loads chat messages history and listens for upcoming ones.
  loadMessages() {
  };

  // Saves a new message on the Firestore.
  saveMessage(e) {
  };

  // Signs-in Easy Chat.
  signIn() {
    // サインインボタンが押されたらGoogleログイン
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  };

  // Signs-out of Easy Chat.
  signOut() {
    // サインアウトボタンが押されたらログアウト
    this.auth.signOut();
  };

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  onAuthStateChanged(user) {
    if (user) {
      // ユーザープロファイルをロード
      var profilePicUrl = user.photoURL;
      var userName = user.displayName;

      // Set the user's profile pic and name.
      this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
      this.userName.textContent = userName;

      // Show user's profile and sign-out button.
      this.userName.removeAttribute('hidden');
      this.userPic.removeAttribute('hidden');
      this.signOutButton.removeAttribute('hidden');

      // Hide sign-in button.
      this.signInButton.setAttribute('hidden', 'true');

      // We load currently existing chant messages.
      this.loadMessages();
    } else {
      // Hide user's profile and sign-out button.
      this.userName.setAttribute('hidden', 'true');
      this.userPic.setAttribute('hidden', 'true');
      this.signOutButton.setAttribute('hidden', 'true');

      // Show sign-in button.
      this.signInButton.removeAttribute('hidden');

      // ログアウト時にログイン画面に遷移
      window.location.href = './login.html';
    }
  };

  // Returns true if user is signed-in. Otherwise false and displays a message.
  checkSignedInWithMessage() {
    // 認証されているかチェック
    if (this.auth.currentUser) {
      return true;
    }

    // Display a message to the user using a Toast.
    var data = {
      message: 'You must sign-in first',
      timeout: 2000
    };

    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);

    return false;
  };

  // Resets the given MaterialTextField.
  resetMaterialTextfield(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
  };

  // Displays a Message in the UI.
  displayMessage(key, name, text, picUrl) {
    var div = document.getElementById(key);

    if (!div) {
      var container = document.createElement('div');
      container.innerHTML = EasyChat.MESSAGE_TEMPLATE;
      div = container.firstChild;
      div.setAttribute('id', key);
      this.messageList.appendChild(div);
    }
    if (picUrl) {
      div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    }
    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
    if (text) {
      messageElement.textContent = text;
      // 改行を<br>で置き換え.
      messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }

    // Show the card fading-in.
    setTimeout(function () {
      div.classList.add('visible')
    }, 1);
    this.messageList.scrollTop = this.messageList.scrollHeight;
    this.messageInput.focus();
  };

  // 送信ボタンの表示を切り替え
  toggleButton() {
    if (this.messageInput.value) {
      this.submitButton.removeAttribute('disabled');
    } else {
      this.submitButton.setAttribute('disabled', 'true');
    }
  };

  // Checks that the Firebase SDK has been correctly setup and configured.
  checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
    }
  };
}

window.onload = function () {
  // Initializes EasyChat.
  window.easyChat = new EasyChat();
};

// Setup ServiceWorker.
window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
      .then(function(registration) {
        console.log("serviceWorker registed.");
      }).catch(function(error) {
        console.warn("serviceWorker error.", error);
      });
  }
});
