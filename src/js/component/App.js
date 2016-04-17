import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import Tray from './fragment/Tray';
import Files from './fragment/Files';
import Search from './fragment/Search';
import Settings from './fragment/Settings';
import FragmentController from './fragment/FragmentController';
import PrimarySidebar, { PrimarySidebarItem } from './partial/PrimarySidebar';
import WindowControls from './partial/electron/WindowControls';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isMaximized: false,
            currentPage: Files.displayName,
        };
    }

    handleMaximize (isMaximized) {
        this.setState({ isMaximized });
    }

    handlePrimarySidebarItemClick (id) {
        this.setState({ currentPage: id });
    }

    render () {
        const { isMaximized, currentPage } = this.state;
        const className = cx({ 'app-maximized': isMaximized })
        return (<div id="app" className={ className }>
                    <WindowControls
                        maximized={ isMaximized }
                        onMaximizeListener={ this.handleMaximize.bind(this, true) }
                        onUnmaximizeListener={ this.handleMaximize.bind(this, false) } />
                    <PrimarySidebar activeId={ Files.displayName } onItemClickListener={ this.handlePrimarySidebarItemClick.bind(this) }>
                        <PrimarySidebarItem id={ Files.displayName } name="Files" icon="insert_drive_file" />
                        <PrimarySidebarItem id={ Search.displayName } name="Search" icon="search" />
                        <PrimarySidebarItem id={ Settings.displayName } name="Settings" icon="settings" />
                    </PrimarySidebar>
                    <FragmentController current={ currentPage }>
                        <Files />
                        <Search />
                        <Settings />
                    </FragmentController>
                    <Tray />
                </div>);
    }
}

export default App;