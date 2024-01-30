// validationUtils.js

export const PASSWORD_REQUIRED = 'Please enter your password';
export const PASSWORD_CONFIRM_REQUIRED = 'Please confirm your password';
export const PASSWORDS_DO_NOT_MATCH = 'Passwords do not match';
export const EMAIL_REQUIRED = 'Please enter your email';
export const INVALID_EMAIL = 'Please enter a valid email address';
export const PASSWORD_TOO_SHORT = 'Must be at least 8 characters';
export const PASSWORD_NO_NUMBER = 'Must contain at least one number';
export const PASSWORD_NO_LETTER = 'Must contain at least one letter';
export const PASSWORD_NO_SPECIAL_CHAR = 'Must contain at least one special character';
export const PASSWORD_NO_SPACES = 'Your password cannot contain spaces';

const generatePasswordFeedback = (conditions) => {
    return conditions.map(condition => condition.message).join('$');
};

export const validatePassword = (password) => {
    let errors = {};
    let conditions = [];

    if (!password) {
        errors.password = PASSWORD_REQUIRED;
    } else {
        if (password.length < 8) {
            conditions.push({ valid: false, message: PASSWORD_TOO_SHORT });
        }
        if (!/\d/.test(password)) {
            conditions.push({ valid: false, message: PASSWORD_NO_NUMBER });
        }
        if (!/[a-zA-Z]/.test(password)) {
            conditions.push({ valid: false, message: PASSWORD_NO_LETTER });
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            conditions.push({ valid: false, message: PASSWORD_NO_SPECIAL_CHAR });
        }
        if (/\s/.test(password)) {
            conditions.push({ valid: false, message: PASSWORD_NO_SPACES });
        }
        if (conditions.some(condition => !condition.valid)) {
            errors.password = 'Your password must meet the following requirements: $' + generatePasswordFeedback(conditions);
        }
    }

    return errors;
};

export const validateEmail = (email) => {
    let errors = {};

    if (!email) {
        errors.email = EMAIL_REQUIRED;
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = INVALID_EMAIL;
        }
    }

    return errors;
};

export const validatePasswordConfirmation = (password, confirmPassword) => {
    let errors = {};

    if (!confirmPassword) {
        errors.passwordConfirm = PASSWORD_CONFIRM_REQUIRED;
    } else if (password !== confirmPassword) {
        errors.passwordConfirm = PASSWORDS_DO_NOT_MATCH;
    }

    return errors;
};

export const validateForm = (email, password, confirmPassword) => {
    let errors = {
        ...validateEmail(email),
        ...validatePassword(password),
        ...validatePasswordConfirmation(password, confirmPassword)
    };

    return errors;
};

export const validateFormWithPassword = (password, confirmPassword) => {
    let errors = {
        ...validatePassword(password),
        ...validatePasswordConfirmation(password, confirmPassword)
    };

    return errors;
};

export const validateFormWithOldPassword = (password, confirmPassword, oldPassword) => {
    let errors = {
        ...validatePassword(password),
        ...validatePasswordConfirmation(password, confirmPassword),
    };

    return errors;
};
