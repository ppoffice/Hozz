import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { checkListener } from '../../utils/Utils';
import Electron from '../../services/ElectronService';

class Menu extends Component {
    constructor (props) {
        super(props);
    }

    _render () {
        const menu = new Electron.Menu();
        const { children, onItemClickListener } = this.props;
        React.Children.forEach(children, child => {
            const container = document.createElement('div');
            const _child = React.cloneElement(child, {
                onClickListener: checkListener(onItemClickListener),
                onSubMenuItemClickListener: checkListener(onItemClickListener),
            });
            menu.append(ReactDOM.render(_child, container)._render());
        });
        return menu;
    }

    render () {
        return null;
    }
}

Menu.propTypes = {
    onItemClickListener: PropTypes.func,
};

export default Menu;