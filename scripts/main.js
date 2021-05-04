// main.js
'use strict';

// Initializes EasyChat.
function EasyChat() {
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

  // TODO : 08. firestoreから読み込み
  // TODO : 10. リアルタイムアップデートを拾うようにしたら不要
  //this.loadMessages();
}

// Sets up Firebase features.
EasyChat.prototype.initFirebase = function() {
  // TODO : 08. firestoreから読み込み
   this.firestore = firebase.firestore();

  // TODO : 10. Add realtime update listener
   var that = this;
   this.firestore.collection('messages')
     .orderBy('timestamp')
     .onSnapshot(function(querySnapshot) {
       querySnapshot.docChanges().forEach(function(change) {
         if (change.type === "added") {
           that.displayMessage(change.doc.id, change.doc.data().name, change.doc.data().message, change.doc.data().photoURL)
         }
       });
     });

  // TODO : 12. 認証を追加
   this.auth = firebase.auth();
   this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
EasyChat.prototype.loadMessages = function() {
  // TODO : 08. firestoreから読み込み
//   this.firestore.collection('messages')
//     .orderBy('timestamp')
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         this.displayMessage(doc.id, doc.data().name, doc.data().message, 'images/profile_placeholder.png')
//     });
//   })

  // TODO : 12. 認証後のユーザー画像追加
   this.firestore.collection('messages')
     .orderBy('timestamp')
     .get()
     .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
         this.displayMessage(doc.id, doc.data().name, doc.data().message, doc.data().photoURL)
       });
     })
};

// Saves a new message on the Firestore.
EasyChat.prototype.saveMessage = function(e) {
  e.preventDefault();
  // TODO : 06. 送信時処理を追加
  //if (this.messageInput.value) {
  //  var date = new Date();
  //  this.displayMessage(date.getTime(), 'User Name', this.messageInput.value, 'images/profile_placeholder.png');
  //}

  // TODO : 09. 送信時のFirestore保存処理を追加
   //if (this.messageInput.value) {
     //this.firestore.collection('messages').add({
       //name: "User Name",
       //message: this.messageInput.value,
       //photoURL: '/images/profile_placeholder.png',
       //timestamp: new Date()
     //})
     //.catch(function(error) {
       //console.error("Error adding document: ", error);
     //});
//
     //EasyChat.resetMaterialTextfield(this.messageInput);
     //this.toggleButton();
   //}

  // TODO : 12. 認証チェックを追加
   if (this.messageInput.value && this.checkSignedInWithMessage()) {
     this.firestore.collection('messages').add({
       name: this.auth.currentUser.displayName,
       message: this.messageInput.value,
       photoURL: this.auth.currentUser.photoURL || '/images/profile_placeholder.png',
       timestamp: new Date()
     })
     .catch(function(error) {
       console.error("Error adding document: ", error);
     });

     EasyChat.resetMaterialTextfield(this.messageInput);
     this.toggleButton();
   }
};

// Signs-in Easy Chat.
EasyChat.prototype.signIn = function() {
  // TODO : 11. サインインボタン
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Easy Chat.
EasyChat.prototype.signOut = function() {
  // TODO : 11. サインアウトボタン
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
EasyChat.prototype.onAuthStateChanged = function(user) {
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

    // TODO : 11. ログアウト時にログイン画面に遷移
    window.location.href = './login.html';
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
EasyChat.prototype.checkSignedInWithMessage = function() {
  // TODO : 11. 認証されているかチェック
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
EasyChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
EasyChat.MESSAGE_TEMPLATE =
  '<div class="message-container">' +
  '<div class="spacing"><div class="pic"></div></div>' +
  '<div class="message"></div>' +
  '<div class="name"></div>' +
  '</div>';

// A loading image URL.
// EasyChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
EasyChat.prototype.displayMessage = function(key, name, text, picUrl) {
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
  setTimeout(function() {
    div.classList.add('visible')
  }, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// 送信ボタンの表示を切り替え
EasyChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
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
