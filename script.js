window.onload = function () {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
        const printSize = document.getElementById('print-size').value;
        const fontFamily = document.getElementById('font-family').value;

        // Show the loading animation
        document.getElementById('loader').style.display = 'block';

        // Set this to true to use the mock image, false to call the API
        const useMockImage = false;

        let imageUrl;
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
        img.alt = flashcardText;

        img.onload = function () {
    // Hide the loading animation
    document.getElementById('loader').style.display = 'none';
	
	// Show the hint text
    document.getElementById('regenerate-hint').style.display = 'inline-block';
    
    // Show the flashcard
    document.getElementById('flashcard').style.display = 'block';

    const flashcard = document.getElementById('flashcard');
    flashcard.className = printSize;

    const flashcardTextDisplay = document.getElementById('flashcard-text-display');
    flashcardTextDisplay.textContent = flashcardText;
    flashcardTextDisplay.style.fontFamily = fontFamily;

    document.getElementById('image-container').innerHTML = ''; // clear any previous image
    document.getElementById('image-container').appendChild(img);
};



        // Set the image source for displaying
        if (useMockImage) {
            // If using mock image, use it directly
            img.src = imageUrl;
        } else {
            // If not using mock image, download it through the serverless function to bypass CORS issues
            const netlifyFunctionUrl = "/.netlify/functions/fetchImage?url=" + encodeURIComponent(imageUrl);
            const serverResponse = await fetch(netlifyFunctionUrl);
            const serverData = await serverResponse.json();
            const objectUrl = "data:image/png;base64," + serverData.image;
            img.src = objectUrl;
        }

    });

    document.getElementById('save-pdf').addEventListener('click', function () {
    const flashcard = document.getElementById('flashcard');
    const printSize = document.getElementById('print-size').value.toUpperCase();

    // Create a new jsPDF instance with the correct format
    const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: printSize
    });

    // Use html2canvas to convert the flashcard to a canvas
    html2canvas(flashcard, { backgroundColor: 'white', scale: 2 }).then(canvas => {
        // Convert the canvas to an image
        const imgData = canvas.toDataURL('image/png');

        // Get the dimensions of the PDF page
        const pdfPageWidth = pdf.internal.pageSize.getWidth();
        const pdfPageHeight = pdf.internal.pageSize.getHeight();

        // Calculate the dimensions of the image to fit the PDF page
        const imgWidth = pdfPageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Save the PDF
        pdf.save('flashcard.pdf');
    });
});



}
