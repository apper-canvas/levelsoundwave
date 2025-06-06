import trackData from '../mockData/track.json'

class TrackService {
  constructor() {
    this.tracks = [...trackData]
  }

  async getAll() {
    await this.delay()
    return [...this.tracks]
  }

  async getById(id) {
    await this.delay()
    const track = this.tracks.find(t => t.id === id)
    return track ? { ...track } : null
  }

  async create(trackData) {
    await this.delay()
    const newTrack = {
      id: Date.now().toString(),
      ...trackData,
      createdAt: new Date().toISOString()
    }
    this.tracks.push(newTrack)
    return { ...newTrack }
  }

  async update(id, data) {
    await this.delay()
    const index = this.tracks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Track not found')
    
    this.tracks[index] = { ...this.tracks[index], ...data }
    return { ...this.tracks[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.tracks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Track not found')
    
    const deleted = this.tracks.splice(index, 1)[0]
    return { ...deleted }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export default new TrackService()