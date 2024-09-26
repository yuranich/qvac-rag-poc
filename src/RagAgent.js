'use strict'

class RAGAgent {
  constructor({ retrievalManager, inferenceModel }) {
    this.retrievalManager = retrievalManager;
    this.inferenceModel = inferenceModel;
  }

  async handleQuery(query) {
    const retrievedDocs = await this.retrievalManager.retrieve(query);

    const response = await this.generateAnswer(query, retrievedDocs);
    return response;
  }

  async generateAnswer(query, docs) {
    const context = docs.map(doc => doc.content);

    const answer = await this.inferenceModel.generateAnswer(query, context);
    return answer;
  }
}
  
  module.exports = RAGAgent
  