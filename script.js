document.getElementById('image-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const flashcardText = document.getElementById('flashcard-text').value;
    const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
    const printSize = document.getElementById('print-size').value;

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

    const flashcard = document.getElementById('flashcard');
    flashcard.className = printSize;

    document.getElementById('flashcard-text-display').textContent = flashcardText;
    document.getElementById('image-container').innerHTML = ''; // clear any previous image
    document.getElementById('image-container').appendChild(img);
});

document.getElementById('save-pdf').addEventListener('click', function() {
    const flashcard = document.getElementById('flashcard');
    const pdf = new jsPDF();

    // Capture the flashcard and add it to the PDF
    pdf.html(flashcard, {
        callback: function (pdf) {
            pdf.save('flashcard.pdf');
        },
        x: 10,
        y: 10
    });
});
