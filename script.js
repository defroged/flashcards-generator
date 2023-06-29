window.onload = function() {
    let imageUrl = null;

    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
        const printSize = document.getElementById('print-size').value;

        // Set this to true to use the mock image, false to call the API
        const useMockImage = false;

        if (useMockImage) {
            // Use a mock image URL
            imageUrl = "/public/mock.png";
        } else {
            // Call the API to generate an image
            const response = await fetch('/.netlify/functions/generateImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: imagePrompt })
            });
            const data = await response.json();
            imageUrl = data.imageUrl;
        }

        const img = document.createElement('img');
		img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.alt = flashcardText;

        img.onload = function() {
            const flashcard = document.getElementById('flashcard');
            flashcard.className = printSize;

            document.getElementById('flashcard-text-display').textContent = flashcardText;
            document.getElementById('image-container').innerHTML = ''; // clear any previous image
            document.getElementById('image-container').appendChild(img);
        };

        img.onerror = function() {
            alert('Failed to load image');
        };
    });

    document.getElementById('save-pdf').addEventListener('click', function() {
    if (imageUrl) {
        const flashcard = document.getElementById('flashcard');
        const printSize = document.getElementById('print-size').value.toUpperCase();

        // Create a new jsPDF instance with the correct format
        const pdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            format: printSize
        });

        // Use html2canvas to convert the flashcard to a canvas
        html2canvas(flashcard, { scale: 1 }).then(canvas => {
    console.log('Canvas:', canvas);

    const imgData = canvas.toDataURL('image/png');

    // Set PDF width and height based on points (72 points = 1 inch)
    const pdfWidth = 72 * 11; // 11 inches width for standard landscape
    const pdfHeight = 72 * 8.5; // 8.5 inches height for standard landscape

    const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
    });

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save('flashcard.pdf');
}).catch((error) => {
    console.error('Error capturing canvas:', error);
});

    } else {
        alert('Please load an image first before saving as PDF');
    }
});

}
