'use strict'

const MLCLlama = require('qvac-lib-inference-addon-mlc-llama');
const FilesystemDL = require('qvac-lib-dl-filesystem'); // Filesystem Data Loader
const config = require('../../config/models.json');

class QvacLlamaModel {
  async generateAnswer (query, docs) {
    const context = docs.length > 0 ? `
    Based on this content: 
    ${docs.join('\n')}
    ` : ""

    const prompt = `
    ${context}
    Answer: ${query}
    `
    const answer = await this._callInferenceLib(prompt)

    return { answer }
  }

  async _callInferenceLib (prompt) {
    const fsDL = new FilesystemDL({ dirPath: '/home/ubuntu/dev/rag/forked/qvac-rag-poc/node_modules/qvac-lib-inference-addon-mlc-llama/model' });

    const args = {
      loader: fsDL,
      opts: {},
    };

    console.log('instantiating qvac model')
    const model = new MLCLlama(args, config);

    console.log('loading qvac model')
    await model.load();

    try {
      console.log('running qvac model')
      const response = await model.run(prompt);

      const answer = []
      for await (const output of response.iterate()) {
        console.log(output);
        answer.push(output)
      }
      return Array.join(answer)
    } finally {
      // Unload the model to free up resources
      await model.unload();
    }
  }
}

module.exports = QvacLlamaModel