import React, { Component } from 'react';
import Axios from 'axios';
import { observer } from "mobx-react";
import UIStore from '.././stores/UIStore.js';
import Icon from '.././components/Icon.jsx';
import classNames from 'classnames';

@observer
export default class SearchInput extends Component {

    constructor() {
        super();
        this.state = ({
            searchValue: ''
        })
    }

    toggleSearching() {
        UIStore.clearSearchResults();
        UIStore.toggleSearching();
        this.setState({
            searchValue: ''
        });
    }

    clearResults() {
        UIStore.clearSearchResults();
        this.setState({
            searchValue: ''
        });
    }

    setSearchType(type) {
        UIStore.setSearchType(type) // switch search type in the UI store
        this.search(this.state.searchValue); // force another search when we switch type
    }

    setName(e) {
        this.setState({
            searchValue: e.target.value
        })
        this.search(e.target.value);
    }

    search(query) {
        if (query !== '') {
            if (UIStore.searchType === 'tags') {
                var url = 'https://campr-api.herokuapp.com/albumsByTag/' + query;
                Axios(url)
                    .then((response) => {
                        // console.log("response",response)
                        UIStore.setSearchResults(response.data)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else if (UIStore.searchType === 'artists') {

                var url = 'https://campr-api.herokuapp.com/search/' + query;

                Axios(url)
                    .then((response) => {
                        UIStore.setSearchResults(response.data.auto.results)
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            UIStore.clearSearchResults();
        }

    }

    render() {
        const {searchingActive, currentView, previousView, searchType} = UIStore;

        return (
            <div className="flex vertical">
                <div className="flex between w100">

                    {!searchingActive && currentView.artist &&
                        <div className="flex center middle shrink" onClick={ previousView }>
                            <Icon value="chevron-left"/>
                        </div>
                    }

                    {!searchingActive && !currentView.artist &&
                    <div className="header flex middle">Collection</div>
                    }

                    { searchingActive &&
                    <div className="flex center middle shrink" onClick={this.toggleSearching.bind(this)} >
                        <Icon value="chevron-left"/>
                    </div>
                    }

                    { !searchingActive &&
                    <div className="flex center middle shrink" onClick={this.toggleSearching.bind(this)} >
                        <Icon value="search"/>
                    </div>
                    }

                    { searchingActive && [
                    <div key="a" className={classNames('flex rel',{})} >
                        <input
                            className="search_box w100 flex"
                            type="text"
                            value={ this.state.searchValue }
                            onChange={ this.setName.bind(this) }
                            />

                        <div className="flex center middle search_icon" onClick={this.toggleSearching.bind(this)} >
                            <Icon value="search"/>
                        </div>
                    </div>,

                    <div key="b" className={classNames('clear_search flex center middle shrink pl1',{'active':this.state.searchValue.length > 0})} onClick={ this.clearResults.bind(this) } >
                        <Icon value="x"/>
                    </div>
                    ]}
                </div>

                { searchingActive &&
                <div className="flex center middle shrink">
                    <label>

                        <input
                            type="checkbox"
                            checked={ searchType === 'artists'}
                            onChange={ this.setSearchType.bind(this, 'artists') } />
                        <span>artist</span>
                    </label>

                    <input
                        type="checkbox"
                        checked={ searchType === 'tags'}
                        onChange={ this.setSearchType.bind(this, 'tags') } />
                    <span>tag</span>
                </div>
                }

            </div>
        )
    }
}
