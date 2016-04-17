import React, { Component, PropTypes } from 'react';

import SearchBox from '../partial/SearchBox';

class Search extends Component {
    static displayName = "Search";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-fragment" id="app-fragment-search">
                    <SearchBox onInputChangeListener={ text => console.log(text) } />
                </div>);
    }
}

export default Search;