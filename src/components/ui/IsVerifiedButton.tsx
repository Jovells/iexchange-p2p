import React from 'react';

const IsVerifiedButton = () => {
    const isVerified = false;

    const handleVerification = () => { }
    return (
        <button
            onClick={handleVerification}
            className={`px-2 py-1 rounded-full text-white text-sm mt-3 ${isVerified ? 'bg-green-500' : 'bg-blue-500'
                }`}
        >
            {isVerified ? 'Verified' : 'Not Verified'}
        </button>
    );
};

export default IsVerifiedButton;
