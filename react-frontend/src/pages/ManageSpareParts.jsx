import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  FaPlus, FaEdit, FaTrash, FaBox, FaSearch, FaFilter,
  FaImage, FaTimes, FaCheck, FaExclamationTriangle
} from 'react-icons/fa';

const ManageSpareParts = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const fetchData = async () => {
    try {
      console.log('Fetching data for store:', storeId);
      const [storeRes, partsRes] = await Promise.all([
        api.get(`/stores/${storeId}`),
        api.get(`/spare-parts?store_id=${storeId}`)
      ]);
      
      console.log('Store response:', storeRes.data);
      console.log('Parts response:', partsRes.data);
      
      setStore(storeRes.data.store || storeRes.data);
      setSpareParts(partsRes.data.data || partsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      // Set empty arrays on error
      setSpareParts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spare part?')) return;
    
    try {
      await api.delete(`/spare-parts/${id}`);
      setSpareParts(spareParts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting spare part:', error);
      alert('Failed to delete spare part');
    }
  };

  const filteredParts = spareParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.part_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || part.spare_part_category_id === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="compact-page flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="compact-page overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Spare Parts Inventory</h1>
              <p className="text-gray-600 mt-1">{store?.name}</p>
            </div>
            <button
              onClick={() => {
                setEditingPart(null);
                setShowAddModal(true);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl"
            >
              <FaPlus />
              <span>Add Spare Part</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or part number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {filteredParts.length} part{filteredParts.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spare Parts Grid */}
        {filteredParts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <div key={part.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  {part.image ? (
                    <img
                      src={`http://localhost:8000/storage/${part.image}`}
                      alt={part.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="text-6xl text-gray-400" />
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      part.stock_quantity > 10 ? 'bg-green-500 text-white' :
                      part.stock_quantity > 0 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {part.stock_quantity > 0 ? `${part.stock_quantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{part.name}</h3>
                    {part.part_number && (
                      <p className="text-sm text-gray-500">Part #: {part.part_number}</p>
                    )}
                    {part.brand && (
                      <p className="text-sm text-gray-600">Brand: {part.brand}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-2xl font-black text-green-600">
                      ₱{parseFloat(part.price).toLocaleString()}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                      part.condition === 'new' ? 'bg-blue-100 text-blue-800' :
                      part.condition === 'used' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {part.condition}
                    </span>
                  </div>

                  {part.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{part.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingPart(part);
                        setShowAddModal(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(part.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Spare Parts Yet</h2>
            <p className="text-gray-600 mb-6">Start building your spare parts inventory</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus />
              <span>Add Your First Spare Part</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <SparePartModal
          part={editingPart}
          storeId={storeId}
          onClose={() => {
            setShowAddModal(false);
            setEditingPart(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingPart(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

// Spare Part Modal Component
const SparePartModal = ({ part, storeId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: part?.name || '',
    part_number: part?.part_number || '',
    description: part?.description || '',
    price: part?.price || '',
    stock_quantity: part?.stock_quantity || '',
    brand: part?.brand || '',
    condition: part?.condition || 'new',
    compatible_models: part?.compatible_models || [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(part?.image ? `http://localhost:8000/storage/${part.image}` : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('store_id', storeId);
      
      // Add all form fields
      submitData.append('name', formData.name);
      submitData.append('price', formData.price);
      submitData.append('stock_quantity', formData.stock_quantity);
      submitData.append('condition', formData.condition);
      
      // Optional fields
      if (formData.part_number) submitData.append('part_number', formData.part_number);
      if (formData.brand) submitData.append('brand', formData.brand);
      if (formData.description) submitData.append('description', formData.description);
      
      // Image
      if (image) {
        submitData.append('image', image);
      }

      let response;
      if (part) {
        // For update, use POST with _method=PUT
        submitData.append('_method', 'PUT');
        response = await api.post(`/spare-parts/${part.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // For create
        response = await api.post('/spare-parts', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      console.log('Success:', response.data);
      onSuccess();
    } catch (error) {
      console.error('Error saving spare part:', error);
      console.error('Error response:', error.response?.data);
      
      // Better error message
      let errorMessage = 'Failed to save spare part. ';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage += Object.keys(errors).map(key => errors[key].join(', ')).join('; ');
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {part ? 'Edit Spare Part' : 'Add Spare Part'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-600 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                />
              )}
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition">
                <FaImage className="text-4xl text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Part Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Brake Pads, Oil Filter"
            />
          </div>

          {/* Part Number and Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Part Number
              </label>
              <input
                type="text"
                value={formData.part_number}
                onChange={(e) => setFormData({...formData, part_number: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., BP-001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Brembo, NGK"
              />
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₱) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Condition *
            </label>
            <select
              required
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the spare part, its features, and compatibility..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaCheck />
                  <span>{part ? 'Update' : 'Add'} Spare Part</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageSpareParts;
