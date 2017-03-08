import React, { Component, PropTypes } from 'react';

class FragmentController extends Component {
    constructor (props) {
        super(props);
    }

    shouldComponentUpdate (nextProps, nextState) {
        return this.props.current !== nextProps.current;
    }

    render () {
        const { current, children } = this.props;
        return (<div className="app-fragments">
                    { this.props.children.filter(child => current === child.type.displayName) }
                </div>);
    }
}

FragmentController.propTypes = {
    current: PropTypes.string.isRequired,
};

export default FragmentController;