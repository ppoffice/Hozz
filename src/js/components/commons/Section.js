import React, { Component, PropTypes } from 'react';

class Section extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        const { id, title, className, children } = this.props;
        return (<section id={ id } className={ "app-section" + (className ? " " + className : "") }>
                    { title ? <h2 className="app-section-title">{ title }</h2> : null }
                    <div className="app-section-container">
                        { children }
                    </div>
                </section>);
    }
}

Section.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
};

export default Section;