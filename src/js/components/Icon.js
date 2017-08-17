import React from 'react'
import icons from '../../assets/images/icons.svg';

const Icon = ({symbol, className, title}) => {
    const iconClass = `Icon Icon-${symbol}` + (className ? ` ${className}` : '');
    return (
        <svg className={iconClass}>
            <title>{`${title}`}</title>
            <use xlinkHref={`./assets/images/icons.svg#${symbol}`} />
        </svg>
    );
}

export default Icon