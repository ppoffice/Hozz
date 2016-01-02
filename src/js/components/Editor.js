import React, { Component, PropTypes } from 'react';
import CodeMirror from 'react-codemirror';

class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    componentWillUnmount () {
        const { uid, onTextShouldUpdate } = this.props;
        onTextShouldUpdate && onTextShouldUpdate(uid, this.state.value);
    }

    __onChange (value) {
        this.setState({ value });
    }

    __onFocusChange (focused) {
        if (!focused) {
            const { value } = this.state;
            const { uid, onTextShouldUpdate } = this.props;
            onTextShouldUpdate && onTextShouldUpdate(uid, value);
        }
    }

    render() {
        return (<div>
                    <CodeMirror
                        ref="codemirror"
                        value={ this.state.value }
                        options={ this.props.options }
                        onChange={ this.__onChange.bind(this) }
                        onFocusChange={ this.__onFocusChange.bind(this) }  />
                </div>);
    }
}

Editor.propTypes = {
    uid: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.object,
    onTextShouldUpdate: PropTypes.func,
}

export default Editor;
