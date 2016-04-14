import React, { Component, PropTypes } from 'react';

import FileSidebar, { FileSidebarItem, FileSidebarGroup } from '../partial/FileSidebar';

class Files extends Component {
    static displayName = "Files";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div id="app-page-files">
                    <FileSidebar onItemClickListener={ id => console.log(id) }>
                        <FileSidebarItem id="file1" name="file1" />
                        <FileSidebarGroup id="group1"  name="group1">
                            <FileSidebarItem id="file2"  name="file2" />
                        </FileSidebarGroup>
                        <FileSidebarGroup id="group2"  name="group2">
                            <FileSidebarItem id="file3"  name="file3" />
                            <FileSidebarItem id="file4"  name="file4" />
                        </FileSidebarGroup>
                    </FileSidebar>
                </div>);
    }
}

export default Files;