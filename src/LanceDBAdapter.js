const lancedb = require('@lancedb/lancedb')

class LanceDBAdapter {
  constructor (dbPath, embeddingFunction) {
    this.dbPath = dbPath
    this.embeddingFunction = embeddingFunction
    this.tableName = 'documents'
    this.db = null
    this.table = null
  }

  async initialize (docs) {
    const data = await this.getEmbeddings(docs)
    this.db = await lancedb.connect(this.dbPath)

    this.table = await this.db.createTable(this.tableName, data, {
      existsOk: true
    })
  }

  async getEmbeddings (docs) {
    const data = []
    for (const doc of docs) {
      const vector = await this.embeddingFunction(doc.content)
      data.push({ id: doc.id, content: doc.content, vector })
    }
    return data
  }

  async loadEmbeddings (docs) {
    const data = await this.getEmbeddings()

    await this.table.add(data)
  }

  async search (query, topK = 5) {
    const queryVector = await this.embeddingFunction(query)
    const results = await this.table.search(queryVector).limit(topK).toArray()

    return results.map(result => ({
      id: result.id,
      content: result.content,
      score: result._score
    }))
  }
}

module.exports = LanceDBAdapter
