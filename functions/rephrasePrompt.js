const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const requestBody = JSON.parse(event.body);
        const userPrompt = requestBody.prompt;

        const openaiApiKey = process.env.CHATGPT_API_KEY;
        console.log('Sending request to OpenAI API with prompt:', userPrompt);
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiApiKey}`
            },
            body: JSON.stringify({
                model: 'text-davinci-002',
                prompt: `Rephrase this DALL-E prompt as an image description for a simple and cute illustration in clipart style: "${userPrompt}"`,
                max_tokens: 50,
                n: 1,
                stop: null,
                temperature: 0.7
            })
        });

        const responseData = await response.json();
        console.log('Received response from OpenAI API:', responseData);

        if (responseData.choices && responseData.choices.length > 0) {
            const rephrasedPrompt = responseData.choices[0].text;
            return {
                statusCode: 200,
                body: JSON.stringify({ rephrasedPrompt })
            };
        } else {
            throw new Error('No rephrased prompt received from the API.');
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
