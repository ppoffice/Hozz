import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';

import codemirrorOptions from '../codemirror.config.js';
import { APP_NAME, TOTAL_HOSTS_UID } from '../constants';

import Titlebar from './Titlebar';
import SnackBar from './SnackBar';

class MainContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: null,
            snack: null,
        };
    }

    componentWillReceiveProps (nextProps) {
        const { currentActiveHosts } = nextProps;
        if (currentActiveHosts) {
            this.setState({ text: currentActiveHosts.text });
        } else {
            this.setState({ text: null });
        }
    }

    __updateHosts (nextHostsText) {
        this.setState({ text: nextHostsText });
    }

    __onEditorFocusChange (focused) {
        if (!focused) {
            const { text } = this.state;
            const { onHostsTextChange } = this.props;
            onHostsTextChange && onHostsTextChange(text);
        }
    }

    render() {
        const { text } = this.state;
        const { currentActiveHosts, snack, onSnackDismiss } = this.props;
        let cmOptions = codemirrorOptions;
        let title = APP_NAME;
        if (currentActiveHosts) {
            title = currentActiveHosts.name;
        }
        if (currentActiveHosts && (TOTAL_HOSTS_UID === currentActiveHosts.uid || currentActiveHosts.url)) {
            cmOptions = Object.assign({}, cmOptions, { readOnly: true });
        } else {
            cmOptions = Object.assign({}, cmOptions, { readOnly: false });
        }
        return (<div className="main-container">
                    <Titlebar title={ title } />
                    { text !== null ?
                        <CodeMirror
                            value={ text }
                            ref="codemirror"
                            options={ cmOptions }
                            onChange={ this.__updateHosts.bind(this) }
                            onFocusChange={ this.__onEditorFocusChange.bind(this) } /> :
                        null }
                    { snack !== null ?
                        <SnackBar
                            type={ snack.type }
                            text={ snack.text }
                            actions={ snack.actions }
                            onDismiss={ onSnackDismiss } /> :
                        null }
                </div>);
    }
}

MainContainer.propTypes = {
    snack: PropTypes.object,
    currentActiveHosts: PropTypes.object,
    onSnackDismiss: PropTypes.func,
    onHostsTextChange: PropTypes.func,
}

export default MainContainer;
