import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Play, Pause, SkipBack, SkipForward, Volume2, Moon, Sun, Heart, Plus, Music, Mic2, Clock, TrendingUp, Loader, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { trackService } from '@/services/api/trackService'
import albumService from '@/services/api/albumService'
import { playlistService } from '@/services/api/playlistService'
import ProfileButton from '@/components/ProfileButton'
import MainFeature from '@/components/MainFeature'

const ApperIcon = ({ name, ...props }) => {
  const icons = {
    Loader,
    AlertCircle,
    Music,
    Home: Music,
    Search,
    ListMusic: Music,
    Sun,
    Moon,
    Play
  }
  const IconComponent = icons[name] || Music
  return <IconComponent {...props} />
}
const Home = ({ toggleDarkMode, darkMode }) => {
  const [tracks, setTracks] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [tracksResult, playlistsResult] = await Promise.all([
          trackService.getAll(),
          playlistService.getAll()
        ])
        setTracks(tracksResult)
        setPlaylists(playlistsResult)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredTracks = tracks.filter(track =>
    track?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track?.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track?.album?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarItems = [
    { id: 'home', icon: 'Home', label: 'Home' },
    { id: 'search', icon: 'Search', label: 'Search' },
    { id: 'library', icon: 'ListMusic', label: 'Your Library' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Loader" className="animate-spin w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-gray-400">Loading your music...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        className="w-60 bg-secondary fixed h-full left-0 top-0 p-6 flex flex-col"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ApperIcon name="Music" size={28} />
            SoundWave
          </h1>
        </div>

        <nav className="space-y-2 mb-8">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                activeSection === item.id 
                  ? 'bg-primary text-black' 
                  : 'text-gray-400 hover:text-white hover:bg-surface-800'
              }`}
            >
              <ApperIcon name={item.icon} size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-800 pt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
            Playlists
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {playlists?.map(playlist => (
              <button
                key={playlist.id}
                className="w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-surface-800 rounded-lg transition-all"
              >
                {playlist.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-800">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={16} />
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 ml-60">
{/* Top Bar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Music className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">SoundWave</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Profile Button */}
              <ProfileButton />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {activeSection === 'home' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Recently Played</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tracks?.slice(0, 12).map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-surface-800 p-4 rounded-lg cursor-pointer hover:bg-surface-700 transition-all"
                    >
                      <img 
                        src={track.coverUrl || '/placeholder-cover.jpg'} 
                        alt={track.album}
                        className="w-full aspect-square object-cover rounded-lg mb-3"
                      />
                      <h4 className="font-semibold text-sm truncate">{track.title}</h4>
                      <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          {activeSection === 'search' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse All'}
              </h3>
              <div className="space-y-2">
                {(searchQuery ? filteredTracks : tracks)?.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-lg track-hover-glow group cursor-pointer"
                  >
<div className="relative">
                      <img 
                        src={track.coverUrl || '/placeholder-cover.jpg'} 
                        alt={track.album || 'Track cover'}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                        <ApperIcon name="Play" className="text-white" size={20} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{track.title || 'Unknown Title'}</h4>
                      <p className="text-gray-400 text-sm">{track.artist || 'Unknown Artist'}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{track.album || 'Unknown Album'}</p>
                    <p className="text-gray-400 text-sm">
                      {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'library' && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Library</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists?.map(playlist => (
                  <motion.div
                    key={playlist.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-surface-800 p-6 rounded-xl cursor-pointer hover:bg-surface-700 transition-all"
>
                    <img 
                      src={playlist.coverUrl || '/placeholder-playlist.jpg'} 
                      alt={playlist.name || 'Playlist cover'}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-semibold mb-2">{playlist.name || 'Untitled Playlist'}</h4>
                    <p className="text-gray-400 text-sm">{playlist.tracks?.length || 0} tracks</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Music Player */}
        <MainFeature tracks={tracks} />
      </div>
    </div>
  )
}

export default Home