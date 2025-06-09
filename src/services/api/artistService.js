import artistData from '../mockData/artist.json'
import trackService from './trackService'

class ArtistService {
  constructor() {
    this.artists = [...artistData]
  }

  async getAll() {
    await this.delay()
    return [...this.artists]
  }

  async getById(id) {
    await this.delay()
    const artist = this.artists.find(a => a.id === id)
    return artist ? { ...artist } : null
  }

  async getTopTracks(artistId) {
    await this.delay()
    const artist = this.artists.find(a => a.id === artistId)
    if (!artist || !artist.topTracks) return []
    
    const allTracks = await trackService.getAll()
    const topTracks = artist.topTracks
      .map(trackId => allTracks.find(track => track.id === trackId))
      .filter(Boolean)
      .slice(0, 5)
    
    return topTracks
  }

  async getDiscography(artistId) {
    await this.delay()
    const artist = this.artists.find(a => a.id === artistId)
    return artist && artist.discography ? [...artist.discography] : []
  }

  async create(artistData) {
    await this.delay()
    const newArtist = {
      id: Date.now().toString(),
      ...artistData,
      followers: 0,
      monthlyListeners: 0,
      verified: false,
      topTracks: [],
      discography: [],
      createdAt: new Date().toISOString()
    }
    this.artists.push(newArtist)
    return { ...newArtist }
  }

  async update(id, data) {
    await this.delay()
    const index = this.artists.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Artist not found')
    
    this.artists[index] = { ...this.artists[index], ...data }
    return { ...this.artists[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.artists.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Artist not found')
    
    const deleted = this.artists.splice(index, 1)[0]
    return { ...deleted }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export default new ArtistService()