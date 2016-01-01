import React, { Component, PropTypes } from 'react';

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
                            <span>Create New Hosts</span>
                            <i className="iconfont close" onClick={ onDismiss }>&#xe602;</i>
                        </div>
                        <div className="vertical-inputs">
                            <input
                                type="text"
                                placeholder="Name"
                                defaultValue={ name }
                                onChange={ this.__onNameChange.bind(this) } />
                            <input
                                type="text"
                                defaultValue={ url }
                                placeholder="Remote Source Url (Optional)"
                                onChange={ this.__onUrlChange.bind(this) } />
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
