import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Settings, Crown, Clock, Music, Heart } from 'lucide-react'
import { toast } from 'react-toastify'
import { userService } from '@/services/api/userService'

const UserProfile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const userData = await userService.getCurrentUser()
      setUser(userData)
      setFormData({
        name: userData.name,
        email: userData.email
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Error loading profile')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      const updatedUser = await userService.updateProfile(formData)
      setUser(updatedUser)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    })
    setIsEditing(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-4">Unable to load user profile</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary hover:bg-primary-light rounded-lg transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                userService.getUserInitials(user.name)
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-sm font-medium bg-primary px-2 py-1 rounded-full">
                  Profile
                </span>
                {user.subscription?.type === 'premium' && (
                  <span className="flex items-center text-yellow-400 text-sm">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold mb-4">{user.name}</h1>
              <p className="text-gray-400 text-lg">{user.email}</p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-transparent border border-gray-600 hover:border-white rounded-full transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="glassmorphism rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <User className="w-6 h-6 mr-3" />
                Profile Information
              </h2>

              {isEditing ? (
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-primary hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                      {user.name}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-800 rounded-lg text-white">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats & Info */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                Subscription
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="capitalize font-medium">{user.subscription?.type}</span>
                </div>
                {user.subscription?.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expires</span>
                    <span>{user.subscription.expiresAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Listening Stats */}
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Listening Time</span>
                  <span className="font-medium">{user.stats?.totalListeningTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Favorite Genre</span>
                  <span className="font-medium">{user.stats?.favoriteGenre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Top Artist</span>
                  <span className="font-medium">{user.stats?.topArtist}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glassmorphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => toast.info('Preferences coming soon!')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Manage Preferences
                </button>
                <button
                  onClick={() => toast.info('Privacy settings coming soon!')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Privacy Settings
                </button>
                <button
                  onClick={() => toast.info('Download data coming soon!')}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Download Your Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile