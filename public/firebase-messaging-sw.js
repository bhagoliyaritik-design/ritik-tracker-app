importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBSh8kMBP3HOnkYUQPxdrGF7J78Cy3FHmA",
  authDomain: "ritik-tracker.firebaseapp.com",
  projectId: "ritik-tracker",
  messagingSenderId: "722190641913",
  appId: "1:722190641913:web:ee40032d5b67cc0ae7d028",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(
    payload.notification.title,
    { body: payload.notification.body }
  );
});