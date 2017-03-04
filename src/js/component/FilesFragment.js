import React, { Component, PropTypes } from 'react';

import Editor from './Editor';
import MainContainer from './MainContainer';
import FilesSidebar, { FilesSidebarItem, FilesSidebarGroup } from './FilesSidebar';

import { APP_NAME } from '../config';

class FilesFragment extends Component {
    static displayName = "FilesFragment";

    constructor (props) {
        super(props);
        this.state = {
            title: APP_NAME,
        };
    }

    render () {
        const { title } = this.state;
        return (<div className="app-fragment" id="app-fragment-files">
                    <FilesSidebar
                        onItemClickListener={ id => console.log(id) }
                        onItemEditClickListener={ id => console.log('edit', id) }
                        onItemStatusChangeListener={ id => console.log('status', id) }>
                        <FilesSidebarItem id="file1" name="file1" />
                        <FilesSidebarGroup id="group1" name="Group1" collapsed={ true }>
                            <FilesSidebarItem id="file2" name="file2" />
                        </FilesSidebarGroup>
                        <FilesSidebarGroup id="group2" name="Group2">
                            <FilesSidebarItem id="file3" name="file3" />
                            <FilesSidebarItem id="file4" name="file4" />
                        </FilesSidebarGroup>
                    </FilesSidebar>
                    <MainContainer>
                        <div className="app-titlebar app-window-draggable">{ title }</div>
                        <Editor/>
                    </MainContainer>
                </div>);
    }
}

export default FilesFragment;