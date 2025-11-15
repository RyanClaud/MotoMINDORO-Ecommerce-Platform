import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { FaImage, FaTimes, FaStar, FaMotorcycle, FaCheckCircle, FaStore, FaArrowLeft } from 'react-icons/fa';

const EditListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    store_id: '',
    brand_id: '',
    title: '',
    model: '',
    year: new Date().getFullYear(),
    engine_displacement: '',
    condition: 'second_hand',
    mileage: '',
    price: '',
    is_negotiable: false,
    description: '',
    status: 'published',
    stock_quantity: 1,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [storesRes, brandsRes, listingRes] = await Promise.all([
        api.get('/my-stores'),
        api.get('/brands'),
        api.get(`/listings/${id}`),
      ]);
      
      setStores(storesRes.data);
      setBrands(brandsRes.data);
      
      const listing = listingRes.data;
      setFormData({
        store_id: listing.store_id || '',
        brand_id: listing.brand_id || '',
        title: listing.title || '',
        model: listing.model || '',
        year: listing.year || new Date().getFullYear(),
        engine_displacement: listing.engine_displacement || '',
        condition: listing.condition || 'second_hand',
        mileage: listing.mileage || '',
        price: listing.price || '',
        is_negotiable: listing.is_negotiable || false,
        description: listing.description || '',
        status: listing.status || 'published',
        stock_quantity: listing.stock_quantity || 1,
      });
      
      // Set existing images
      if (listing.images && listing.images.length > 0) {
        setExistingImages(listing.images);
        const primaryIndex = listing.images.findIndex(img => img.is_primary);
        if (primaryIndex !== -1) {
          setPrimaryImageIndex(primaryIndex);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load listing data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // For updates without new images, use regular JSON
      if (images.length === 0) {
        await api.put(`/listings/${id}`, formData);
      } else {
        // If there are new images, use FormData
        const submitData = new FormData();
        submitData.append('_method', 'PUT');
        
        Object.keys(formData).forEach(key => {
          if (key === 'is_negotiable') {
            submitData.append(key, formData[key] ? 1 : 0);
          } else if (formData[key] !== null && formData[key] !== '') {
            submitData.append(key, formData[key]);
          }
        });
        
        images.forEach((image, index) => {
          submitData.append('images[]', image);
          if (index === primaryImageIndex - existingImages.length) {
            submitData.append('primary_image_index', index);
          }
        });
        
        await api.post(`/listings/${id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      setSuccess('Listing updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating listing');
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    
    if (name === 'condition' && value === 'brand_new') {
      setFormData(prev => ({ ...prev, [name]: value, is_negotiable: false }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length + existingImages.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setError('');
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    
    if (primaryImageIndex === existingImages.length + index) {
      setPrimaryImageIndex(0);
    }
  };

  const removeExistingImage = async (imageId, index) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await api.delete(`/listings/${id}/images/${imageId}`);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      
      if (primaryImageIndex === index) {
        setPrimaryImageIndex(0);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Failed to delete image');
    }
  };

  const setPrimaryImage = (index) => {
    setPrimaryImageIndex(index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading listing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Listing</h1>
          <p className="text-gray-600">Update your motorcycle listing details</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          {/* Store Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FaStore className="inline mr-2" />
              Select Store *
            </label>
            <select
              name="store_id"
              value={formData.store_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a store</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2023 Honda Click 150i"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <select
                name="brand_id"
                value={formData.brand_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Click 150i"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Engine Displacement (cc) *</label>
              <input
                type="number"
                name="engine_displacement"
                value={formData.engine_displacement}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="brand_new">Brand New</option>
                <option value="second_hand">Second Hand</option>
              </select>
            </div>

            {formData.condition === 'second_hand' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage (km)</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₱) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">₱</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Negotiable */}
          {formData.condition === 'second_hand' && (
            <div className="mb-6 flex items-center space-x-2 bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
              <input
                type="checkbox"
                name="is_negotiable"
                checked={formData.is_negotiable}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                id="negotiable"
              />
              <label htmlFor="negotiable" className="text-sm font-semibold text-gray-700 cursor-pointer">
                Price is negotiable
              </label>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe the motorcycle's condition, features, and any additional information..."
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Current Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={`http://localhost:8000/storage/${image.image_path}`}
                      alt={`Existing ${index + 1}`}
                      className={`w-full h-32 object-cover rounded-xl ${
                        primaryImageIndex === index ? 'ring-4 ring-blue-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id, index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes />
                    </button>
                    {primaryImageIndex === index && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                        <FaStar className="inline mr-1" />
                        Primary
                      </div>
                    )}
                    {primaryImageIndex !== index && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="absolute bottom-2 left-2 bg-white text-gray-700 px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <FaImage className="inline mr-2" />
              Add New Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="block w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <FaImage className="text-4xl text-gray-400 mx-auto mb-2" />
              <span className="text-gray-600">Click to add more images</span>
            </label>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Listing'}
            </button>
            <Link
              to="/dashboard"
              className="flex-1 bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
