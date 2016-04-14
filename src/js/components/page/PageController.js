import React, { Component, PropTypes } from 'react';

class PageController extends Component {
    constructor (props) {
        super(props);
    }

    shouldComponentUpdate (nextProps, nextState) {
        return this.props.current !== nextProps.current;
    }

    render () {
        const { current, children } = this.props;
        return (<div className="app-pages">
                    { this.props.children.filter(child => current === child.type.displayName) }
                </div>);
    }
}

export default PageController;