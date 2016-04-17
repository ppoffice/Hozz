import React, { Component, PropTypes } from 'react';

import Editor from '../partial/Editor';
import MainContent from '../partial/MainContent';
import FileSidebar, { FileSidebarItem, FileSidebarGroup } from '../partial/FileSidebar';

class Files extends Component {
    static displayName = "Files";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-fragment" id="app-fragment-files">
                    <FileSidebar
                        onItemClickListener={ id => console.log(id) }
                        onItemEditClickListener={ id => console.log('edit', id) }
                        onItemStatusChangeListener={ id => console.log('status', id) }>
                        <FileSidebarItem id="file1" name="file1" />
                        <FileSidebarGroup id="group1" name="Group1">
                            <FileSidebarItem id="file2" name="file2" />
                        </FileSidebarGroup>
                        <FileSidebarGroup id="group2" name="Group2">
                            <FileSidebarItem id="file3" name="file3" />
                            <FileSidebarItem id="file4" name="file4" />
                        </FileSidebarGroup>
                    </FileSidebar>
                    <MainContent>
                        <Editor></Editor>
                    </MainContent>
                </div>);
    }
}

export default Files;