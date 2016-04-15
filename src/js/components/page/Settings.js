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
        return (<div className="app-page-settings">
                    <SettingSidebar onItemClickListener={ id => console.log(id) }>
                        <SettingSidebarItem id="ie" name="Import/Export" />
                        <SettingSidebarItem id="about" name="About" />
                    </SettingSidebar>
                    <MainContent>
                        <Section id="ie" title="Import/Export">
                            import/export
                        </Section>
                        <Section id="about" title="About">
                            about
                        </Section>
                    </MainContent>
                </div>);
    }
}

export default Settings;