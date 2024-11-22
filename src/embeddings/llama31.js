// const { TextEncoder, TextDecoder } = require('text-encoding')
// global.TextEncoder = TextEncoder
// global.TextDecoder = TextDecoder
// require('bare-fetch/global')

/**
 * Fetch embeddings from Ollama for a given text.
 * @param {string} text - The input text to vectorize.
 * @returns {Promise<Array<number>>} - The embedding vector.
 */
async function generateEmbedding(text) {
    try {
        const response = await fetch("http://localhost:11434/api/embed", {
            method: "POST",
            body: JSON.stringify({ model: "llama3.1", input: text })
        });
        const result = await response.json()
        console.log(result)

        // Assuming the response contains embeddings in JSON format
        return result.embeddings;
    } catch (error) {
        console.error("Error fetching embedding from Ollama:", error.message);
        return null;
    }
}

module.exports = generateEmbedding