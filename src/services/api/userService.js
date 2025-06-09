// Mock user authentication and profile service
let currentUser = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@soundwave.com',
  avatar: null,
  isLoggedIn: true,
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoplay: true,
    highQuality: false
  },
  subscription: {
    type: 'premium',
    expiresAt: '2024-12-31'
  },
  stats: {
    totalListeningTime: '1,247 hours',
    favoriteGenre: 'Electronic',
    topArtist: 'Daft Punk'
  }
}

let isAuthenticated = true

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }
    
    return { ...currentUser }
  },

  // Check authentication status
  isAuthenticated: async () => {
    await new Promise(resolve => setTimeout(resolve, 100))
    return isAuthenticated
  },

  // Login user
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock login validation
    if (email === 'demo@soundwave.com' && password === 'demo123') {
      isAuthenticated = true
      currentUser.email = email
      return { ...currentUser }
    }
    
    throw new Error('Invalid credentials')
  },

  // Logout user
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    isAuthenticated = false
    return { success: true }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }
    
    currentUser = {
      ...currentUser,
      ...profileData,
      id: currentUser.id // Preserve ID
    }
    
    return { ...currentUser }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    if (!isAuthenticated) {
      throw new Error('User not authenticated')
    }
    
    currentUser.preferences = {
      ...currentUser.preferences,
      ...preferences
    }
    
    return { ...currentUser }
  },

  // Get user initials for avatar fallback
  getUserInitials: (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }
}

export default userService