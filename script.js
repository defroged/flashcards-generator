document.getElementById('image-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const flashcardText = document.getElementById('flashcard-text').value;
    const imagePrompt = document.getElementById('image-prompt').value + ' clipart';

    // Comment out the API call and use a mock image instead
    /*
    const response = await fetch('/.netlify/functions/generateImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: imagePrompt })
    });
    const data = await response.json();
    console.log('Unexpected API response ', data);
    */

    // Use a mock image URL
    const mockImageUrl = "https://www.bluestar-english.com/wp-content/uploads/2023/06/mock.png";

    const img = document.createElement('img');
    img.src = mockImageUrl;
    img.alt = flashcardText;

    document.getElementById('flashcard-text-display').textContent = flashcardText;
    document.getElementById('image-container').appendChild(img);
});

document.getElementById('save-pdf').addEventListener('click', function() {
    var pdf = new jsPDF();
    pdf.text('Hello world!', 10, 10);
    pdf.save('simple.pdf');
});
