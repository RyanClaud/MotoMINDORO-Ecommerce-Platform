import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaLock, FaEnvelope, FaQuestionCircle, FaCheckCircle, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [resetMethod, setResetMethod] = useState(null); // null: Choose method, 'security': Security Questions, 'email': Email
  const [step, setStep] = useState(0); // 0: Choose method, 1: Email, 2: Security Questions, 3: New Password
  const [email, setEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState({
    question1: '',
    question2: '',
  });
  const [formData, setFormData] = useState({
    answer1: '',
    answer2: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleMethodSelect = (method) => {
    setResetMethod(method);
    setStep(1);
    setError('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (resetMethod === 'security') {
        // Security Questions method
        const response = await api.post('/forgot-password/security-questions', { email });
        setSecurityQuestions({
          question1: response.data.security_question_1,
          question2: response.data.security_question_2,
        });
        setStep(2);
      } else if (resetMethod === 'email') {
        // Email method - send reset link
        await api.post('/forgot-password/email', { email });
        setSuccess('Password reset link has been sent to your email. Please check your inbox.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAnswersSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.answer1 || !formData.answer2) {
      setError('Please answer both security questions');
      return;
    }
    
    setStep(3);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      await api.post('/reset-password/security-questions', {
        email,
        security_answer_1: formData.answer1,
        security_answer_2: formData.answer2,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      });
      
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. Please check your answers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Login</span>
        </Link>

        {/* Card */}
        <div className="group relative bg-white rounded-3xl shadow-2xl p-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative bg-white rounded-3xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl mb-4 shadow-xl">
                <FaLock className="text-4xl text-white" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-600">Reset your password using security questions</p>
            </div>

            {/* Progress Steps - Only show for security questions method */}
            {resetMethod === 'security' && step > 0 && (
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s ? <FaCheckCircle /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                <p className="text-red-600 font-semibold text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-2xl">
                <p className="text-green-600 font-semibold text-sm">{success}</p>
              </div>
            )}

            {/* Step 0: Choose Reset Method */}
            {step === 0 && (
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-6">
                  Choose how you'd like to reset your password
                </p>

                {/* Security Questions Option */}
                <button
                  onClick={() => handleMethodSelect('security')}
                  className="group relative w-full p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl hover:border-blue-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaQuestionCircle className="text-3xl text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-1">Security Questions</h3>
                      <p className="text-sm text-gray-600">Answer your security questions to reset password</p>
                    </div>
                    <FaArrowLeft className="text-blue-600 transform rotate-180 group-hover:translate-x-2 transition-transform" />
                  </div>
                </button>

                {/* Email Option */}
                <button
                  onClick={() => handleMethodSelect('email')}
                  className="group relative w-full p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl hover:border-green-400 hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                      <FaEnvelope className="text-3xl text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-gray-900 mb-1">Email Reset Link</h3>
                      <p className="text-sm text-gray-600">Receive a password reset link via email</p>
                    </div>
                    <FaArrowLeft className="text-green-600 transform rotate-180 group-hover:translate-x-2 transition-transform" />
                  </div>
                </button>
              </div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  {resetMethod === 'email' && (
                    <p className="text-xs text-gray-500 mt-2">
                      We'll send a password reset link to this email address
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(0);
                      setResetMethod(null);
                      setError('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 text-white py-4 rounded-2xl font-black transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      resetMethod === 'email'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    }`}
                  >
                    {loading ? 'Processing...' : resetMethod === 'email' ? 'Send Reset Link' : 'Continue'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Security Questions */}
            {step === 2 && (
              <form onSubmit={handleSecurityAnswersSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaQuestionCircle className="inline mr-2 text-blue-600" />
                    {securityQuestions.question1}
                  </label>
                  <input
                    type="text"
                    value={formData.answer1}
                    onChange={(e) => setFormData({ ...formData, answer1: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Your answer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <FaQuestionCircle className="inline mr-2 text-blue-600" />
                    {securityQuestions.question2}
                  </label>
                  <input
                    type="text"
                    value={formData.answer2}
                    onChange={(e) => setFormData({ ...formData, answer2: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Your answer"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-300 transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-black hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
