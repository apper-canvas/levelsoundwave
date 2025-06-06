import albumData from '../mockData/album.json'

class AlbumService {
  constructor() {
    this.albums = [...albumData]
  }

  async getAll() {
    await this.delay()
    return [...this.albums]
  }

  async getById(id) {
    await this.delay()
    const album = this.albums.find(a => a.id === id)
    return album ? { ...album } : null
  }

  async create(albumData) {
    await this.delay()
    const newAlbum = {
      id: Date.now().toString(),
      ...albumData,
      tracks: albumData.tracks || [],
      createdAt: new Date().toISOString()
    }
    this.albums.push(newAlbum)
    return { ...newAlbum }
  }

  async update(id, data) {
    await this.delay()
    const index = this.albums.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Album not found')
    
    this.albums[index] = { ...this.albums[index], ...data }
    return { ...this.albums[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.albums.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Album not found')
    
    const deleted = this.albums.splice(index, 1)[0]
    return { ...deleted }
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }
}

export default new AlbumService()