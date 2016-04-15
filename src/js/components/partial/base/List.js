import React, { Component, PropTypes } from 'react';

class List extends Component {
    constructor (props) {
        super(props);
    }

    handleItemClick (id) {
        this.props.onItemClickListener && this.props.onItemClickListener(id);
    }

    render () {
        const { id, children, onItemClickListener } = this.props;
        return (<ul className="app-list">
                    { React.Children.map(children, child => {
                        return React.cloneElement(child, { onClickListener: this.handleItemClick.bind(this) });
                    }) }
                </ul>);
    }
}

List.propTypes = {
    onItemClickListener: PropTypes.func,
};

export default List;