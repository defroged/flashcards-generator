const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const imageUrl = event.queryStringParameters.url;
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        return {
            statusCode: 200,
            body: JSON.stringify({image: base64Image}),
            headers: {'Content-Type': 'application/json'}
        };
    } catch (error) {
        return {statusCode: 500, body: error.toString()};
    }
};
