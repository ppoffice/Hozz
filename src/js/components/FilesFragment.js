import React, { Component, PropTypes } from 'react';
import update from 'immutability-helper';

import Editor from './Editor';
import MainContainer from './MainContainer';
import FilesSidebar, { FilesSidebarItem, FilesSidebarGroup } from './FilesSidebar';

import { APP_NAME } from '../config';

class FilesFragment extends Component {
    static displayName = "FilesFragment";

    constructor(props) {
        super(props);
        this.state = {
            title: APP_NAME,
            files: {
                'Preview': {
                    type: 'f',
                    status: 'on',
                    name: 'Preview'
                },
                'Group 1': {
                    type: 'g',
                    status: 'on',
                    name: 'Group 1',
                    collapsed: true,
                    children: {
                        'File 1': {
                            type: 'f',
                            status: 'on',
                            name: 'File 1'
                        }
                    }
                },
                'Group 2': {
                    type: 'g',
                    status: 'on',
                    name: 'Group 2',
                    collapsed: false,
                    children: {
                        'File 2': {
                            type: 'f',
                            status: 'on',
                            name: 'File 2'
                        },
                        'File 3': {
                            type: 'f',
                            status: 'on',
                            name: 'File 3'
                        }
                    }
                }
            }
        };
    }

    onFileItemClick(id) {
        const { files } = this.state;
        for (let itemId in files) {
            const updated = {};
            const item = files[id];
            if (itemId === id && item.type === 'g') {
                updated[id] = { collapsed: { $set: !item.collapsed } };
                this.setState(update(this.state, {
                    files: updated
                }));
            }
        }
    }

    onFileItemStatusChange(id) {
        let updated = null;
        let nextState = this.state;
        const { files } = this.state;
        for (let itemId in files) {
            if (!files.hasOwnProperty(itemId)) continue;
            const item = files[itemId];
            if (itemId === id) {
                updated = {};
                const nextStatus = item.status === 'on' ? 'off' : 'on';
                updated[id] = { status: { $set: nextStatus } };
                if (item.type === 'g') {
                    updated[id]['children'] = {};
                    for (let childId in item.children) {
                        if (!item.children.hasOwnProperty(childId)) continue;
                        updated[id]['children'][childId] = { status: { $set: nextStatus } };
                    }
                }
                break;
            } else if (item.type === 'g') {
                let statusAllOff = true;
                for (let childId in item.children) {
                    if (!item.children.hasOwnProperty(childId)) continue;
                    const child = item.children[childId];
                    if (childId === id) {
                        updated = {};
                        updated[itemId] = { children: {} };
                        updated[itemId]['children'][id] = { status: { $set: child.status === 'on' ? 'off' : 'on' } };
                        statusAllOff = statusAllOff && child.status === 'on';
                    } else {
                        statusAllOff = statusAllOff && child.status === 'off';
                    }
                }
                const nextStatus = statusAllOff ? 'off' : 'on';
                if (item.status !== nextStatus) {
                    const statusUpdate = {};
                    statusUpdate[itemId] = { status: { $set: nextStatus } };
                    nextState = update(nextState, { files: statusUpdate });
                }
                if (updated !== null) {
                    break;
                }
            }
        }
        if (updated !== null) {
            this.setState(update(nextState, { files: updated }));
        }
    }

    render() {
        const { title, files } = this.state;
        const fileComponents = [];
        for (let id in files) {
            if (!files.hasOwnProperty(id)) continue;
            const item = files[id];
            if (item.type === 'g') {
                const children = [];
                for (let childId in item.children) {
                    if (!item.children.hasOwnProperty(childId)) continue;
                    const child = item.children[childId];
                    children.push(<FilesSidebarItem id={ childId } status={ child.status } name={ child.name } />)
                }
                fileComponents.push(<FilesSidebarGroup id={ id } status={ item.status } name={ item.name } collapsed={ item.collapsed }>
                    { children }
                </FilesSidebarGroup>);
            } else {
                fileComponents.push(<FilesSidebarItem id={ id } status={ item.status } name={ item.name } />);
            }
        }
        return (<div className="app-fragment" id="app-fragment-files">
                    <FilesSidebar
                        onItemClickListener={ this.onFileItemClick.bind(this) }
                        onItemEditClickListener={ id => console.log('edit', id) }
                        onItemStatusChangeListener={ this.onFileItemStatusChange.bind(this) }>
                        { fileComponents }
                    </FilesSidebar>
                    <MainContainer>
                        <div className="app-titlebar app-window-draggable">{ title }</div>
                        <Editor/>
                    </MainContainer>
                </div>);
    }
}

export default FilesFragment;