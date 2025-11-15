import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { FaImage, FaTimes, FaStar, FaMotorcycle, FaCheckCircle, FaStore } from 'react-icons/fa';

const CreateListing = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
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
  }, []);

  const fetchData = async () => {
    try {
      const [storesRes, brandsRes] = await Promise.all([
        api.get('/my-stores'),
        api.get('/brands'),
      ]);
      setStores(storesRes.data);
      setBrands(brandsRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        // Handle is_negotiable explicitly as boolean (0 or 1)
        if (key === 'is_negotiable') {
          submitData.append(key, formData[key] ? 1 : 0);
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Append images
      images.forEach((image, index) => {
        submitData.append('images[]', image);
        // Mark primary image
        if (index === primaryImageIndex) {
          submitData.append('primary_image_index', index);
        }
      });
      
      await api.post('/listings', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSuccess('Listing created successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating listing');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const name = e.target.name;
    
    // If condition changes to brand_new, set is_negotiable to false
    if (name === 'condition' && value === 'brand_new') {
      setFormData({ ...formData, [name]: value, is_negotiable: false });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count (max 10 images)
    if (images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    
    // Validate each file
    const validFiles = [];
    const newPreviews = [];
    
    for (const file of files) {
      // Check file size (max 2MB per image)
      if (file.size > 2 * 1024 * 1024) {
        setError(`${file.name} is too large. Max 2MB per image.`);
        continue;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file.`);
        continue;
      }
      
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    
    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setError('');
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    
    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(primaryImageIndex - 1);
    }
  };

  const setPrimaryImage = (index) => {
    setPrimaryImageIndex(index);
  };

  const generateDescription = () => {
    const { brand_id, model, year, engine_displacement, condition, mileage, price, is_negotiable } = formData;
    
    // Get brand name
    const brandName = brands.find(b => b.id === parseInt(brand_id))?.name || 'Motorcycle';
    const storeName = stores.find(s => s.id === parseInt(formData.store_id))?.name || 'our store';
    
    // Build natural, conversational description
    let description = '';
    
    // Opening - attention grabber
    if (condition === 'brand_new') {
      description += `Looking for a brand new ${year} ${brandName} ${model}? You've found it! `;
      description += `This stunning ${engine_displacement}cc motorcycle just arrived at ${storeName} with zero kilometers on the odometer. `;
      description += `It comes with full manufacturer warranty and all the latest features you'd expect from a ${year} model.\n\n`;
    } else {
      const mileageText = mileage ? ` with only ${parseInt(mileage).toLocaleString()} km` : '';
      description += `Check out this beautiful ${year} ${brandName} ${model}${mileageText}! `;
      description += `This ${engine_displacement}cc motorcycle has been well-maintained and is in excellent running condition. `;
      description += `Perfect for riders looking for reliability and performance without breaking the bank.\n\n`;
    }
    
    // Key details in natural language
    if (condition === 'brand_new') {
      description += `What makes this special? It's completely untouched, straight from the factory. `;
      description += `You'll be the first owner, and everything is covered under warranty. `;
      description += `All documentation is complete and ready for registration.\n\n`;
    } else {
      description += `This bike has been regularly serviced and maintained. `;
      description += `The engine runs smoothly, all papers are clean and complete. `;
      
      if (mileage && parseInt(mileage) < 10000) {
        description += `With such low mileage, it's practically like new! `;
      } else if (mileage && parseInt(mileage) < 30000) {
        description += `The mileage is reasonable and the bike has plenty of life left. `;
      }
      
      description += `No major accidents or repairs needed.\n\n`;
    }
    
    // Price and negotiation
    const formattedPrice = parseInt(price).toLocaleString();
    if (is_negotiable && condition === 'second_hand') {
      description += `Priced at ₱${formattedPrice}, and we're open to reasonable offers for serious buyers. `;
    } else {
      description += `Priced at ₱${formattedPrice}. `;
    }
    
    // Call to action
    description += `Ready to take it for a spin? `;
    
    if (condition === 'second_hand') {
      description += `We welcome inspections - bring your mechanic if you'd like! `;
    }
    
    description += `Visit us at ${storeName} or contact us to schedule a viewing. `;
    description += `Don't let this opportunity ride away! 🏍️`;
    
    return description;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <FaMotorcycle className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Create Motorcycle Listing</h1>
          </div>
          <p className="text-gray-600 text-lg">Add your motorcycle to reach potential buyers</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <FaCheckCircle className="mr-2" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

      {/* No Stores Warning */}
      {stores.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 px-6 py-4 rounded-lg mb-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-bold mb-2">No Store Found</h3>
              <p className="mb-3">You need to create a store before you can add motorcycle listings.</p>
              <Link
                to="/stores/create"
                className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-all"
              >
                <FaStore />
                <span>Create Your Store</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl">
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Store * (Your Stores Only)</label>
            <select name="store_id" value={formData.store_id} onChange={handleChange} required disabled={stores.length === 0} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed">
              <option value="">Select Your Store</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">You can only add motorcycles to stores you own</p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., 2023 Honda CBR 150R - Excellent Condition"
            />
          </div>
        </div>

        {/* Motorcycle Images */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Motorcycle Images</h2>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-700">
              <strong>📸 Photo Tips:</strong> Add multiple high-quality photos from different angles. The first image will be the main photo shown in search results.
            </p>
          </div>

          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="images-upload"
            />
            <label htmlFor="images-upload" className="cursor-pointer">
              <FaImage className="mx-auto text-5xl text-gray-400 mb-3" />
              <p className="text-gray-600 font-semibold mb-1">Click to upload images</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 2MB each (Max 10 images)</p>
              <p className="text-xs text-gray-400 mt-2">{images.length}/10 images uploaded</p>
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`}
                    className={`w-full h-32 object-cover rounded-xl border-2 ${
                      index === primaryImageIndex 
                        ? 'border-blue-500 ring-2 ring-blue-300' 
                        : 'border-gray-300'
                    } shadow-md`}
                  />
                  
                  {/* Primary Badge */}
                  {index === primaryImageIndex && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
                      <FaStar />
                      <span>Main</span>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    {index !== primaryImageIndex && (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all"
                        title="Set as main image"
                      >
                        <FaStar />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  {/* Image Number */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Motorcycle Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Motorcycle Details</h2>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
            <select name="brand_id" value={formData.brand_id} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Model *</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., CBR 150R" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Year *</label>
            <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Engine Displacement (cc) *</label>
            <input type="number" name="engine_displacement" value={formData.engine_displacement} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., 150" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Condition *</label>
            <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option value="brand_new">Brand New</option>
              <option value="second_hand">Second Hand</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mileage (km)</label>
            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="e.g., 5000" />
          </div>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                placeholder="85,000" 
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter price in Philippine Peso (PHP)</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              placeholder="1" 
            />
            <p className="text-xs text-gray-500 mt-1">Number of units available (set to 0 if out of stock)</p>
          </div>
        </div>
        
        {/* Negotiable checkbox - only for second-hand motorcycles */}
        {formData.condition === 'second_hand' && (
          <div className="flex items-center space-x-2 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
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

        {/* Info message for brand new motorcycles */}
        {formData.condition === 'brand_new' && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-700">
              <strong>ℹ️ Note:</strong> Brand new motorcycles have fixed prices and are not negotiable.
            </p>
          </div>
        )}
        </div>

        {/* Description */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-2xl font-bold text-gray-900">Description</h2>
            <button
              type="button"
              onClick={() => {
                const generatedDesc = generateDescription();
                setFormData({ ...formData, description: generatedDesc });
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
            >
              <FaStar />
              <span>Auto-Generate</span>
            </button>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <p className="text-sm text-gray-700">
              <strong>✨ Auto-Generate:</strong> Click the button above to automatically create a professional description based on your motorcycle details. You can edit it afterwards!
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
              rows="6"
              placeholder="Describe the motorcycle's condition, features, modifications, service history, etc..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">
              {formData.description.length} characters
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading || images.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Creating Listing...</span>
              </div>
            ) : images.length === 0 ? (
              'Please add at least one image'
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Tips for a Great Listing:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Photos:</strong> Add 5-10 clear photos from different angles (front, back, sides, engine, odometer)</li>
          <li>• <strong>Title:</strong> Include year, brand, model, and key features</li>
          <li>• <strong>Description:</strong> Mention condition, service history, modifications, and reason for selling</li>
          <li>• <strong>Price:</strong> Research similar motorcycles to set a competitive price</li>
          <li>• <strong>Honesty:</strong> Be transparent about any issues or defects</li>
        </ul>
      </div>
      </div>
    </div>
  );
};

export default CreateListing;
