// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js")
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js")

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: "AIzaSyD2b6pGpKgvK1S5Cs1Li5pxoKhxukJnq1k",
  authDomain: "tpeuv52dazlcddyklpjh.firebaseapp.com",
  projectId: "tpeuv52dazlcddyklpjh",
  storageBucket: "tpeuv52dazlcddyklpjh.appspot.com",
  messagingSenderId: "442865436980",
  appId: "1:442865436980:web:8143153deef6c48d2dfd61",
  measurementId: "G-NVP74C2KYQ",
})

// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.png",
  }
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions)
})
