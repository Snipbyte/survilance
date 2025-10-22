// app/login/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import Input from '../../common/input/input';
import Images from '../../common/Image/Image';
import Button from '../../common/button/button';
import Link from 'next/link';
import Alert from '../../common/alert/alert';
import { loginUser } from '../../../../../utils/organization/auth/api';

const LoginForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      emailOrUserId: '',
      password: '',
    },
  });
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });

  // Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get('orgUserToken');
    if (token && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [router, pathname]);

  // Clear alert after a timeout
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: 'info', message: '' });
      }, 3000); // Hide alert after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.emailOrUserId, data.password);

      // Store token in cookie (already set by API, confirming here)
      Cookies.set('orgUserToken', response.token, {
        expires: 0.5, // 12 hours (0.5 days)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // Show success alert
      setAlert({
        show: true,
        type: 'success',
        message: 'Login successful! Redirecting to dashboard...',
      });

      // Delay redirect to show success alert
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000); // 2-second delay
    } catch (err) {
      // Show error alert
      setAlert({
        show: true,
        type: 'error',
        message: err || 'Login failed. Please try again.',
      });
      // Also set form error for input-specific validation
      setError('root', {
        type: 'manual',
        message: err || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="text-center mb-6">
        <Images src="/images/png/logo.png" alt="Logo" className="mx-auto w-10 h-10 mb-2" />
        <h2 className="text-xl font-semibold text-gray-800">Port Surveillance</h2>
        <p className="text-sm text-gray-600">Security Login</p>
        <p className="text-xs text-gray-500 mt-1">Access your PPE monitoring dashboard</p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border bg-white p-4 rounded-xl shadow-lg"
      >
        {alert.show && <Alert type={alert.type} message={alert.message} />}
        {errors.root && !alert.show && (
          <p className="text-red-500 text-sm mb-3 text-center">{errors.root.message}</p>
        )}
        <Input
          type="text"
          label="Email or User ID"
          placeholder="Enter your email or user ID"
          className="w-full"
          {...register('emailOrUserId', {
            required: 'Email or User ID is required',
            minLength: {
              value: 3,
              message: 'Email or User ID must be at least 3 characters',
            },
          })}
          error={errors.emailOrUserId}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          className="w-full"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password}
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
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in to Dashboard'}
        </Button>
        <p className="text-center text-xs text-gray-500 mt-4">
          Secure access to surveillance system <br /> © SSL Encrypt © 24/7 Monitoring
        </p>
      </form>
      <p className="text-center text-paraColor text-sm mt-4">
        Need help? Contact <Link className="text-blue-600 hover:underline" href="#">Technical Support</Link>
      </p>
    </div>
  );
};

export default LoginForm;