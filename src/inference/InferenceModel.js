class InferenceModel {
  constructor (modelName) {
    this.modelName = modelName
    this.baseUrl = 'http://localhost:11434' // Default Ollama API endpoint
  }

  async callOllama (prompt) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        model: this.modelName,
        stream: false,
        temperature: 0.3
      })
    })

    const data = await response.json()
    return data.response
  }

  async generateAnswer (query, docs) {
    const context = docs.length > 0 ? `
    Based on this content: 
    ${docs.join('\n')}
    ` : ""

    const prompt = `
    ${context}
    Answer: ${query}
    `
    const answer = await this.callOllama(prompt)

    return { answer }
  }
}

module.exports = InferenceModel
