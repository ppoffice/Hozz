import React, { Component, PropTypes } from 'react';

import PrimarySidebar, { PrimarySidebarItem } from './partial/PrimarySidebar';
import PageController from './page/PageController';
import Files from './page/Files';
import Search from './page/Search';
import Settings from './page/Settings';

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
                    <PrimarySidebar onItemClickListener={ this.handlePrimarySidebarItemClick.bind(this) }>
                        <PrimarySidebarItem id={ Files.displayName } name="Files" icon="file" />
                        <PrimarySidebarItem id={ Search.displayName } name="Search" icon="search" />
                        <PrimarySidebarItem id={ Settings.displayName } name="Settings" icon="settings" />
                    </PrimarySidebar>
                    <PageController current={ currentPage }>
                        <Files />
                        <Search />
                        <Settings />
                    </PageController>
                </div>);
    }
}

export default App;