import React, { Component } from 'react';
import { observer } from "mobx-react";
import { toJS } from "mobx";
import ArtistImage from './ArtistImage.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as firebase from 'firebase';

@observer
export default class Artists extends Component {

    constructor(){
        super();
    }

    render() {

        // full artists object is passed in
        const { artists } = this.props;

        // grab  ViewChange from UIstore
        const { viewChange } = this.props.store;

        const renderArtists =  Object.keys(artists).map((artistKey, index) => {

            const artist = artists[artistKey];
            const albumCount = artist.albums && Object.keys(artist.albums).length || 0;

            return (
                <div
                    className="flex artist_list_item"
                    key={ index }
                    onClick={viewChange.bind(this, artistKey, undefined)} >
                    <div className="artist_list_item_inner flex vertical center middle">
                        <ArtistImage count={ albumCount } classes="circle artist_image flex shrink" src={artist.img} />

                        <div className="flex vertical center middle artist_name_group">
                            <div>{artist.name}</div>
                            <div className="location">
                                {artist.location}
                                {!artist.location && <span>-</span>}
                            </div>
                        </div>
                    </div>

                </div>
            )
        });

        return (
            <div className="artist_collection flex scroll wrap" >
                {renderArtists}
            </div>
        )
    }
}
