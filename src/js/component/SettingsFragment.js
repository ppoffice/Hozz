import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import { APP_NAME, APP_AUTHOR, APP_HOMEPAGE, APP_VERSION } from '../config';
import Section from './commons/Section';
import MainContainer from './MainContainer';
import SettingsSidebar, { SettingsSidebarItem } from './SettingsSidebar';

class SettingsFragment extends Component {
    static displayName = "SettingsFragment";

    constructor (props) {
        super(props);
    }

    render () {
        return (<div className="app-fragment" id="app-fragment-settings">
                    <SettingsSidebar activeId="ie" onItemClickListener={ id => console.log(id) }>
                        <SettingsSidebarItem id="ie" icon="import_export" name="Import/Export" />
                        <SettingsSidebarItem id="sync" icon="sync" name="Sync" />
                        <SettingsSidebarItem id="lang" icon="language" name="Language" />
                        <SettingsSidebarItem id="about" icon="lightbulb_outline" name="About" />
                    </SettingsSidebar>
                    <MainContainer>
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
                            { APP_NAME } by { APP_AUTHOR }
                            Current Version: { APP_VERSION }
                        </Section>
                    </MainContainer>
                </div>);
    }
}

export default SettingsFragment;