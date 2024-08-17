'use client';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import z from 'zod';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userSchema = z.object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .refine((value) => /[a-z]/.test(value), {
          message: "Password must contain at least one lowercase letter",
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: "Password must contain at least one uppercase letter",
        })
        .refine((value) => /[0-9]/.test(value), {
          message: "Password must contain at least one number",
        }),
    });

    const result = userSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(fieldErrors);

      // Show error toast notifications
      result.error.errors.forEach((error) => {
        toast.error(error.message);
      });

      return;
    }

    setErrors({});
    toast.success('Logged in successfully!');
    console.log('Logging in with', email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-900 to-teal-600">
      <form onSubmit={handleSubmit} className="bg-gray-900 bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-teal-400 text-center text-xl mb-6">CUSTOMER LOGIN</h2>
        <div className="mb-4">
          <Label htmlFor="email" className="text-gray-300 mb-1">
            Email ID
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-600' : 'border-gray-600'} rounded bg-gray-800 text-gray-300 focus:outline-none focus:border-teal-400`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <Label htmlFor="password" className="text-gray-300 mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-600' : 'border-gray-600'} rounded bg-gray-800 text-gray-300 focus:outline-none focus:border-teal-400`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="ml-2 text-gray-400">
              Remember me
            </Label>
          </div>
          <a href="#" className="text-teal-400 text-sm">
            Forgot Password?
          </a>
        </div>
        <Button type="submit" className="w-full bg-teal-500 text-gray-900 py-2 rounded focus:outline-none hover:bg-teal-600">
          LOGIN
        </Button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
