import React, { Component, PropTypes } from 'react';

import Lang from '../backend/language';

class HostsInfoDialog extends Component {
    constructor(props) {
        super(props);
        const { url, name } = props;
        this.state = {
            url,
            name,
        };
    }

    __onNameChange (e) {
        const { onInputChange } = this.props;
        this.setState({ name: e.target.value });
        onInputChange && onInputChange(e.target.value, this.state.url);
    }

    __onUrlChange (e) {
        const { onInputChange } = this.props;
        this.setState({ url: e.target.value });
        onInputChange && onInputChange(this.state.name, e.target.value);
    }

    render() {
        const { name, url, onDismiss } = this.props;
        return (<div className="popover new-hosts-dialog">
                    <div className="popover-content">
                        <div className="dialog-title">
                            <span>{
                                !name ?
                                Lang.get('main.create_new_hosts') :
                                Lang.get('main.edit_hosts') }</span>
                            <i className="iconfont close" onClick={ onDismiss }>&#xe602;</i>
                        </div>
                        <div className="vertical-inputs">
                            <input
                                type="text"
                                defaultValue={ name }
                                placeholder={ Lang.get('common.name') }
                                onChange={ this.__onNameChange.bind(this) } />
                            <input
                                type="text"
                                defaultValue={ url }
                                onChange={ this.__onUrlChange.bind(this) }
                                placeholder={ Lang.get('main.remote_source_url') } />
                        </div>
                    </div>
                    <div className="popover-arrow"></div>
                </div>);
    }
}

HostsInfoDialog.propTypes = {
    url: PropTypes.string,
    name: PropTypes.string,
    onDismiss: PropTypes.func,
    onInputChange: PropTypes.func,
}

export default HostsInfoDialog;
