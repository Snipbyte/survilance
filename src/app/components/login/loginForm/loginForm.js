import React from 'react';
import Input from '../../common/input/input';
import Images from '../../common/Image/Image';
import Button from '../../common/button/button';
import Link from 'next/link';
const LoginForm = () => {
    return (
        <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
                <Images src="/images/png/logo.png" alt="Logo" className="mx-auto w-10 h-10 mb-2" />
                <h2 className="text-xl font-semibold text-gray-800">Port Surveillance</h2>
                <p className="text-sm text-gray-600">Security Login</p>
                <p className="text-xs text-gray-500 mt-1">Access your PPE monitoring dashboard</p>
            </div>
            <form className="border bg-white p-4 rounded-xl shadow-lg">
                <Input
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    className="w-full"
                />
                <Input
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> Remember me
                    </label>
                    <Link href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</Link>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                >
                    Sign in to Dashboard
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                    Secure access to surveillance system <br/> © SSL Encrypt © 24/7 Monitoring
                </p>
            </form>
                <p className="text-center text-paraColor text-sm mt-4">
                   Need help? Contact <Link className='text-blue-600 hover:underline' href="#"> Technical Support</Link>
                </p>
        </div>
    );
};

export default LoginForm;