import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaMapMarkerAlt, FaCheck, FaTimes, FaClock, FaPhone, FaEnvelope,
  FaUser, FaFilter, FaSearch, FaEye
} from 'react-icons/fa';

const AdminLocationSuggestions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchSuggestions();
  }, [user, navigate]);

  useEffect(() => {
    filterSuggestions();
  }, [suggestions, statusFilter, searchTerm]);

  const fetchSuggestions = async () => {
    try {
      const response = await api.get('/location-suggestions');
      setSuggestions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuggestions = () => {
    let filtered = suggestions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.suggested_by_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSuggestions(filtered);
  };

  const handleApprove = async (id) => {
    if (!confirm('Are you sure you want to approve this suggestion and create a store?')) return;

    setProcessing(true);
    try {
      await api.post(`/location-suggestions/${id}/approve`, { admin_notes: adminNotes });
      alert('Location approved and store created successfully!');
      setSelectedSuggestion(null);
      setAdminNotes('');
      fetchSuggestions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving suggestion');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to reject this suggestion?')) return;

    setProcessing(true);
    try {
      await api.post(`/location-suggestions/${id}/reject`, { admin_notes: adminNotes });
      alert('Location suggestion rejected');
      setSelectedSuggestion(null);
      setAdminNotes('');
      fetchSuggestions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting suggestion');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status] || styles.pending;
  };

  const getShopTypeIcon = (type) => {
    return type === 'vulcanizing_shop' ? '🔧' : '⛽';
  };

  const getShopTypeLabel = (type) => {
    return type === 'vulcanizing_shop' ? 'Vulcanizing Shop' : 'Gas Station';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
              <FaMapMarkerAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Location Suggestions</h1>
          </div>
          <p className="text-gray-600 text-lg">Review and approve community-submitted locations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, city, or suggester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {suggestions.filter(s => s.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {suggestions.filter(s => s.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Approved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {suggestions.filter(s => s.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">Rejected</p>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="space-y-4">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Side - Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-3xl">{getShopTypeIcon(suggestion.shop_type)}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{suggestion.name}</h3>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(suggestion.status)}`}>
                          {suggestion.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Type</p>
                        <p className="font-semibold text-gray-900">{getShopTypeLabel(suggestion.shop_type)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <p className="font-semibold text-gray-900">{suggestion.city}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-semibold text-gray-900">{suggestion.address}</p>
                      </div>
                      {suggestion.phone && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="font-semibold text-gray-900 flex items-center">
                            <FaPhone className="mr-2 text-blue-600" />
                            {suggestion.phone}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {suggestion.latitude}, {suggestion.longitude}
                        </p>
                      </div>
                    </div>

                    {suggestion.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Description</p>
                        <p className="text-gray-700">{suggestion.description}</p>
                      </div>
                    )}

                    {/* Suggester Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Suggested By:</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <FaUser className="mr-2" />
                          {suggestion.suggested_by_name}
                        </span>
                        <span className="flex items-center">
                          <FaEnvelope className="mr-2" />
                          {suggestion.suggested_by_email}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-2" />
                          {new Date(suggestion.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {suggestion.admin_notes && (
                      <div className="mt-4 bg-blue-50 rounded-xl p-4">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Admin Notes:</p>
                        <p className="text-sm text-blue-700">{suggestion.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Actions */}
                  {suggestion.status === 'pending' && (
                    <div className="lg:w-64 space-y-4">
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${suggestion.latitude},${suggestion.longitude}`;
                          window.open(url, '_blank');
                        }}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-all"
                      >
                        <FaEye />
                        <span>View on Map</span>
                      </button>

                      <textarea
                        placeholder="Admin notes (optional)..."
                        value={selectedSuggestion === suggestion.id ? adminNotes : ''}
                        onChange={(e) => {
                          setSelectedSuggestion(suggestion.id);
                          setAdminNotes(e.target.value);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        rows="3"
                      ></textarea>

                      <button
                        onClick={() => handleApprove(suggestion.id)}
                        disabled={processing}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg"
                      >
                        <FaCheck />
                        <span>{processing ? 'Processing...' : 'Approve & Create Store'}</span>
                      </button>

                      <button
                        onClick={() => handleReject(suggestion.id)}
                        disabled={processing}
                        className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                      >
                        <FaTimes />
                        <span>{processing ? 'Processing...' : 'Reject'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No suggestions found</p>
              <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLocationSuggestions;
