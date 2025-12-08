import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaSave, FaTimes, FaCamera, FaUserCircle, FaLock, FaShieldAlt 
} from 'react-icons/fa';

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    profile_photo: null,
    business_logo: null,
    security_question_1: '',
    security_answer_1: '',
    security_question_2: '',
    security_answer_2: '',
  });
  const [businessLogoPreview, setBusinessLogoPreview] = useState(null);
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [hasSecurityQuestions, setHasSecurityQuestions] = useState(false);
  
  // Security Questions Options
  const securityQuestions1 = [
    'What city were you born in?',
    'What is your mother\'s maiden name?',
    'What was the name of your first pet?',
    'What is your favorite motorcycle brand?',
    'What was your first motorcycle model?',
  ];
  
  const securityQuestions2 = [
    'What is your father\'s middle name?',
    'In what city did you meet your spouse/partner?',
    'What is the name of your favorite childhood friend?',
    'What street did you live on in third grade?',
    'What is your oldest sibling\'s middle name?',
  ];

  useEffect(() => {
    if (user) {
      const hasQuestions = user.security_question_1 && user.security_question_2;
      setHasSecurityQuestions(hasQuestions);
      
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        profile_photo: null,
        business_logo: null,
        security_question_1: user.security_question_1 || '',
        security_answer_1: '',
        security_question_2: user.security_question_2 || '',
        security_answer_2: '',
      });
      
      if (user.profile_photo) {
        setProfilePhotoPreview(`http://localhost:8000/storage/${user.profile_photo}`);
      }
      
      if (user.business_logo) {
        setBusinessLogoPreview(`http://localhost:8000/storage/${user.business_logo}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        setError('Profile photo must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        profile_photo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleBusinessLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048 * 1024) {
        setError('Business logo must be less than 2MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFormData(prev => ({
        ...prev,
        business_logo: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('phone', formData.phone || '');
      submitData.append('address', formData.address || '');
      submitData.append('_method', 'PUT');
      
      // Add security questions if they're being updated
      if (showSecurityQuestions || !hasSecurityQuestions) {
        if (formData.security_question_1 && formData.security_answer_1) {
          submitData.append('security_question_1', formData.security_question_1);
          submitData.append('security_answer_1', formData.security_answer_1);
        }
        if (formData.security_question_2 && formData.security_answer_2) {
          submitData.append('security_question_2', formData.security_question_2);
          submitData.append('security_answer_2', formData.security_answer_2);
        }
      }
      
      if (formData.profile_photo) {
        console.log('Uploading profile photo:', formData.profile_photo.name, formData.profile_photo.size);
        submitData.append('profile_photo', formData.profile_photo);
      }
      
      if (formData.business_logo) {
        console.log('Uploading business logo:', formData.business_logo.name, formData.business_logo.size);
        submitData.append('business_logo', formData.business_logo);
      }

      // Log FormData contents
      console.log('Submitting profile update...');
      for (let pair of submitData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await api.post('/profile', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      updateUser(response.data);
      setSuccess('Profile updated successfully!');
      setShowSecurityQuestions(false);
      
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join(', ');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your account information</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Profile Photo Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-white rounded-full overflow-hidden shadow-lg">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUserCircle className="text-8xl text-gray-300" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile_photo"
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-all"
                  >
                    <FaCamera />
                    <input
                      type="file"
                      id="profile_photo"
                      name="profile_photo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-white text-sm mt-4">Click the camera icon to change photo</p>
                <p className="text-blue-200 text-xs mt-1">Max size: 2MB</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., +63 912 345 6789"
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              {/* Security Questions Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-2xl text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Security Questions</h3>
                      <p className="text-sm text-gray-600">
                        {hasSecurityQuestions 
                          ? 'Your security questions are set up' 
                          : 'Set up security questions for account recovery'}
                      </p>
                    </div>
                  </div>
                  {hasSecurityQuestions && (
                    <button
                      type="button"
                      onClick={() => setShowSecurityQuestions(!showSecurityQuestions)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all text-sm font-medium"
                    >
                      {showSecurityQuestions ? 'Cancel' : 'Update'}
                    </button>
                  )}
                </div>

                {(!hasSecurityQuestions || showSecurityQuestions) && (
                  <div className="space-y-4 mt-4">
                    {/* Security Question 1 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Security Question 1 *
                      </label>
                      <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <select
                          name="security_question_1"
                          value={formData.security_question_1}
                          onChange={handleChange}
                          required={!hasSecurityQuestions || showSecurityQuestions}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select a question</option>
                          {securityQuestions1.map((question, index) => (
                            <option key={index} value={question}>
                              {question}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="security_answer_1"
                        value={formData.security_answer_1}
                        onChange={handleChange}
                        required={!hasSecurityQuestions || showSecurityQuestions}
                        placeholder="Your answer"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Security Question 2 */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Security Question 2 *
                      </label>
                      <div className="relative mb-3">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FaLock className="text-gray-400" />
                        </div>
                        <select
                          name="security_question_2"
                          value={formData.security_question_2}
                          onChange={handleChange}
                          required={!hasSecurityQuestions || showSecurityQuestions}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select a question</option>
                          {securityQuestions2.map((question, index) => (
                            <option key={index} value={question}>
                              {question}
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        name="security_answer_2"
                        value={formData.security_answer_2}
                        onChange={handleChange}
                        required={!hasSecurityQuestions || showSecurityQuestions}
                        placeholder="Your answer"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-4">
                      <p className="text-xs text-yellow-800">
                        <strong>Important:</strong> Remember your answers. They will be used to recover your account if you forget your password.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Logo Upload (for sellers) */}
              {user?.role === 'seller' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Business Logo (Optional)
                  </label>
                  <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Logo Preview */}
                    <div className="w-32 h-32 bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 flex-shrink-0">
                      {businessLogoPreview ? (
                        <img
                          src={businessLogoPreview}
                          alt="Business Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaCamera className="text-4xl text-gray-300" />
                        </div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1 text-center md:text-left">
                      <label
                        htmlFor="business_logo"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-lg"
                      >
                        <FaCamera />
                        <span>Upload Business Logo</span>
                        <input
                          type="file"
                          id="business_logo"
                          name="business_logo"
                          accept="image/*"
                          onChange={handleBusinessLogoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-600 mt-2">
                        Upload your business or store logo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Square image, Max size: 2MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Profile Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your email address cannot be changed for security reasons</li>
            <li>• Profile photo should be less than 2MB in size</li>
            <li>• Phone number and address are optional but recommended</li>
            <li>• All changes will be saved immediately</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
