const InferenceModel = require('./InferenceModel')
const LanceDBAdapter = require('./LanceDBAdapter')
const RetrievalManager = require('./RetrievalManager')
const VectorDBManager = require('./VectorDBManager')
const RAGAgent = require('./RagAgent')

;(async () => {
  const { pipeline } = await import('@xenova/transformers')

  let embeddingPipeline = null

  async function initializeEmbeddingFunction () {
    embeddingPipeline = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    )
  }

  async function generateEmbedding (text) {
    const result = await embeddingPipeline(text, {
      pooling: 'mean',
      normalize: true
    })
    return Array.from(result.data)
  }

  await initializeEmbeddingFunction()

  const inferenceModel = new InferenceModel('llama3.1')

  const lanceDBBackend = new LanceDBAdapter('/tmp/lancedb/', generateEmbedding)
  const vectorDBManager = new VectorDBManager(lanceDBBackend)
  const retrievalManager = new RetrievalManager(vectorDBManager)

  const ragAgent = new RAGAgent({
    retrievalManager,
    inferenceModel
  })

  const query = 'What was the outcome of the 2024 Wimbledon Championship?';

  const resultWithoutDocuments = await ragAgent.generateAnswer(query, [])

  console.log("Result Without Documents:", resultWithoutDocuments)

  const documents = [
    {
      id: '1',
      content: `The 2024 Summer Olympics will take place in Paris, France. It is expected to feature 32 sports and 329 events, with skateboarding and sport climbing making a return following their debut in the Tokyo Olympics. The event will also see the inclusion of surfing and breakdancing for the first time, expanding the diversity of Olympic sports.`
    },
    {
      id: '2',
      content: `In a stunning display at the 2024 UEFA Champions League final, Manchester City secured their second consecutive title with a 3-1 victory over Real Madrid. Key performances from players like Kevin De Bruyne and Erling Haaland propelled City to dominate much of the match, solidifying their status as one of the top football clubs in Europe.`
    },
    {
      id: '3',
      content: `During the 2024 Wimbledon Championship, Novak Djokovic made history by winning his 25th Grand Slam title. He defeated Carlos Alcaraz in a thrilling five-set match, further cementing his legacy as one of the greatest tennis players of all time. This victory also marked Djokovic's eighth Wimbledon title, equaling Roger Federer's record.`
    },
    {
      id: '4',
      content: `The 2024 Tour de France featured a dramatic finish, with Tadej Pogačar reclaiming the yellow jersey in the final mountain stage. The Slovenian rider battled through challenging conditions to secure his third Tour victory, defeating Jonas Vingegaard by a narrow margin. Pogačar’s exceptional climbing skills and endurance once again proved pivotal in the final stages.`
    },
    {
      id: '5',
      content: `The 2024 NBA Finals saw the Denver Nuggets clinch their first-ever championship in franchise history. Led by MVP Nikola Jokić, the Nuggets defeated the Boston Celtics in a 4-2 series, with Jokić recording multiple triple-doubles throughout the playoffs. This victory ended years of near misses for Denver and marked a new era in NBA history.`
    },
    {
      id: '6',
      content: `At the 2024 FIFA Women's World Cup, the United States faced an unexpected early exit in the quarterfinals. The defending champions were defeated by Sweden in a penalty shootout, marking one of the biggest upsets in recent World Cup history. Sweden’s goalkeeper, Zecira Musovic, was instrumental in their victory, making several key saves during the match.`
    }
  ];

  await vectorDBManager.initialize(documents)

  const results = await ragAgent.handleQuery(query)

  console.log('Final Results:', results)
})()
