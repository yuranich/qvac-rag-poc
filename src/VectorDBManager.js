class VectorDBManager {
  constructor (backend) {
    this.backend = backend
  }

  async initialize (docs) {
    await this.backend.initialize(docs)
  }

  async search (query) {
    return await this.backend.search(query)
  }

  async loadEmbeddings (data) {
    return await this.backend.loadEmbeddings(data)
  }
}

module.exports = VectorDBManager
