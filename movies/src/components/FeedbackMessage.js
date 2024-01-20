import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FeedbackMessage = React.memo(({message, classes}) => {
    const getClasses = () => {
        return classNames(
            'relative flex flex-col w-full rounded-lg bg-sky-300 shadow-2xl p-4 text-center gap-8 mb-5',
            classes
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center focus:outline-none pointer-events-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className={getClasses()}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
});

FeedbackMessage.propTypes = {
    message: PropTypes.string.isRequired,
    classes: PropTypes.string
};

export default FeedbackMessage;
