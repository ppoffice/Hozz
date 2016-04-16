import React, { Component, PropTypes } from 'react';
import { checkListener } from './Utils';

class ListItem extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, children, onClickListener } = this.props;
        return (<li className="app-list-item" onClick={ checkListener(onClickListener).bind(null, id) }>
                    { children }
                </li>);
    }
}

ListItem.propTypes = {
    id: PropTypes.any.isRequired,
    onClickListener: PropTypes.func,
};

export default ListItem;