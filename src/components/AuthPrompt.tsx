import React from 'react';
import { Link } from 'react-router-dom';

export const AuthPrompt: React.FC = () => {
    return (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-600 mb-2">برای ارسال نظر لطفاً وارد شوید</p>
            <Link
                to="/login"
                className="inline-block bg-[#F4B744] text-white py-2 px-4 rounded-lg hover:bg-[#e5a93d] transition-colors"
            >
                ورود به حساب کاربری
            </Link>
        </div>
    );
}; 