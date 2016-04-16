import React, { Component, PropTypes } from 'react';

import { checkListener } from '../base/Utils';
import Electron from '../../../service/ElectronService';

let __window__;

class WindowHandler extends Component {
    constructor (props) {
        super(props);
        __window__ = Electron.remote.getCurrentWindow();
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
        const { focused } = this.props;
        if (focused)
            Electron.focusCurrentWindow();
        return null;
    }
}

WindowHandler.propTypes = {
    focused: PropTypes.bool,
    onMaximizeListener: PropTypes.func,
    onUnmaximizeListener: PropTypes.func,
}

export default WindowHandler;