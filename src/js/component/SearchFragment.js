import React, { Component, PropTypes } from 'react';

import SearchBox from './SearchBox';

class SearchFragment extends Component {
    static displayName = "SearchFragment";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-fragment" id="app-fragment-search">
                    <div className="app-titlebar app-window-draggable"></div>
                    <SearchBox onInputChangeListener={ text => console.log(text) } />
                </div>);
    }
}

export default SearchFragment;