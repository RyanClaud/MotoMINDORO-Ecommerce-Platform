import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaMotorcycle, FaUser, FaEnvelope, FaLock, FaArrowRight, 
  FaShoppingCart, FaStore, FaCheckCircle, FaQuestionCircle, FaShieldAlt
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'buyer',
    security_question_1: '',
    security_answer_1: '',
    security_question_2: '',
    security_answer_2: '',
  });

  const securityQuestions = {
    set1: [
      "What city were you born in?",
      "What is your mother's maiden name?",
      "What was the name of your first pet?",
      "What is your favorite motorcycle brand?",
      "What was your first motorcycle model?",
    ],
    set2: [
      "What is your father's middle name?",
      "In what city did you meet your spouse/partner?",
      "What is the name of your favorite childhood friend?",
      "What street did you live on in third grade?",
      "What is your oldest sibling's middle name?",
    ]
  };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.security_question_1 || !formData.security_answer_1) {
      setError('Please select and answer the first security question');
      return;
    }

    if (!formData.security_question_2 || !formData.security_answer_2) {
      setError('Please select and answer the second security question');
      return;
    }

    if (formData.security_question_1 === formData.security_question_2) {
      setError('Please select different security questions');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.password_confirmation,
        formData.role,
        formData.security_question_1,
        formData.security_answer_1,
        formData.security_question_2,
        formData.security_answer_2
      );
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row-reverse items-center gap-12 relative z-10">
        {/* Right Side - Branding */}
        <div className="flex-1 text-center lg:text-left animate-fade-in-right">
          {/* Hero Logo with Glow Effect */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30"></div>
            </div>
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20"></div>
            </div>
            
            {/* Logo */}
            <div className="relative animate-float">
              <img 
                src="/motomindoro_logo.png" 
                alt="MotoMindoro Logo" 
                className="w-48 h-48 lg:w-64 lg:h-64 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4 leading-tight">
            Join
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient">
              MotoMindoro
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Start your journey in Oriental Mindoro's most trusted motorcycle marketplace
          </p>
          
          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: FaCheckCircle, text: 'Free account creation' },
              { icon: FaCheckCircle, text: 'Access to thousands of listings' },
              { icon: FaCheckCircle, text: 'Connect with verified sellers' }
            ].map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <benefit.icon className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Left Side - Register Form */}
        <div className="flex-1 w-full max-w-md animate-fade-in-left">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 space-y-6 backdrop-blur-sm bg-opacity-95 border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600">
                Fill in your details to get started
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="Juan Dela Cruz"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Security Questions Section */}
              <div className="space-y-4 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                    <FaShieldAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Security Questions</h3>
                    <p className="text-xs text-gray-600">For password recovery</p>
                  </div>
                </div>

                {/* Question 1 */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaQuestionCircle className="inline mr-2 text-blue-600" />
                    Security Question 1
                  </label>
                  <select
                    name="security_question_1"
                    value={formData.security_question_1}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    required
                  >
                    <option value="">Select a question...</option>
                    {securityQuestions.set1.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer
                  </label>
                  <input
                    type="text"
                    name="security_answer_1"
                    value={formData.security_answer_1}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="Your answer"
                    required
                  />
                </div>

                {/* Question 2 */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaQuestionCircle className="inline mr-2 text-blue-600" />
                    Security Question 2
                  </label>
                  <select
                    name="security_question_2"
                    value={formData.security_question_2}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    required
                  >
                    <option value="">Select a question...</option>
                    {securityQuestions.set2.map((question, index) => (
                      <option key={index} value={question}>{question}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Answer
                  </label>
                  <input
                    type="text"
                    name="security_answer_2"
                    value={formData.security_answer_2}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="Your answer"
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="pt-4 border-t-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I want to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.role === 'buyer' 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={formData.role === 'buyer'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FaShoppingCart className={`text-3xl mb-2 ${
                      formData.role === 'buyer' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      formData.role === 'buyer' ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      Buy
                    </span>
                    {formData.role === 'buyer' && (
                      <div className="absolute top-2 right-2">
                        <FaCheckCircle className="text-indigo-600" />
                      </div>
                    )}
                  </label>

                  <label className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.role === 'seller' 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="seller"
                      checked={formData.role === 'seller'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <FaStore className={`text-3xl mb-2 ${
                      formData.role === 'seller' ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      formData.role === 'seller' ? 'text-indigo-600' : 'text-gray-700'
                    }`}>
                      Sell
                    </span>
                    {formData.role === 'seller' && (
                      <div className="absolute top-2 right-2">
                        <FaCheckCircle className="text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center space-x-2 font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
              >
                <span>Sign in instead</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations - Same as Login */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(-2deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;
