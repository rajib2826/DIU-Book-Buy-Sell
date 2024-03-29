import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../components/Auth/AuthContext';
import Navbar from '../components/Layout/Navbar';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const navigate = useNavigate();
  const { login, setJWTToken, signInWithGoogle } = useAuth();
  const [typePass, setTypePass] = useState(false);
  const [isLostPasswordModalOpen, setIsLostPasswordModalOpen] = useState(false);

  const {
    register: registerSignIn,
    handleSubmit: handleSignIn,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResponse = (res) => {
    setJWTToken();
    toast.success('Sign in Successful');
    navigate('/books');
  };

  // Google Sign In
  const googleSignIn = () => {
    const loading = toast.loading('Please wait a moment...');
    signInWithGoogle()
      .then((res) => {
        toast.dismiss(loading);
        if (res === null || res === undefined) {
          toast.error('Not registered yet! Please register first.');
          return;
        }
        handleResponse(res);
      })
      .catch((err) => {
        toast.dismiss(loading);
        let message = err.code.split('auth/')[1].replace(/-/g, ' ');
        toast.error(message.charAt(0).toUpperCase() + message.slice(1));
      });
  };

  // Sign In with Email and Password
  const onSubmit = (data) => {
    const loading = toast.loading('Please wait a moment...');
    const { email, password } = data;

    // For Login
    if (email && password) {
      login(email.toLowerCase(), password)
        .then((res) => {
          toast.dismiss(loading);
          handleResponse(res);
        })
        .catch((err) => {
          toast.dismiss(loading);
          let message = err.code.split('auth/')[1].replace(/-/g, ' ');
          toast.error(message.charAt(0).toUpperCase() + message.slice(1));
        });
    }
  };

  return (
    <>
      {isLostPasswordModalOpen && (
        <ForgotPassword
          setIsLostPasswordModalOpen={setIsLostPasswordModalOpen}
        />
      )}

      <Navbar />
      <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <Link to='/'>
            <img
              className='mx-auto h-12 w-auto'
              src='https://i.ibb.co/YytpcVr/logo-image-removebg-preview.png'
              alt='Your Company'
            />
          </Link>
          <h2 className='mt-6 text-center text-3xl font-semibold tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link
              to='/signup'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Create a new account
            </Link>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form className='space-y-6' onSubmit={handleSignIn(onSubmit)}>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  DIU Email
                </label>
                <div className='mt-1'>
                  <input
                    {...registerSignIn('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                      errors?.email
                        ? 'focus:border-red-500 focus:ring-red-500'
                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    type='email'
                    placeholder='Ex. james15-1234@diu.edu.bd'
                    name='email'
                  />
                </div>
                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.email?.message}
                </span>
              </div>

              <div className='relative'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  Password
                </label>
                <div className='mt-1'>
                  <input
                    {...registerSignIn('password', {
                      required: 'Password is required',
                      pattern: {
                        value:
                          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&;:`"'%<,>./?~^-_=+])[A-Za-z\d@$!%*#?&;:`"'%<,>./?~^-_=+]{8,}$/i,
                        message:
                          'Minimum eight characters, at least one letter, one number and one special character',
                      },
                    })}
                    className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm  focus:outline-none sm:text-sm ${
                      errors?.password
                        ? 'focus:border-red-500 focus:ring-red-500'
                        : 'focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                    type={typePass ? 'text' : 'password'}
                    placeholder='••••••••'
                    name='password'
                  />
                </div>
                <span className='absolute right-0 pr-4 top-8 flex items-center text-base leading-5 cursor-pointer'>
                  {typePass ? (
                    <EyeIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className='w-5 h-5 text-gray-500'
                      onClick={() => setTypePass(!typePass)}
                    />
                  )}
                </span>
                <span className='flex items-center font-medium tracking-wide text-red-500 text-sm mt-1 ml-1'>
                  {errors?.password?.message}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='remember-me'
                    name='remember-me'
                    type='checkbox'
                    className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                  />
                  <label
                    htmlFor='remember-me'
                    className='ml-2 block text-sm text-gray-900'
                  >
                    Remember me
                  </label>
                </div>

                <div className='text-sm'>
                  <span
                    className='font-medium text-indigo-600 hover:text-indigo-900 cursor-pointer'
                    onClick={() => setIsLostPasswordModalOpen(true)}
                  >
                    Forgot your password?
                  </span>
                </div>
              </div>

              <div>
                <input
                  type='submit'
                  className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer'
                  value='Sign in'
                />
              </div>
            </form>

            <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='bg-white px-2 text-gray-500'>
                    Or continue with
                  </span>
                </div>
              </div>

              <div>
                <div
                  onClick={googleSignIn}
                  className='flex items-center justify-center px-6 py-3 mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50 cursor-pointer'
                >
                  <svg className='w-6 h-6 mx-2' viewBox='0 0 40 40'>
                    <path
                      d='M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z'
                      fill='#FFC107'
                    />
                    <path
                      d='M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z'
                      fill='#FF3D00'
                    />
                    <path
                      d='M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z'
                      fill='#4CAF50'
                    />
                    <path
                      d='M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z'
                      fill='#1976D2'
                    />
                  </svg>

                  <span className='mx-2'>Sign in with Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
