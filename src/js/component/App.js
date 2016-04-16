import React, { Component, PropTypes } from 'react';

import Tray from './fragment/Tray';
import Files from './fragment/Files';
import Search from './fragment/Search';
import Settings from './fragment/Settings';
import FragmentController from './fragment/FragmentController';
import PrimarySidebar, { PrimarySidebarItem } from './partial/PrimarySidebar';
import WindowHandler from './partial/electron/WindowHandler';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentPage: Files.displayName,
        };
    }

    handlePrimarySidebarItemClick (id) {
        this.setState({ currentPage: id });
    }

    render () {
        const { currentPage } = this.state;
        return (<div>
                    <WindowHandler onMaximizeListener={ () => { console.log('max') } } />
                    <PrimarySidebar onItemClickListener={ this.handlePrimarySidebarItemClick.bind(this) }>
                        <PrimarySidebarItem id={ Files.displayName } name="Files" icon="file" />
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