import React, { Component, PropTypes } from 'react';

class SearchBox extends Component {
    constructor (props) {
        super(props);
        this.state = {
            value: ''
        };
    }

    handleInputChange (event) {
        this.setState({ value: event.target.value });
        this.props.onInputChangeListener && this.props.onInputChangeListener(event.target.value);
    }

    render () {
        const { value } = this.state;
        return (<div className="app-search-box">
                    <input value={ value } onChange={ this.handleInputChange.bind(this) } />
                    <span className="material-icons">clear</span>
                </div>);
    }
}

SearchBox.propTypes = {
    onInputChangeListener: PropTypes.func,
};

export default SearchBox;