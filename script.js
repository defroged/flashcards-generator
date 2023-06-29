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
        html2canvas(flashcard).then(canvas => {
            console.log('Canvas:', canvas); // Log the canvas to make sure it's capturing the content

            // Convert the canvas to an image
            const imgData = canvas.toDataURL('image/png');
            
            // Log the image data URL
            console.log('Image Data URL:', imgData);

            // Calculate the ratio of the flashcard's width to its height
            const ratio = flashcard.offsetWidth / flashcard.offsetHeight;

            // Calculate the width and height of the image in the PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdfWidth / ratio;

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Save the PDF
            pdf.save('flashcard.pdf');
        }).catch((error) => {
            console.error('Error capturing canvas:', error); // Log any error during canvas capture
        });
    } else {
        alert('Please load an image first before saving as PDF');
    }
});

}
