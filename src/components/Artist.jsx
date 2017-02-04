import React, { Component } from 'react';
import Axios from 'axios';
import { observer } from "mobx-react";
import { toJS } from "mobx";
import * as firebase from 'firebase';
import ArtistImage from './ArtistImage.jsx';
import classNames from 'classnames';
import Icon from '../components/Icon.jsx';
import MDSpinner from 'react-md-spinner';
import UIStore from '.././stores/UIStore.js';

@observer
export default class Artist extends Component {

    constructor(props){
        super();
        this.state = {
            showAlbums: true,
            searching: undefined,
            relatedArtists: undefined
        }
    }
    componentDidMount() {

        setTimeout( () => {
            this.setState ({
                showAlbums: true
            })
        }, 100);

        const { artistKey, artists } = this.props;
        const artist = artists[artistKey];

        if (!artist.lastfm) {
            console.log("NO last.fm")
            var url = `https://campr-api.herokuapp.com/lastfm/artistinfo/${artist.name}`;
            Axios(url)
                .then((response) => {
                    const data = response.data.artist;
                    const lastfm = {
                        image: data.image && data.image[5] && data.image[5]['#text'] || '',
                        url: data.url || '',
                        mbid: data.mbid || '',
                        tags: data.tags.tag || '',
                        stats: data.stats || '',
                        name: data.name || '',
                        bio: data.bio.content || ''
                    }
                    firebase.database().ref().child('artists/' + artistKey).update({
                        lastfm: lastfm
                    })
                })
        } else {
            console.log("HAS last.fm")
        }

        if (!artist.lastfmRelated) {
        console.log("No related - fetching related")
        var url = `https://campr-api.herokuapp.com/lastfm/related/${artist.name}`;
        Axios(url)
            .then((response) => {

                const rawRelated = response.data.similarartists.artist;

                console.log("rawRelated",rawRelated);

                var related = rawRelated.map(function(relatedItem, index) {
                    var item = {};
                    item.name = relatedItem.name || '';
                    item.mbid = relatedItem.mbid || '';
                    item.url = relatedItem.url || '';
                    item.image = relatedItem.image && relatedItem.image[5] && relatedItem.image[5]['#text'] || '';
                    return item;
                });

                firebase.database().ref().child('artists/' + artistKey).update({
                    lastfmRelated: related
                })
            })
        } else {
            console.log("has related")
        }

    }

    render() {

        const { artistKey, artists } = this.props;
        let artist = artists[artistKey];

        const albums = artist && artist.albums || {};
        const { viewChange } = this.props.store;
        const { searching } = this.state;

        const related = artist && artist.lastfmRelated || undefined;

        const alternateInfo = (this.state.alternateInfo && this.state.alternateInfo.artist.bio && this.state.alternateInfo.artist.bio.content) || undefined;
        const tags = artist && artist.lastfm.tags || undefined;

        return (
            <div className="rel scroll artist" ref={(ref) => this._div = ref}>
                <div className="rel artist_background_group">
                    { artist && [
                    <div key="1" className="fullbleed flex artist_background" style={{backgroundImage: 'url(' + artist.img + ')'}}></div>,
                    <div key="2" className="fullbleed vertical flex center middle ">
                        <ArtistImage
                            count={ Object.keys(artist.albums).length || 0 }
                            classes="circle artist_image flex shrink"
                            src={artist.img}
                        />
                        <div className="artist_name">{artist.name}</div>
                        <div className="album_count">
                            {artist.location}
                            {!artist.location && <span>-</span>}
                        </div>
                    </div>
                    ]}
                </div>
                <div className="remove_container" onClick={this.removeArtist.bind(this, artistKey)}>
                    <Icon classes={classNames('remove circle mr1', {})} value="check"/>
                </div>

                <div className="sub_header">Albums</div>
                { !albums &&
                <div className="spinner_container flex center middle ">
                    <MDSpinner singleColor="#163d43" size="35" />
                </div>
                }

                <div className="albums_container flex wrap">
                    { Object.keys(albums).map((key, index) =>

                    <div
                        className={classNames('album flex', { 'state-active':this.state.showAlbums })}
                        key={ index }
                        onClick={ viewChange.bind(this, artistKey, key) }>
                        <div className="inner flex vertical center middle">
                            <ArtistImage
                                classes="artist_image flex shrink"
                                src={ albums[key].image }
                            />
                            <div className="album_name ellipsis" >{ albums[key].name }</div>
                        </div>
                    </div>
                    )}
                </div>


                { artist && [
                <div className="sub_header" key="0">bio</div>,
                <div className="text_group" key="1">{ artist.info }</div>
                ]}

                { !artist && alternateInfo &&
                <div className="sub_header">bio</div>}
                { alternateInfo &&
                <div className="text_group">{ alternateInfo }</div>
                }

                { tags && [
                <div className="sub_header" key="0">tags</div>,
                <div className="tag_group" key="1">
                    { tags.map((tag, index) =>
                    <div
                        className="tag"
                        key={ index }>
                        {tag.name}
                    </div>
                    )}
                </div>]}

                { related && [
                <div className="sub_header" key="0">Realted Artists</div>,
                <div className="related flex vertical p1" key="1">
                    { related.map((artist, index) =>
                    <div
                        className="flex"
                        onClick={ this.searchForArtist.bind(this, artist, index) }
                        key={ index }
                    >
                        <ArtistImage classes="mr1 circle artist_image flex shrink" src={ artist.image }  />
                        <div className="search_result_names flex middle between">
                            <div className="artist_name ellipsis">{ artist.name }</div>
                            { searching !== index &&
                            <Icon value="chevron-right" className="button--outline" />
                            }
                            { searching === index &&
                            <MDSpinner singleColor="#163d43" size="35" />
                            }
                        </div>
                    </div>
                    )}
                </div>
                ]}
                <div className="flex center middle p2">
                    <a className="button--outline" href={artist.url}>{ artist.url }</a>
                    <div className="button--outline mrl1">
                        <Icon value="cog" className="button--outline" onClick={this.refreshArtist.bind(this, artist)} />
                    </div>
                </div>
            </div>
        )
    }


    removeArtist(artist) {
        this.props.store.previousView();
        var artistsRef = firebase.database().ref().child('artists/' + artist);
        artistsRef.remove()
          .then(function() {
              console.log("Remove succeeded.")

          })
          .catch(function(error) {
              console.log("Remove failed: " + error.message)
          });
    }

    getTags() {
        return (
            this.state.alternateInfo.artist.tags.tag.map((tag, index) =>
                <div key={ index }>
                    {tag.name}
                </div>
            )
        )
    }

    refreshArtist(artist) {

        var artistsRef = firebase.database().ref().child('artists/' + artistKey);
        artistsRef.remove()
          .then(function() {
              UIStore.addArtist(artist)
          })
          .catch(function(error) {
              console.log("Remove failed: " + error.message)
          });

    }
    searchForArtist(artistSlug, index) {
        this.setState ({
            searching: index
        })
        var url = 'https://campr-api.herokuapp.com/search/' + artistSlug.name;
        Axios(url)
            .then((response) => {

                if (response && response.data) {
                    var results = response.data.auto.results.filter(function(item) {
                        return item.type === "b";
                    });
                    setTimeout(() => {
                        setTimeout(() => {
                            this.setState ({
                                searching: null
                            })
                        }, 300);
                        UIStore.setSearchResults(results);
                        UIStore.toggleSearching();
                    }, 300);

                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }
}
