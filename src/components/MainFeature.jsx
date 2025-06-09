import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const MainFeature = ({ tracks }) => {
  const [currentTrack, setCurrentTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [queue, setQueue] = useState([])
  const [showQueue, setShowQueue] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState('off') // off, all, one
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    if (tracks?.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0])
      setQueue(tracks.slice(1))
    }
  }, [tracks, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const handleEnded = () => {
      handleNext()
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  const togglePlay = () => {
    if (!currentTrack) return
    
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (!queue.length) {
      if (repeat === 'all' && tracks?.length > 0) {
        const currentIndex = tracks.findIndex(t => t.id === currentTrack.id)
        const nextIndex = (currentIndex + 1) % tracks.length
        setCurrentTrack(tracks[nextIndex])
        const newQueue = [...tracks.slice(nextIndex + 1), ...tracks.slice(0, nextIndex)]
        setQueue(newQueue)
      } else {
        setIsPlaying(false)
      }
      return
    }

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length)
      const nextTrack = queue[randomIndex]
      setCurrentTrack(nextTrack)
      setQueue(prev => prev.filter((_, index) => index !== randomIndex))
    } else {
      const nextTrack = queue[0]
      setCurrentTrack(nextTrack)
      setQueue(prev => prev.slice(1))
    }
    toast.success(`Now playing: ${queue[0]?.title || 'Next track'}`)
  }

  const handlePrevious = () => {
    if (!tracks?.length) return
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
    setCurrentTrack(tracks[prevIndex])
    toast.info(`Previous: ${tracks[prevIndex]?.title}`)
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !currentTrack) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = (clickX / rect.width) * 100
    const newTime = (percentage / 100) * audioRef.current.duration
    
    audioRef.current.currentTime = newTime
    setProgress(percentage)
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const addToQueue = (track) => {
    setQueue(prev => [...prev, track])
    toast.success(`Added "${track.title}" to queue`)
  }

  const removeFromQueue = (index) => {
    const track = queue[index]
    setQueue(prev => prev.filter((_, i) => i !== index))
    toast.info(`Removed "${track?.title}" from queue`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <>
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      
      {/* Now Playing Bar */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-24 glassmorphism border-t border-gray-800 flex items-center px-6 z-50"
      >
        <div className="flex items-center gap-4 w-1/3">
          <img 
            src={currentTrack.coverUrl} 
            alt={currentTrack.album}
            className="w-14 h-14 object-cover rounded"
          />
          <div>
            <h4 className="font-semibold text-sm">{currentTrack.title}</h4>
            <p className="text-gray-400 text-xs">{currentTrack.artist}</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <ApperIcon name="Heart" size={16} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShuffle(!shuffle)}
              className={`${shuffle ? 'text-primary' : 'text-gray-400'} hover:text-white transition-colors`}
            >
              <ApperIcon name="Shuffle" size={16} />
            </button>
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon name="SkipBack" size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </button>
            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon name="SkipForward" size={20} />
            </button>
            <button
              onClick={() => setRepeat(repeat === 'off' ? 'all' : repeat === 'all' ? 'one' : 'off')}
              className={`${repeat !== 'off' ? 'text-primary' : 'text-gray-400'} hover:text-white transition-colors relative`}
            >
              <ApperIcon name="Repeat" size={16} />
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary text-black rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-gray-400">
              {audioRef.current ? formatTime(audioRef.current.currentTime || 0) : '0:00'}
            </span>
            <div 
              ref={progressRef}
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer"
            >
              <div 
                className="h-full bg-white rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-gray-400">
              {currentTrack ? formatTime(currentTrack.duration) : '0:00'}
            </span>
          </div>
        </div>

        <div className="w-1/3 flex items-center justify-end gap-4">
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="ListMusic" size={16} />
          </button>
          <div 
            className="relative"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ApperIcon 
                name={isMuted || volume === 0 ? "VolumeX" : volume < 50 ? "Volume1" : "Volume2"} 
                size={16} 
/>
            </button>
            {showVolume && (
              <div className="absolute bottom-full mb-2 right-0 bg-card border border-border p-2 rounded-lg shadow-theme">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-primary"
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Queue Panel */}
      <AnimatePresence>
{showQueue && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 w-80 h-full bg-background-secondary border-l border-border z-40 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-foreground-secondary hover:text-foreground transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-2 overflow-y-auto max-h-96">
              <div className="text-sm text-foreground-secondary mb-2">Now Playing</div>
              <div className="flex items-center gap-3 p-2 bg-primary bg-opacity-20 rounded">
                <img 
                  src={currentTrack.coverUrl} 
                  alt={currentTrack.album}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{currentTrack.title}</p>
                  <p className="text-foreground-secondary text-xs">{currentTrack.artist}</p>
                </div>
</div>
              
              {queue.length > 0 ? (
                <>
                  <div className="text-sm text-foreground-secondary mt-4 mb-2">Next in Queue</div>
                  {queue.map((track, index) => (
                    <div key={`${track.id}-${index}`} className="flex items-center gap-3 p-2 rounded hover:bg-card-hover group">
                      <img 
                        src={track.coverUrl} 
                        alt={track.album}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{track.title}</p>
                        <p className="text-foreground-secondary text-xs">{track.artist}</p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(index)}
                        className="opacity-0 group-hover:opacity-100 text-foreground-secondary hover:text-foreground transition-all"
                      >
                        <ApperIcon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-foreground-secondary text-sm text-center py-8">
                  No tracks in queue
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MainFeature