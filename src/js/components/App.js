import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import TabBar, { TabBarItem } from './TabBar';
import FilesFragment from './FilesFragment';
import SearchFragment from './SearchFragment';
import SettingsFragment from './SettingsFragment';
import FragmentController from './FragmentController';

import ApplicationTray from './ApplicationTray';
import WindowControls from './electron/WindowControls';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isMaximized: false,
            currentPage: FilesFragment.displayName,
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
            <TabBar activeId={ FilesFragment.displayName } onItemClickListener={ this.handlePrimarySidebarItemClick.bind(this) }>
                <TabBarItem id={ FilesFragment.displayName } name="Files" icon="insert_drive_file" />
                <TabBarItem id={ SearchFragment.displayName } name="Search" icon="search" />
                <TabBarItem id={ SettingsFragment.displayName } name="Settings" icon="settings" />
            </TabBar>
            <FragmentController current={ currentPage }>
                <FilesFragment />
                <SearchFragment />
                <SettingsFragment />
            </FragmentController>
            <WindowControls
                maximized={ isMaximized }
                onMaximizeListener={ this.handleMaximize.bind(this, true) }
                onUnmaximizeListener={ this.handleMaximize.bind(this, false) } />
            <ApplicationTray />
        </div>);
    }
}

export default App;