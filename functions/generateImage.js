const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt } = JSON.parse(event.body);

    console.info('Sending request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            'prompt': prompt,
            'n': 1,
            'size': '512x512'
        })
    });

    if (!response.ok) {
        console.error('Failed to generate image:', response.statusText);
        return { statusCode: 500, body: "Image generation failed: " + response.statusText };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
        // Extract the URL of the image from the API response
        const imageUrl = data.data[0].url;

        return {
            statusCode: 200,
            body: JSON.stringify({ imageUrl: imageUrl })
        };
    }

    console.error('No image URL in API response.');
    return {
        statusCode: 500,
        body: "Image generation failed: No image URL in API response."
    };
};
