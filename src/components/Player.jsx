import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { observer } from "mobx-react";
import { toJS } from "mobx";
import ArtistImage from '.././components/ArtistImage.jsx';
import UIStore from '.././stores/UIStore.js';




@observer
export default class Player extends Component {

    constructor(props) {
        super();
    }

    trackEnded(index) {

        if (UIStore.playingTracks.length > index + 1) {
            UIStore.setPlayingOffset(index)
        } else {
            console.log("end of album")
        }
    }

    render() {

        const {playingTracks, playingOffset, playingArtist, playingAlbum} = UIStore
        const {artists} = this.props;
        const track = playingTracks[playingOffset];

        let albumImage = undefined;
        if (artists && artists[playingArtist]) {
            albumImage = artists[playingArtist].img;
        }

        if (!track) {
            return (<div></div>)
        } else {
            return(
                <div className="flex player_container">
                    <div className="flex middle">
                        {albumImage &&
                            <ArtistImage classes="flex shrink artist_image m1 middle" src={albumImage} />
                        }
                        <div className="flex vertical left middle">
                            <div>{track.title}</div>
                            <ReactAudioPlayer src={track.file} autoPlay="true" onEnded={this.trackEnded.bind(this, playingOffset + 1)} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

// <div>{playingArtist}</div>
// <div>{playingAlbum}</div>


   // var mp3 = document.createElement("audio");
   // mp3.setAttribute('src', 'http://example.com/track.mp3');
   // mp3.load();
   // document.documentElement.appendChild(mp3);
   // mp3.play();
   // // use mp3.pause() to pause :=)
