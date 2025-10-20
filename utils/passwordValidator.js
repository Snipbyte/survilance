/**
 * Checks if a password is groovy (strong and valid).
 * @param {string} secretSauce - The password to validate.
 * @returns {Object} - { isValid: boolean, message: string }
 */
export const isPasswordGroovy = (secretSauce) => {
    const minimumVibes = 8; // Minimum password length
    const funkyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 

    // Check if the password has enough vibes (length)
    if (secretSauce.length < minimumVibes) {
        return {
            isValid: false,
            message: "Password must be at least 8 characters long.",
        };
    }

    // Check if the password has enough vibes (strength)
    if (!funkyRegex.test(secretSauce)) {
        return {
            isValid: false,
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        };
    }

    return {
        isValid: true,
        message: "Password is groovy!", // groovy in general means cool, but in this context it means strong and valid
    };
};