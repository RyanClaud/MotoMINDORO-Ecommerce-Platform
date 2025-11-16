import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaMotorcycle, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (remainingTime > 0) {
      return;
    }

    setError('');
    setLoading(true);
    setIsLocked(false);

    try {
      const userData = await login(email, password);
      
      // Redirect based on user role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const response = err.response?.data;
      
      if (response?.is_locked) {
        // Permanent lock
        setIsLocked(true);
        setLockMessage(response.message);
        setError(response.message);
      } else if (response?.remaining_seconds) {
        // Temporary lock
        setRemainingTime(response.remaining_seconds);
        setAttempts(response.attempts || 0);
        setError(response.message);
      } else {
        setError(response?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-12 relative z-10">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center lg:text-left animate-fade-in-left">
          {/* Hero Logo with Glow Effect */}
          <div className="relative inline-flex items-center justify-center mb-8">
            {/* Animated Glow Rings */}
            <div className="absolute inset-0 animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-3xl opacity-30"></div>
            </div>
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-2xl opacity-20"></div>
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
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
              MotoMINDORO
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your trusted marketplace for buying and selling motorcycles across Oriental Mindoro
          </p>
          
          {/* Features */}
          <div className="space-y-4">
            {[
              'Thousands of verified listings',
              'Connect with trusted sellers',
              'Find your perfect ride today'
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 w-full max-w-md animate-fade-in-right">
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 space-y-8 backdrop-blur-sm bg-opacity-95 border border-gray-100 hover:shadow-3xl transition-shadow duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Permanent Lock Warning */}
              {isLocked && (
                <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 animate-shake">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-500 p-3 rounded-xl flex-shrink-0">
                      <FaShieldAlt className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-red-900 mb-2">Account Locked</h3>
                      <p className="text-sm text-red-700 mb-4">{lockMessage}</p>
                      <div className="bg-white rounded-xl p-4 border-2 border-red-200">
                        <p className="text-sm font-bold text-gray-900 mb-2">To unlock your account:</p>
                        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                          <li>Contact the administrator</li>
                          <li>Provide proof of ownership (ID, registration details)</li>
                          <li>Wait for admin verification</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Temporary Lock with Countdown */}
              {!isLocked && remainingTime > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 animate-shake">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-500 p-3 rounded-xl flex-shrink-0">
                      <FaExclamationTriangle className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-yellow-900 mb-2">Too Many Attempts</h3>
                      <p className="text-sm text-yellow-700 mb-3">{error}</p>
                      <div className="bg-white rounded-xl p-4 border-2 border-yellow-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">Wait time:</span>
                          <span className="text-3xl font-black text-yellow-600">{formatTime(remainingTime)}</span>
                        </div>
                        {attempts > 0 && (
                          <p className="text-xs text-gray-600 mt-2">
                            Failed attempts: {attempts}/7 (Account locks at 7 attempts)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Error */}
              {!isLocked && remainingTime === 0 && error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300"
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
                      <FaLock className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || remainingTime > 0 || isLocked}
                  className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : remainingTime > 0 ? (
                    <div className="flex items-center space-x-2">
                      <FaExclamationTriangle />
                      <span>Locked - Wait {formatTime(remainingTime)}</span>
                    </div>
                  ) : isLocked ? (
                    <div className="flex items-center space-x-2">
                      <FaShieldAlt />
                      <span>Account Locked - Contact Admin</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
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
                <span className="px-4 bg-white text-gray-500 font-medium">New to MotoMarket?</span>
              </div>
            </div>

            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center space-x-2 font-bold text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <span>Create an account</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
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
            transform: translateY(-20px) rotate(2deg);
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

export default Login;
