import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import Section from '../partial/base/Section';
import MainContent from '../partial/MainContent';
import SettingSidebar, { SettingSidebarItem } from '../partial/SettingSidebar';

class Settings extends Component {
    static displayName = "Settings";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-fragment" id="app-fragment-settings">
                    <SettingSidebar activeId="ie" onItemClickListener={ id => console.log(id) }>
                        <SettingSidebarItem id="ie" icon="import_export" name="Import/Export" />
                        <SettingSidebarItem id="sync" icon="sync" name="Sync" />
                        <SettingSidebarItem id="lang" icon="language" name="Language" />
                        <SettingSidebarItem id="about" icon="lightbulb_outline" name="About" />
                    </SettingSidebar>
                    <MainContent>
                        <div className="app-titlebar app-window-draggable"></div>
                        <Section id="ie" title="Import/Export">
                            <div>
                                <p>Import</p>
                                <button>From Zip</button>
                                <button>From Other Apps</button>
                            </div>
                            <div>
                                <p>Export</p>
                                <button>To Zip</button>
                                <button>To Surge</button>
                            </div>
                        </Section>
                        <Section id="sync" title="Sync">
                            <button>Start Syncing</button>
                            <div>
                                <p>Syncing History</p>
                            </div>
                        </Section>
                        <Section id="lang" title="Language">
                            <Select
                                clearable={ false }
                                searchable={ false }
                                className="language-select"
                                name={ "English(US)" }
                                value={ "en-US" }
                                options={ [] }
                                onChange={ null } />
                        </Section>
                        <Section id="about" title="About">
                            About
                        </Section>
                    </MainContent>
                </div>);
    }
}

export default Settings;