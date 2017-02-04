import React from 'react';
import * as firebase from 'firebase';
import { observer } from "mobx-react";
import 'react-fastclick';
import Artists from './components/Artists.jsx';
import Artist from './components/Artist.jsx';
import SearchResults from './components/SearchResults.jsx';
import SearchInput from './components/SearchInput.jsx';
import { toJS } from "mobx";
import classNames from 'classnames';
import Icon from './components/Icon.jsx';
import Album from './components/Album.jsx';
import Player from './components/Player.jsx';
import Flex from './components/Flex.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import offlineArtists from './artistsData';

import UIStore from './stores/UIStore.js';

var config = {
  apiKey: "u9EVkUxsRQDRgoTtc8JPVn5sSu0REsdER5FCphM2",
  authDomain: "bandsc8pr.firebaseapp.com",
  databaseURL: "https://bandsc8pr.firebaseio.com",
  storageBucket: "bandsc8pr.appspot.com",
  // messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);


@observer
class Main extends React.Component {

  constructor() {
    super();
    this.state = {
        artists: {}
    }
  }




  // the on should have an error catch so i can set state with offline data
  // something like this:
  // artistsRef.remove()
  //   .then(function() {
  //       console.log("Remove succeeded.")
  //   })
  //   .catch(function(error) {
  //       console.log("Remove failed: " + error.message)
  //   });


  componentWillMount() {
      var artistsRef = firebase.database().ref().child('artists')
      artistsRef.on('value', snap => {
          this.setState({
              artists: snap.val()
          });
     });
  }

  componentDidMount() {

      this.setState({
          artists: offlineArtists
      })

  }

  render() {


    const {currentView, previousView, searchResults} = UIStore;

    const { artists } = this.state;

    const artistClasses = classNames('fullbleed',{});

    const searchResultsClasses = classNames('flex center top fullbleed scroll search_results_container',{
        'state-active': UIStore.searchingActive
    })

    return (

        <div className="fullbleed flex vertical between outer_wrapper">

            { !currentView.artist && !currentView.album &&
                <Artists
                    artists={ artists }
                    store={ UIStore } />
            }

            { currentView.artist && !currentView.album &&
                <Artist
                    artistKey={ currentView.artist }
                    artists={ artists }
                    store={ UIStore } />
            }

            { currentView.artist && currentView.album &&
              <Album
                  artists={ artists }
                  artistKey={ currentView.artist }
                  albumKey={ currentView.album } />
            }

            <div className={ searchResultsClasses }>
                { searchResults.length > 0 &&
                <SearchResults artists={ artists } />
                }
                { searchResults.length === 0 &&
                <span className="flex center mt3 p3">Searching Across Bandcamp</span>
                }
            </div>


            <Player artists={ artists } />

            <div className="top_bar flex shrink center middle">
                <SearchInput />
            </div>

        </div>
    );
  }
}
export default Main;





// <div className="top_bar">
//
//     <Search artists={ artists } />
//
// </div>
