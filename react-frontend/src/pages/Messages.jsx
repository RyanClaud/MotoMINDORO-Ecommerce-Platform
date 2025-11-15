import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  FaComments, FaPaperPlane, FaUser, FaMotorcycle, 
  FaSpinner, FaArrowLeft, FaCircle
} from 'react-icons/fa';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchConversations();
    
    // Check if there's a user_id in URL params (from listing page)
    const userId = searchParams.get('user');
    const listingId = searchParams.get('listing');
    if (userId && listingId) {
      initializeConversation(parseInt(userId), parseInt(listingId));
    }
  }, [user, navigate, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      
      // Group messages by conversation
      const convos = {};
      response.data.data.forEach(msg => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!convos[otherId]) {
          convos[otherId] = {
            user: msg.sender_id === user.id ? msg.receiver : msg.sender,
            lastMessage: msg,
            unread: msg.receiver_id === user.id && !msg.is_read ? 1 : 0,
            listing: msg.listing
          };
        } else {
          if (!msg.is_read && msg.receiver_id === user.id) {
            convos[otherId].unread++;
          }
        }
      });
      
      setConversations(Object.values(convos));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeConversation = async (userId, listingId) => {
    try {
      // Fetch user and listing details
      const [userResponse, listingResponse] = await Promise.all([
        api.get(`/users/${userId}`),
        api.get(`/listings/${listingId}`)
      ]);

      const seller = userResponse.data;
      const listing = listingResponse.data;

      // Create conversation object
      const conversation = {
        user: seller,
        lastMessage: null,
        unread: 0,
        listing: listing
      };

      setSelectedConversation(conversation);
      
      // Load existing messages
      loadConversation(userId, listingId);
    } catch (error) {
      console.error('Error initializing conversation:', error);
      // If user endpoint doesn't exist, try to load conversation anyway
      loadConversation(userId, listingId);
    }
  };

  const loadConversation = async (userId, listingId = null) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      setMessages(response.data);
      
      // Find or create conversation object
      const existingConvo = conversations.find(c => c.user.id === userId);
      if (existingConvo) {
        setSelectedConversation(existingConvo);
      } else if (!selectedConversation) {
        // Fetch user details if not in conversations
        try {
          const userResponse = await api.get(`/users/${userId}`);
          setSelectedConversation({
            user: userResponse.data,
            lastMessage: null,
            unread: 0,
            listing: listingId ? { id: listingId } : null
          });
        } catch (error) {
          // Fallback if user endpoint doesn't exist
          setSelectedConversation({
            user: { id: userId, name: 'User' },
            lastMessage: null,
            unread: 0,
            listing: listingId ? { id: listingId } : null
          });
        }
      }
      
      // Refresh conversations to update unread count
      fetchConversations();
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await api.post('/messages', {
        receiver_id: selectedConversation.user.id,
        motorcycles_listing_id: selectedConversation.listing?.id || null,
        message: newMessage
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <FaComments className="mr-3" />
                  Messages
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-4xl text-blue-600" />
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <FaComments className="text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h3>
                    <p className="text-gray-600">
                      Start a conversation by messaging a seller from a listing
                    </p>
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <div
                      key={convo.user.id}
                      onClick={() => loadConversation(convo.user.id)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
                        selectedConversation?.user.id === convo.user.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {convo.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{convo.user.name}</h3>
                            {convo.unread > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {convo.unread}
                              </span>
                            )}
                          </div>
                          {convo.listing && (
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                              <FaMotorcycle className="mr-1" />
                              <span className="truncate">About a listing</span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 truncate">
                            {convo.lastMessage?.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(convo.lastMessage?.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden text-gray-600 hover:text-gray-900"
                      >
                        <FaArrowLeft className="text-xl" />
                      </button>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedConversation.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{selectedConversation.user.name}</h3>
                        <div className="flex items-center text-xs text-green-600">
                          <FaCircle className="mr-1" style={{ fontSize: '6px' }} />
                          <span>Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Listing Context */}
                    {selectedConversation.listing && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <FaMotorcycle className="text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">
                              Discussing: {selectedConversation.listing.title || 'Motorcycle Listing'}
                            </p>
                            {selectedConversation.listing.price && (
                              <p className="text-sm text-blue-700">
                                ₱{selectedConversation.listing.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => navigate(`/listings/${selectedConversation.listing.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FaComments className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">
                          No messages yet. Start the conversation!
                        </p>
                        {selectedConversation.listing && (
                          <div className="mt-4 space-y-2">
                            <button
                              onClick={() => setNewMessage('Is this motorcycle still available?')}
                              className="block w-full text-sm bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                            >
                              Is this still available?
                            </button>
                            <button
                              onClick={() => setNewMessage('Can I schedule a viewing?')}
                              className="block w-full text-sm bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                            >
                              Schedule viewing
                            </button>
                            <button
                              onClick={() => setNewMessage('Is the price negotiable?')}
                              className="block w-full text-sm bg-white hover:bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 transition-colors"
                            >
                              Price negotiable?
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                msg.sender_id === user.id
                                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                  : 'bg-white text-gray-900 shadow-md'
                              }`}
                            >
                              <p className="break-words">{msg.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <form onSubmit={sendMessage} className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={
                          selectedConversation.listing
                            ? `Ask about ${selectedConversation.listing.title || 'this motorcycle'}...`
                            : 'Type your message...'
                        }
                        disabled={sending}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {sending ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaPaperPlane />
                        )}
                        <span>{sending ? 'Sending...' : 'Send'}</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Conversation</h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
