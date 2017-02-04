import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Axios from 'axios';
import { toJS } from "mobx";
import ArtistImage from './ArtistImage.jsx';
import classNames from 'classnames';
import Icon from '../components/Icon.jsx';
import * as firebase from 'firebase';
import Moment from 'moment'
import UIStore from '.././stores/UIStore.js';

export default class Album extends Component {

    constructor(props){
        super();
        this.state = {
            tracks: []
        }
    }

    componentDidMount() {

        const { artists, artistKey, albumKey } = this.props;
        let artist = artists[artistKey];
        let currentAlbum = artists[artistKey].albums[albumKey];

        this.setState ({
            tracks: currentAlbum.tracks
        });

        if (!currentAlbum.timestamp) {
            console.log("NO timestamp")
            var url = `https://campr-api.herokuapp.com/artist/${artistKey}/album/${albumKey}/`;
            Axios(url)
                .then((response) => {
                    const data = response.data;
                    const about = data.about || '';
                    const label_link = data.label_link || '';
                    const label = data.label || '';
                    const tags = data.tags || '';
                    const timestamp = data.timestamp || '';
                    const collectors  = data.collectors && data.collectors.thumbs || '';

                    const labelObject = {
                        name: label,
                        link: label_link
                    }
                    firebase.database().ref().child(`artists/${artistKey}/albums/${albumKey}`).update({
                        about: about,
                        timestamp: timestamp,
                        tags: tags,
                        label: labelObject,
                        collectors: collectors

                    })
                })
        } else {
            console.log("HAS timestamp")
        }

    }

    playTrack(index) {

        // var tracks = this.state.tracks;
        //
        // UIStore.setPlayingAlbum(this.props.artist, this.props.album, this.state.tracks, index);
        //
        // for (var i = 0; i < tracks.length; i++) {
        //     tracks[i].playing = false;
        // }
        // tracks[index].playing = true;
        //
        // this.setState ({
        //     tracks: tracks
        // });
    }

    render() {

        const { artists, artistKey, albumKey } = this.props;
        let artist = artists[artistKey];
        let currentAlbum = artists[artistKey].albums[albumKey];

        const { name, image, tracks, about, timestamp, label } = currentAlbum;

        const formattedTimeStamp = Moment(timestamp).format('MM/DD/YYYY');

        return (
            <div className="album scroll">
                <div className="rel album_background_group">
                    <div className="fullbleed flex album_background" style={{ backgroundImage: 'url(' + image + ')' }}></div>
                    <div className="fullbleed flex left bottom ">
                        <div className="album_artist_group flex left middle">
                            <ArtistImage classes="circle artist_image flex shrink" src={ artist.img } />
                            <div className="flex vertical left middle artist_album_name">
                                <div className="album_name flex middle">{ name }</div>
                                <div className="artist_name flex middle">By { artist.name }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tracklist p1">
                    { tracks.map((track, index) =>
                    <div className="flex middle left track" key={ index } onClick={ this.playTrack.bind(this, index) }>
                        <div className="track_number flex center middle circle shrink">{ index + 1 }</div>
                        <div className="flex track_title">{ track.title }</div>
                    </div>
                    )}
                </div>
                {label && label.name && [
                <div className="sub_header" key="0">Label</div>,
                <a href={label.link} target="_blank" className="text_group" key="1">{ label.name }</a>
                ]}

                { formattedTimeStamp && [
                <div className="sub_header" key="0">Released</div>,
                <div className="text_group" key="1">{ formattedTimeStamp }</div>
                ]}

                { about && [
                <div className="sub_header" key="0">Album Info</div>,
                <div className="text_group" key="1">{ about }</div>
                ]}



            </div>
        )
    }
}

// {track.playing && <ReactAudioPlayer src={track.file} autoPlay="true" onEnded={this.trackEnded.bind(this, index)}/>}
