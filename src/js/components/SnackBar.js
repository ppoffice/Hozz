import React, { Component, PropTypes } from 'react';

class SnackBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { type, text, actions, onDismiss } = this.props;
        const actionButtons = actions ? actions.map((action, index) => {
            return (<span key={ index } onClick={ action.onClick }>{ action.name }</span>)
        }) : null;
        return (<div className={ type ? "snackbar snackbar-" + type : "snackbar" }>
                    <span>{ text }</span>
                    <div className="snackbar-actions">
                        { actionButtons }
                        <span className="iconfont dismiss" onClick={ onDismiss }>&#xe602;</span>
                    </div>
                </div>);
    }
}

SnackBar.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string,
    actions: PropTypes.array,
    onDismiss: PropTypes.func,
}

export default SnackBar;
