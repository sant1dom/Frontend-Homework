import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Link} from "react-router-dom";

const ButtonLink = React.memo(({onClick, label, variant, size, disabled, rounded, classes, key, to}) => {
    const getButtonClasses = () => {
        return classNames(
            'inline-flex items-center justify-center transition-all duration-300',
            {
                'bg-blue-500 text-white': variant === 'primary',
                'bg-gray-300 text-gray-700': variant === 'secondary',
                'text-blue-900 shadow-none': variant === 'nobg',
                'text-sm px-2 py-1': size === 'small',
                'text-lg px-4 py-2': size === 'large',
                'text-base px-3 py-2': size !== 'small' && size !== 'large',
                'opacity-50 cursor-not-allowed': disabled,
                'hover:bg-blue-600': variant === 'primary' && !disabled,
                'hover:bg-gray-400': variant === 'secondary' && !disabled,
                'hover:shadow-lg': !disabled,
                'shadow': !disabled,
                'focus:outline-none': !disabled,
                'rounded-md': rounded,
            },
            classes
        );
    };

    return (
        <Link
            className={getButtonClasses()}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
            key={key}
            to={to}
        >
            {label}
        </Link>
    );
});

ButtonLink.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired || PropTypes.element.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'nobg']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,
    classes: PropTypes.string,
};

ButtonLink.defaultProps = {
    variant: 'primary',
    size: 'medium',
    disabled: false,
    rounded: false,
    classes: '',
};

export default ButtonLink;
