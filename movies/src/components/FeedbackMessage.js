import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FeedbackMessage = React.memo(({message, position, classes}) => {
    const getClasses = () => {
        return classNames(
            'relative flex flex-col w-full rounded-lg bg-sky-300 shadow-2xl p-4 text-center gap-8 mb-5',
            classes
        );
    };

    const getPosition = () => {
        if (position === 'top') {
            return 'top-0 inset-x-0 mt-5';
        } else if (position === 'bottom') {
            return 'bottom-0 inset-x-0 mb-5';
        } else {
            return 'inset-0 my-5';
        }
    }

    return (
        <div
            className={"fixed z-50 flex items-center justify-center focus:outline-none " + getPosition()}>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className={getClasses()}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
});

FeedbackMessage.defaultProps = {
    position: 'center',
    classes: '',
};

FeedbackMessage.propTypes = {
    message: PropTypes.string.isRequired || PropTypes.object.isRequired,
    classes: PropTypes.string,
    position: PropTypes.oneOf(['top', 'center', 'bottom']),
};

export default FeedbackMessage;
