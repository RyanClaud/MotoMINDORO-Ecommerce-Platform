/**
 * Generate a beautiful auto-generated banner for a store
 * Returns a React component with gradient background and store name
 */

const generateStoreBanner = (storeName, shopType = 'motorcycle_shop') => {
  // Generate a consistent color based on store name
  const getGradientColors = (name, type) => {
    // Different gradient sets based on shop type
    const gradients = {
      motorcycle_shop: [
        'from-blue-600 via-indigo-600 to-purple-600',
        'from-cyan-500 via-blue-600 to-indigo-700',
        'from-indigo-600 via-purple-600 to-pink-600',
        'from-blue-700 via-indigo-800 to-purple-900',
      ],
      vulcanizing_shop: [
        'from-orange-500 via-red-500 to-pink-600',
        'from-amber-600 via-orange-600 to-red-600',
        'from-yellow-500 via-orange-600 to-red-700',
        'from-orange-600 via-red-600 to-rose-700',
      ],
      gasoline_station: [
        'from-red-600 via-rose-600 to-pink-600',
        'from-rose-500 via-red-600 to-pink-700',
        'from-red-700 via-rose-700 to-pink-800',
        'from-pink-600 via-red-600 to-rose-700',
      ],
    };

    const typeGradients = gradients[type] || gradients.motorcycle_shop;
    
    // Use store name to consistently pick a gradient
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return typeGradients[hash % typeGradients.length];
  };

  // Get icon based on shop type
  const getShopIcon = (type) => {
    switch (type) {
      case 'vulcanizing_shop':
        return '🔧';
      case 'gasoline_station':
        return '⛽';
      case 'motorcycle_shop':
      default:
        return '🏍️';
    }
  };

  // Get initials from store name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
  };

  const gradient = getGradientColors(storeName, shopType);
  const icon = getShopIcon(shopType);
  const initials = getInitials(storeName);

  return {
    gradient,
    icon,
    initials,
    storeName
  };
};

export default generateStoreBanner;
