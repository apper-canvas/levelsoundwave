import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  ExternalLink, 
  Clock,
  Calendar,
  Music,
  Users,
  ChevronLeft,
  Instagram,
  Twitter,
  Globe
} from 'lucide-react'
import { toast } from 'react-toastify'
import artistService from '@/services/api/artistService'

const ArtistDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [artist, setArtist] = useState(null)
  const [topTracks, setTopTracks] = useState([])
  const [discography, setDiscography] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFullBio, setShowFullBio] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [following, setFollowing] = useState(false)

  useEffect(() => {
    loadArtistData()
  }, [id])

  const loadArtistData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [artistData, tracksData, discographyData] = await Promise.all([
        artistService.getById(id),
        artistService.getTopTracks(id),
        artistService.getDiscography(id)
      ])
      
      if (!artistData) {
        setError('Artist not found')
        return
      }
      
      setArtist(artistData)
      setTopTracks(tracksData)
      setDiscography(discographyData)
    } catch (err) {
      setError('Failed to load artist data')
      console.error('Error loading artist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      setIsPlaying(false)
      toast.info(`Paused: ${track.title}`)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
      toast.success(`Now Playing: ${track.title} by ${track.artist}`)
    }
  }

  const handleFollow = () => {
    setFollowing(!following)
    toast.success(following ? 'Unfollowed artist' : 'Following artist')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artist.name,
        text: `Check out ${artist.name} on SoundWave`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5" />
      case 'twitter': return <Twitter className="w-5 h-5" />
      case 'website': return <Globe className="w-5 h-5" />
      default: return <ExternalLink className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The artist you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-light px-6 py-3 rounded-full font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={artist.coverImage}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Artist Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end gap-6">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {artist.verified && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm font-medium">Verified Artist</span>
              </div>
              <h1 className="text-5xl font-bold mb-4">{artist.name}</h1>
              <div className="flex items-center gap-6 text-gray-300">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatNumber(artist.followers)} followers
                </span>
                <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 py-6 flex items-center gap-4">
        <button
          onClick={handleFollow}
          className={`px-8 py-3 rounded-full font-semibold transition-colors ${
            following 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-primary hover:bg-primary-light text-black'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
        <button
          onClick={handleShare}
          className="p-3 rounded-full border border-gray-600 hover:border-white transition-colors"
          aria-label="Share artist"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div className="glassmorphism rounded-xl p-6">
                <p className="text-gray-300 leading-relaxed">
                  {showFullBio ? artist.biography : `${artist.biography.substring(0, 300)}...`}
                </p>
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-primary hover:text-primary-light mt-3 font-medium transition-colors"
                >
                  {showFullBio ? 'Show less' : 'Show more'}
                </button>
              </div>
            </section>

            {/* Top Tracks */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Popular</h2>
              <div className="space-y-2">
                {topTracks.map((track, index) => (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group track-hover-glow rounded-lg p-4 flex items-center gap-4"
                  >
                    <span className="text-gray-400 w-4 text-sm">{index + 1}</span>
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="w-10 h-10 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Play ${track.title}`}
                    >
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-5 h-5 text-black" />
                      ) : (
                        <Play className="w-5 h-5 text-black ml-0.5" />
                      )}
                    </button>
                    <img
                      src={track.albumCover}
                      alt={track.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{formatNumber(track.plays)} plays</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {track.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Discography */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Discography</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {discography.map((album, index) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group glassmorphism rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <img
                        src={album.image}
                        alt={album.title}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      <button
                        className="absolute bottom-2 right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        aria-label={`Play ${album.title}`}
                      >
                        <Play className="w-6 h-6 text-black ml-0.5" />
                      </button>
                    </div>
                    <h3 className="font-semibold mb-1 truncate">{album.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{album.year}</span>
                      <span>•</span>
                      <span>{album.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        {album.trackCount} tracks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {album.duration}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Genres */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </section>

            {/* Social Links */}
            {artist.socialLinks && (
              <section>
                <h3 className="text-lg font-semibold mb-3">Follow</h3>
                <div className="space-y-2">
                  {Object.entries(artist.socialLinks).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 glassmorphism rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {getSocialIcon(platform)}
                      <span className="capitalize">{platform}</span>
                      <ExternalLink className="w-4 h-4 ml-auto" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Stats */}
            <section>
              <h3 className="text-lg font-semibold mb-3">Stats</h3>
              <div className="glassmorphism rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Followers</span>
                  <span className="font-medium">{formatNumber(artist.followers)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Listeners</span>
                  <span className="font-medium">{formatNumber(artist.monthlyListeners)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Albums</span>
                  <span className="font-medium">{discography.length}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistDetail