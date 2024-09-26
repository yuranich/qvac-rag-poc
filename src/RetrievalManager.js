class RetrievalManager {
    constructor(vectorDBManager) {
      this.vectorDBManager = vectorDBManager;
    }
  
    async retrieve(queries) {
      if (!Array.isArray(queries)) {
        queries = [queries];
      }
  
      const retrievalPromises = queries.map(async (query) => {
        return await this.vectorDBManager.search(query);
      });
  
      const resultsArrays = await Promise.all(retrievalPromises);
  
      const allResults = [].concat(...resultsArrays);
      const uniqueResults = Array.from(new Map(allResults.map((item) => [item.id, item])).values());
  
      return uniqueResults;
    }
  }

module.exports = RetrievalManager
