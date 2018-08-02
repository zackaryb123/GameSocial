//import ReactGA from 'react-ga';

// Local
export const API_LOCAL_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// mLab
export const API_BASE_URL = 'mongodb://react-redux-reusable-user:Digger123!@ds245548.mlab.com:45548/lost-n-found-server';

// Firebase
export const fireConfig = {
  apiKey: "AIzaSyBhuu4NabLiN5WnbA3QjPrW6uP6Vc8ZOFQ",
  authDomain: "reactive-redux-template.firebaseapp.com",
  databaseURL: "https://reactive-redux-template.firebaseio.com",
  projectId: "reactive-redux-template",
  storageBucket: "reactive-redux-template.appspot.com",
  messagingSenderId: "185681445453"
};

// Cloudinary
export const CloudinaryConfig = {
  cloud_name: "game-social",
  apiKey: "717879497941692",
  Secret:"Su-beI1mwMJFuLfIQiaenF_BCWE",
  avatarUrl: "https://api.cloudinary.com/v1_1/game-social/video/avatar",
  avatarPreset: 'game-social-avatar',
  videoUrl: "https://api.cloudinary.com/v1_1/game-social/video/upload",
  imageUrl: "https://api.cloudinary.com/v1_1/game-social/image/upload",
  apiUlr: "https://api.cloudinary.com/v1_1/game-social",
  sourceUrl: "https://res.cloudinary.com/game-social"
};

// Google Analytics
// ReactGA.initialize('UA-122220933-1',{
//   debug:true
// });
//
// export default ReactGA;