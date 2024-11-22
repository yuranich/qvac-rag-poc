'use strict'

async function generateEmbedding (text) {
    const { pipeline } = await import('@xenova/transformers')
    const embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2'
    )
    const result = await embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true
    })
    return Array.from(result.data)
}

module.exports = generateEmbedding