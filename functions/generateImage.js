const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { prompt } = JSON.parse(event.body);
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

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
