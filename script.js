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
    console.log('Unexpected API response ', data);

    if (data && data.data && data.data.length > 0) {
        const img = document.createElement('img');
        img.src = data.data[0].url;
        img.alt = flashcardText;

        document.getElementById('flashcard-text-display').textContent = flashcardText;
        document.getElementById('image-container').appendChild(img);
    } else {
        console.error('No image URL found in API response');
    }
});

document.getElementById('save-pdf').addEventListener('click', function() {
    var printSize = document.getElementById('print-size').value;
    var flashcard = document.getElementById('flashcard');
    var pdf = new jsPDF('p', 'mm', printSize.toUpperCase());

    pdf.html(flashcard, {
        callback: function (pdf) {
            pdf.save('flashcard.pdf');
        }
    });
});
