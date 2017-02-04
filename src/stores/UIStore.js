import { computed, observable, action, toJS } from "mobx"
import Axios from 'axios';
import * as firebase from 'firebase';

export class UIStore {

    // setup the seach results observable
    @observable searchResults = []

    @action
    setSearchResults(results) {
        this.searchResults = results;
    }
    @action
    clearSearchResults() {
        this.searchResults = [];
    }
    @observable searchingActive = false;

    @action
    toggleSearching() {
        this.searchingActive = !this.searchingActive;
    }

    @observable searchType = 'artists';

    @action
    setSearchType(type) {
        this.searchType = type;
    }

    @observable viewing = [{
        artist: undefined,
        album: undefined
    }]

    // add new view object to the viewing array
    @action
    viewChange = (artist, album) => {
        this.viewing.push({
            artist: artist,
            album: album
        })
        console.log("this.viewing",toJS(this.viewing));
    }

    // slice last view object off the array
    @action
    previousView = () => {
        this.viewing.splice(this.viewing.length-1, this.viewing.length)
    }

    // return the last object of the array
    @computed get currentView() {
        var current = this.viewing.slice(this.viewing.length-1, this.viewing.length);
        return current[0];
    }

    @observable playingArtist = "";
    @observable playingAlbum = "";
    @observable playingTracks = [];
    @observable playingOffset = null;

    @action
    setPlayingAlbum = (artist, album, tracks, index) => {
        this.playingTracks = tracks.slice();
        this.playingArtist = artist;
        this.playingAlbum = album;
        this.playingOffset = index;
    }
    @action
    setPlayingOffset = (offset) => {
        this.playingOffset = offset;
    }

    // this should be in a service or something
    addArtist (artistObject) {
        var artist = artistObject.url.replace("https://", "").replace(".bandcamp.com", "")
        var url = `https://campr-api.herokuapp.com/artist/${artist}`;
        Axios(url)
            .then((response) => {

                var filteredAlbums = response.data.albums.filter(function(item) {
                    return item.fullUrl.indexOf('/track/') === -1;
                });
                console.log("filteredAlbums",filteredAlbums)
                if (filteredAlbums) {

                    var filteredAlbumsMap = filteredAlbums.reduce(function(map, obj) {
                        map[obj.slug] = {
                            image: obj.image,
                            name: obj.name,
                            fullUrl: obj.fullUrl,
                            slug: obj.slug
                        };
                        return map;
                    }, {});

                    // console.log("filteredAlbumsMap",filteredAlbumsMap)
                    var newArtist = {
                        name: artistObject.name || '',
                        location: response.data.location || '',
                        info: response.data.info || '',
                        url: artistObject.url || '',
                        img: artistObject.img || '',
                        artistid: artistObject.art_id || '',
                        id: artistObject.id || '',
                        key: artist,
                        albums: filteredAlbumsMap
                    }
                    console.log("newArtist",newArtist);
                    console.log("artist",artist)
                    firebase.database().ref().child('artists/' + artist).set({
                        ...newArtist
                    })

                    let urlArray = [];
                    for (var key in filteredAlbumsMap) {
                        urlArray.push (
                            {
                                name: key,
                                url: `https://campr-api.herokuapp.com/artist/${artist}/album/${key}/tracks`
                            }
                        )
                    }

                    //let promiseArray = urlArray.map(url => Axios.get(url)); // or whatever
                    // Axios.all(promiseArray)
                    // .then(function(results) {
                    //   console.log("results",results)
                    // });

                    var promises = urlArray.map((item, offset) => {
                        return new Promise((resolve2) => {
                           setTimeout(() => {
                               Axios(item.url)
                                   .then((response) => {

                                       if (response.data){
                                           var album = {
                                               name: item.name,
                                               tracks: response.data
                                           }
                                       } else {
                                           var album = {}
                                       }
                                       console.log("resolve album",album)

                                       resolve2(album);
                                   })
                                   .catch((error) => {
                                       console.log(error);
                                   });
                          }, 1000 * offset);
                        });
                    });

                    Promise.all(promises).then((results) => {
                        console.log("all are done", results)

                        for (var i = 0; i < results.length; i++) {
                            filteredAlbumsMap[results[i].name].tracks = results[i].tracks
                        }

                        firebase.database().ref().child('artists/' + artist).update({
                            albums: filteredAlbumsMap
                        })

                    }, () => {
                        console.log("error")
                    });

                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

}

export default new UIStore
