window.onload = function () {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const printSize = document.getElementById('print-size').value;
        const fontFamily = document.getElementById('font-family').value;

        // Show the loading animation
        document.getElementById('loader').style.display = 'block';

        // Get rephrased prompt from the Netlify Function
        const imagePrompt = await getRephrasedPrompt(document.getElementById('image-prompt').value);
		
		// Log the rephrased prompt to the console
        console.log('Rephrased prompt:', imagePrompt);

        const useMockImage = false; // Set this to true to use the mock image, false to call the API

        let imageUrl;
        if (useMockImage) {
            imageUrl = "/public/mock.png";
        } else {
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
        img.alt = flashcardText;

        img.onload = function () {
            // Hide the loading animation
            document.getElementById('loader').style.display = 'none';

            // Show the hint text
            document.getElementById('regenerate-hint').style.display = 'inline-block';

            // Show the flashcard
            const flashcard = document.getElementById('flashcard');
            flashcard.style.display = 'block';
            flashcard.className = printSize;

            const flashcardTextDisplay = document.getElementById('flashcard-text-display');
            flashcardTextDisplay.textContent = flashcardText;
            flashcardTextDisplay.style.fontFamily = fontFamily;

            document.getElementById('image-container').innerHTML = '';
            document.getElementById('image-container').appendChild(img);
        };

        if (useMockImage) {
            img.src = imageUrl;
        } else {
            const netlifyFunctionUrl = "/.netlify/functions/fetchImage?url=" + encodeURIComponent(imageUrl);
            const serverResponse = await fetch(netlifyFunctionUrl);
            const serverData = await serverResponse.json();
            const objectUrl = "data:image/png;base64," + serverData.image;
            img.src = objectUrl;
        }

    });

    document.getElementById('save-pdf').addEventListener('click', function () {
    const flashcardText = document.getElementById('flashcard-text').value;
    const flashcard = document.getElementById('flashcard');
    const printSize = document.getElementById('print-size').value.toUpperCase();

    // Create a new jsPDF instance with the correct format
    const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape',
        format: printSize
    });

    // Temporarily add the no-border class to remove the border
    flashcard.classList.add('no-border');

    // Use html2canvas to convert the flashcard to a canvas
    html2canvas(flashcard, {
        backgroundColor: 'white',
        scale: 3, // Increasing scale for better resolution.
        width: flashcard.offsetWidth,
        height: flashcard.offsetHeight,
    }).then(canvas => {
        // Remove the no-border class after capturing
        flashcard.classList.remove('no-border');

        const imgData = canvas.toDataURL('image/png');

        const pdfPageWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();
        const pdfPageRatio = pdfPageWidth / pdfPageHeight;

        const imageWidth = canvas.width;
        const imageHeight = canvas.height;
        const imageRatio = imageWidth / imageHeight;

        let contentWidth, contentHeight;
        if (pdfPageRatio > imageRatio) {
            contentHeight = pdfPageHeight;
            contentWidth = contentHeight * imageRatio;
        } else {
            contentWidth = pdfPageWidth;
            contentHeight = contentWidth / imageRatio;
        }

        const posX = (pdfPageWidth - contentWidth) / 2;
        const posY = (pdfPageHeight - contentHeight) / 2;

        // Add the image to the PDF without the border.
        pdf.addImage(imgData, 'PNG', posX, posY, contentWidth, contentHeight);

        // Save the PDF with the flashcard text as the name
        pdf.save(flashcardText ? `${flashcardText}.pdf` : 'flashcard.pdf');
    });
});

}

async function getRephrasedPrompt(originalPrompt) {
    try {
        const response = await fetch('/.netlify/functions/rephrasePrompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: originalPrompt,
            }),
        });

        const data = await response.json();
        return data.rephrasedPrompt;
    } catch (error) {
        console.error('Error rephrasing the prompt:', error);
        return originalPrompt; // Return the original prompt in case of error
    }
}