import playlistData from '../mockData/playlist.json'

class PlaylistService {
  constructor() {
    this.playlists = [...playlistData]
  }

  async getAll() {
    await this.delay()
    return [...this.playlists]
  }

  async getById(id) {
    await this.delay()
    const playlist = this.playlists.find(p => p.id === id)
    return playlist ? { ...playlist } : null
  }

  async create(playlistData) {
    await this.delay()
    const newPlaylist = {
      id: Date.now().toString(),
      ...playlistData,
      tracks: playlistData.tracks || [],
      createdAt: new Date().toISOString()
    }
    this.playlists.push(newPlaylist)
    return { ...newPlaylist }
  }

  async update(id, data) {
    await this.delay()
    const index = this.playlists.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Playlist not found')
    
    this.playlists[index] = { ...this.playlists[index], ...data }
    return { ...this.playlists[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.playlists.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Playlist not found')
    
    const deleted = this.playlists.splice(index, 1)[0]
    return { ...deleted }
  }

  async addTrack(playlistId, track) {
    await this.delay()
    const playlist = this.playlists.find(p => p.id === playlistId)
    if (!playlist) throw new Error('Playlist not found')
    
    playlist.tracks = playlist.tracks || []
    playlist.tracks.push(track)
    return { ...playlist }
  }

  async removeTrack(playlistId, trackId) {
    await this.delay()
    const playlist = this.playlists.find(p => p.id === playlistId)
    if (!playlist) throw new Error('Playlist not found')
    
    playlist.tracks = playlist.tracks.filter(t => t.id !== trackId)
    return { ...playlist }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export default new PlaylistService()