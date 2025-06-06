import axios from 'axios';

async function testOpenRouterAPI() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('DEEPSEEK_API_KEY not found');
    return;
  }

  console.log('Testing OpenRouter API connection...');
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Respond with valid JSON only.' },
          { role: 'user', content: 'Generate a simple JSON object with {"test": "success", "timestamp": "current time"}' }
        ],
        temperature: 0.3,
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://replit.com',
          'X-Title': 'Test Request'
        },
        timeout: 30000
      }
    );

    console.log('OpenRouter API Response:', response.data);
    
    if (response.data?.choices?.[0]?.message?.content) {
      console.log('Content:', response.data.choices[0].message.content);
    }
    
  } catch (error) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
  }
}

testOpenRouterAPI();