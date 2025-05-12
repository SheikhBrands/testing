
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAwBUrkMBjT-W63OjsaQd-Vsnz3vLVJiIM",
    authDomain: "myweb-5225a.firebaseapp.com",
    projectId: "myweb-5225a",
    storageBucket: "myweb-5225a.firebasestorage.app",
    messagingSenderId: "750428808854",
    appId: "1:750428808854:web:8760a24883bc391c1d84b7",
    measurementId: "G-WHYXBGC7WF"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();



const submit = document.getElementById('submit');

submit.addEventListener("click", function (event) {
  // body...
  event.preventDefault();
  const email = document.getElementById('register-email').value;
const pass = document.getElementById('register-password').value;

  createUserWithEmailAndPassword(auth, email, pass)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Account Created Successfully...");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("an Error Please Try Again...");

    // ..
  });

});
