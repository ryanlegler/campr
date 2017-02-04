import React, { Component } from 'react';
import Axios from 'axios';
import Nav from '../components/Nav.jsx';
import * as firebase from 'firebase';
import UIStore from '.././stores/UIStore.js';
import classNames from 'classnames';
import { observer } from "mobx-react";
import { toJS } from "mobx";
import ArtistImage from '../components/ArtistImage.jsx';
import Icon from '../components/Icon.jsx';

@observer
export default class SearchResults extends Component {

    constructor(){
        super();
    }

    keyPress(e) {
        if (e.which === 13) {
            this.search(e.target.value);
        }
    }

    isInCollection(artist) {
        for (var key in this.props.artists) {
            if (artist.id === this.props.artists[key].id) {
                return true;
            }
        }
        return false;
    }

    isInCollectionFromAlbum(album) {
        // var index = album.albumLink.match(/\b(bandcamp)\b/i).index;
        // console.log("index",index);
        //var artistKey = album.albumLink.replace("https://", "").replace(".bandcamp.com", "")
    }
    viewArtist(artist) {
        var artistKey = artist.url.replace("https://", "").replace(".bandcamp.com", "")
        UIStore.viewChange(artistKey, undefined);
        UIStore.toggleSearching();
    }

    render() {

        const { searchResults, viewChange, addArtist, searchType } = UIStore;

        if(searchResults.length && searchType === 'artists'){
            var filteredResults = toJS(searchResults).filter(function(item) {
                return item.type === "b";
            });
        } else {
            var filteredResults = searchResults
        }
        // item.type === "a" -- albums

        console.log("filteredResults",toJS(filteredResults));
        return (
            <div className="flex vertical p2 top search_results_inner_container">

                { searchType === 'artists' && filteredResults.map((artist, index) =>
                <div className="search_result flex w100" key={ index }>
                    {this.isInCollection(artist) &&
                        <div className="added_icon flex center middle shrink icon_filled" >
                            <Icon classes={classNames('circle mr1', { 'icon_container--active': this.isInCollection(artist) })} value="check"/>
                        </div>
                    }

                    <ArtistImage classes="mr1 circle artist_image flex shrink" src={ artist.img || artist.albumArt } />
                    <div className="flex vertical left middle search_result_names">
                        <div className="artist_name ellipsis">{ artist.name }{ artist.band_name }{artist.artist}</div>
                    </div>

                    { !this.isInCollection(artist) &&
                    <div className="flex shrink center middle" onClick={ addArtist.bind(this, artist) } key={ index }>
                        <div className="button--outline">ADD</div>
                    </div>
                    }

                    { this.isInCollection(artist) &&
                    <div className="flex shrink center middle" onClick={ this.viewArtist.bind(this, artist) } key={ index }>
                        <div className="button--outline">VIEW</div>
                    </div>
                    }
                </div>
                )}


                { searchType === 'tags' && filteredResults.map((album, index) =>
                <div className="search_result flex w100" key={ index }>


                    <ArtistImage classes="mr1 artist_image flex shrink" src={ album.albumArt } />
                    <div className="flex vertical left middle search_result_names">
                        <div className="artist_name ellipsis">{ album.artist }</div>
                        <div className="artist_name artist_name--secondary ellipsis">By: { album.title }</div>
                    </div>

                    { !this.isInCollectionFromAlbum(album) &&
                    <div className="flex shrink center middle" onClick={ addArtist.bind(this, artist) } key={ index }>
                        <div className="button--outline">SEARCH</div>
                    </div>
                    }

                </div>
                )}
            </div>
        )
    }
}
