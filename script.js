document.getElementById('image-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const flashcardText = document.getElementById('flashcard-text').value;
    const imagePrompt = document.getElementById('image-prompt').value + ' clipart';


    const response = await fetch('/.netlify/functions/generateImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: imagePrompt })
    });
    const data = await response.json();

    const img = document.createElement('img');
    img.src = data.url;
    img.alt = flashcardText;

    document.getElementById('image-container').appendChild(img);
});
