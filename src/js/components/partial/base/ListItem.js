import React, { Component, PropTypes } from 'react';

class ListItem extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, children, onClickListener } = this.props;
        return (<li className="app-list-item" onClick={ onClickListener ? onClickListener.bind(null, id) : null }>
                    { children }
                </li>);
    }
}

ListItem.propTypes = {
    id: PropTypes.any.isRequired,
    onClickListener: PropTypes.func,
};

export default ListItem;