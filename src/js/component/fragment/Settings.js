import React, { Component, PropTypes } from 'react';

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
                        <SettingSidebarItem id="lang" icon="language" name="Language" />
                        <SettingSidebarItem id="about" icon="lightbulb_outline" name="About" />
                    </SettingSidebar>
                    <MainContent>
                        <Section id="ie" title="Import/Export">
                            Import/Export
                        </Section>
                        <Section id="lang" title="Language">
                            Language
                        </Section>
                        <Section id="about" title="About">
                            About
                        </Section>
                    </MainContent>
                </div>);
    }
}

export default Settings;