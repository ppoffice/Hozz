import React, { Component, PropTypes } from 'react';

import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/search/search';

class Editor extends Component {
    constructor (props) {
        super(props);
        this.state = {
            code: 'Code Example'
        };
    }

    render () {
        const options = {
            lineNumbers: true,
            mode: 'javascript',
            theme: 'monokai',
            indentWithTabs: false
        };
        return (<div className="app-editor">
            <CodeMirror value={ this.state.code } options={ options } />
        </div>);
    }
}

export default Editor;