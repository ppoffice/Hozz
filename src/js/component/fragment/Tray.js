const path = require('path') ;
import React, { Component, PropTypes } from 'react';

import Tray from '../partial/electron/Tray';
import Menu from '../partial/electron/Menu';
import MenuItem from '../partial/electron/MenuItem';
import MenuSeparator from '../partial/electron/MenuSeparator';

import { APP_NAME } from '../../config';

const TRAY_ICON_PATH = process.platform === 'darwin' ? './assets/images/tray-osx.png' : './assets/images/icon@16px.png';

export default class _Tray extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (<Tray toolTip={ APP_NAME } icon={ path.join(global.__dirname, TRAY_ICON_PATH) }>
                    <Menu onItemClickListener={ id => console.log("MenuItem: ", id) }>
                        <MenuItem id="dddddd" label="dddddd" type="checkbox" />
                        <MenuItem id="aaaaaa" label="aaaaaa"/>
                        <MenuSeparator />
                        <MenuItem label="submenu">
                            <Menu>
                                <MenuItem id="cccccc" label="cccccc" type="checkbox" checked={ true } />
                                <MenuItem id="bbbbbb" label="bbbbbb" />
                            </Menu>
                        </MenuItem>
                    </Menu>
                </Tray>);
    }
}