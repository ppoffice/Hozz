import React, { Component, PropTypes } from 'react';

class List extends Component {
    constructor (props) {
        super(props);
        this.state = {
            activeId: props.activeId,
        };
    }

    handleItemClick (id) {
        this.setState({ activeId: id });
        this.props.onItemClickListener && this.props.onItemClickListener(id);
    }

    render () {
        const { activeId } = this.state;
        const { id, children } = this.props;
        return (<ul className="app-list">
                    { React.Children.map(children, child => {
                        return React.cloneElement(child, {
                            active: activeId === child.props.id,
                            onClickListener: this.handleItemClick.bind(this),
                        });
                    }) }
                </ul>);
    }
}

List.propTypes = {
    onItemClickListener: PropTypes.func,
};

export default List;