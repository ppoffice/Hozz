import React, { Component, PropTypes } from 'react';

import event from '../backend/event';
import { EVENT } from '../constants';

const appContainer = document.getElementById('app');

class Titlebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMaximized: false,
        };
    }

    __onWindowMaximize () {
        this.setState({ isMaximized: true });
        appContainer.classList.add('maximized');
    }

    __onWindowUnmaximize () {
        this.setState({ isMaximized: false });
        appContainer.classList.remove('maximized');
    }

    componentDidMount () {
        event.on(EVENT.WINDOW_MAXIMIZED, this.__onWindowMaximize.bind(this));
        event.on(EVENT.WINDOW_UNMAXIMIZED, this.__onWindowUnmaximize.bind(this));
    }

    componentWillUnmount () {
        event.off(EVENT.WINDOW_MAXIMIZED, this.__onWindowMaximize.bind(this));
        event.off(EVENT.WINDOW_UNMAXIMIZED, this.__onWindowUnmaximize.bind(this));
    }

    render() {
        const { isMaximized } = this.state;
        const { disableHide, disableMaximize } = this.props;
        let maximizeButton = null;
        if (!disableMaximize) {
            maximizeButton = isMaximized ?
                <i className="iconfont maximize" onClick={ event.emit.bind(null, EVENT.MAXIMIZE_WINDOW) }>&#xe609;</i> :
                <i className="iconfont maximize" onClick={ event.emit.bind(null, EVENT.MAXIMIZE_WINDOW) }>&#xe606;</i>
        }
        return (<div className="titlebar">
                    <div className="titlebar-title">
                        { this.props.title }
                    </div>
                    <div className="window-controls">
                        <i className="iconfont minimize" onClick={ event.emit.bind(null, EVENT.MINIMIZE_WINDOW) }>&#xe607;</i>
                        { maximizeButton }
                        { disableHide ?
                            <i className="iconfont close"    onClick={ event.emit.bind(null, EVENT.CLOSE_WINDOW) }>&#xe602;</i> :
                            <i className="iconfont close"    onClick={ event.emit.bind(null, EVENT.HIDE_WINDOW) }>&#xe602;</i> }
                    </div>
                </div>);
    }
}

Titlebar.propTypes = {
    title: PropTypes.string,
    disableHide: PropTypes.bool,
    disableMaximize: PropTypes.bool,
};

export default Titlebar;
