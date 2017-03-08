import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Electron from '../../services/ElectronService';

let __tray__;

class Tray extends Component {
    constructor (props) {
        super(props);
    }

    _render () {
        const { icon, toolTip, children, onClickListener } = this.props;
        if (!__tray__)
            __tray__ = new Electron.Tray(icon);
        if (toolTip)
            __tray__.setToolTip(toolTip);
        if (onClickListener)
            __tray__.on('click', onClickListener);
        if (React.Children.count(children) === 1) {
            const child = React.Children.only(children);
            const container = document.createElement('div');
            __tray__.setContextMenu(ReactDOM.render(child, container)._render());
        }
    }

    componentDidMount () {
        this._render();
    }

    componentDidUpdate () {
        this._render();
    }

    render () {
        return null;
    }
}

Tray.propTypes = {
    icon: PropTypes.string.isRequired,
    toolTip: PropTypes.string,
    onClickListener: PropTypes.func,
};

export default Tray;