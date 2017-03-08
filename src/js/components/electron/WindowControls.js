import React, { Component, PropTypes } from 'react';

import { checkListener } from '../../utils/Utils';
import Electron from '../../services/ElectronService';

let __window__;

class WindowControls extends Component {
    constructor (props) {
        super(props);
        __window__ = Electron.remote.getCurrentWindow();
    }

    handleControlClick (type) {
        switch (type) {
            case 'close':
                __window__.close(); break;
            case 'restore':
                __window__.unmaximize(); break;
            case 'minimize':
                __window__.minimize(); break;
            case 'maximize':
                __window__.maximize(); break;
        }
    }

    componentDidMount () {
        const { onMaximizeListener, onUnmaximizeListener } = this.props;
        __window__.addListener('maximize', checkListener(onMaximizeListener));
        __window__.addListener('unmaximize', checkListener(onUnmaximizeListener));
    }

    componentWillUnmount () {
        const { onMaximizeListener, onUnmaximizeListener } = this.props;
        __window__.removeAllListeners();
    }

    render () {
        const { maximized } = this.props;
        return (<div className="app-window-controls">
                    <i className="iconfont icon-minimize" onClick={ this.handleControlClick.bind(this, 'minimize') }/>
                    { maximized ?
                        <i className="iconfont icon-restore" onClick={ this.handleControlClick.bind(this, 'restore') }/> :
                        <i className="iconfont icon-maximize" onClick={ this.handleControlClick.bind(this, 'maximize') }/> }
                    <i className="iconfont icon-close" onClick={ this.handleControlClick.bind(this, 'close') }/>
                </div>);
    }
}

WindowControls.propTypes = {
    maximized: PropTypes.bool,
    onMaximizeListener: PropTypes.func,
    onUnmaximizeListener: PropTypes.func,
};

export default WindowControls;