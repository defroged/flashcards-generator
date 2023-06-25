const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt } = JSON.parse(event.body);

    try {
        console.log('Sending request to OpenAI API...');
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                'prompt': prompt + " clipart",
                'n': 1,
                'size': '512x512'
            })

        });
        const data = await response.json();
        console.log('Received response from OpenAI API:', data);

        if (data.choices && data.choices.length > 0) {
            // Extract the base64-encoded image from the API response
            const base64Image = data.choices[0].image.data;
    
            return {
                statusCode: 200,
                body: JSON.stringify({ imageUrl: `data:image/png;base64,${base64Image}` })
            };
        }

        console.log('No image data in API response.');
        return {
            statusCode: 500,
            body: "Image generation failed"
        };
    } catch (error) {
        console.error('Error during image generation:', error);
        return {
            statusCode: 500,
            body: `Error during image generation: ${error.toString()}`
        };
    }
};
