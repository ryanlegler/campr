// import { computed, observable } from "mobx"
// import * as firebase from 'firebase';


// var config = {
//   apiKey: "u9EVkUxsRQDRgoTtc8JPVn5sSu0REsdER5FCphM2",
//   authDomain: "bandsc8pr.firebaseapp.com",
//   databaseURL: "https://bandsc8pr.firebaseio.com",
//   storageBucket: "bandsc8pr.appspot.com",
//   // messagingSenderId: "<SENDER_ID>",
// };
// firebase.initializeApp(config);


// var artistsRef = firebase.database().ref().child('artists');
// artistsRef.on('value', snap => {
//   console.log("value",snap.val() );

// });

// class Artist {
//   @observable value
//   @observable id

//   constructor(value) {
//     this.value = value
//     this.id = Date.now()
//   }
// }

// export class ArtistsStore {
//   @observable artists = []


//   //


//   addArtists(value) {
//     this.artists.push(new Artist(value))
//   }

// }

// export default new ArtistsStore

