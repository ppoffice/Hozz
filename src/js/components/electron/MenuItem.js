import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { checkListener } from '../../utils/Utils';
import Electron from '../../services/ElectronService';

class MenuItem extends Component {
    constructor (props) {
        super(props);
    }

    _render () {
        const { id, type, label, checked, children, onClickListener, onSubMenuItemClickListener } = this.props;
        let options = { id, type, label, checked };
        options = Object.assign(options, { click: checkListener(onClickListener).bind(this, id) });
        if (React.Children.count(children) === 1) {
            const child = React.cloneElement(React.Children.only(children), { onItemClickListener: checkListener(onSubMenuItemClickListener) });
            const container = document.createElement('div');
            options = Object.assign(options, { submenu: ReactDOM.render(child, container)._render() });
        }
        return new Electron.MenuItem(options);
    }

    render () {
        return null;
    }
}

MenuItem.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    onClickListener: PropTypes.func,
    onSubMenuItemClickListener: PropTypes.func,
};

export default MenuItem;