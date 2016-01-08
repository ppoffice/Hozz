import React, { Component, PropTypes } from 'react';

import Lang from '../backend/language';

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    __onInputChange (e) {
        const { onTextChange } = this.props;
        this.setState({ text: e.target.value });
        onTextChange && onTextChange(e.target.value);
    }

    __onClearClick () {
        const { onTextChange } = this.props;
        this.setState({ text: '' });
        onTextChange && onTextChange('');
    }

    render() {
        let __cxArray = ['searchbox'];
        const { text } = this.state;
        const { className } = this.props;
        if (className) {
            __cxArray = __cxArray.concat(...className.split(' '));
        }
        return (<div className={ __cxArray.join(' ') }>
                    <i className="iconfont search">&#xe601;</i>
                    <input
                        type="text"
                        value={ text }
                        onChange={ this.__onInputChange.bind(this) }
                        placeholder={ Lang.get('common.search') } />
                    { text ? <i className="iconfont clear"
                                onClick={ this.__onClearClick.bind(this) }>&#xe608;</i> : null }
                </div>);
    }
}

SearchBox.propTypes = {
    className: PropTypes.string,
    onTextChange: PropTypes.func,
}

export default SearchBox;
