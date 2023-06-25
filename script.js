window.onload = function() {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
        const printSize = document.getElementById('print-size').value;

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
        img.src = imageUrl;
        img.alt = flashcardText;

        img.onload = function() {
            const flashcard = document.getElementById('flashcard');
            flashcard.className = printSize;

            document.getElementById('flashcard-text-display').textContent = flashcardText;
            document.getElementById('image-container').innerHTML = ''; // clear any previous image
            document.getElementById('image-container').appendChild(img);
        };
    });

    document.getElementById('save-pdf').addEventListener('click', function() {
        const flashcard = document.getElementById('flashcard');
        const printSize = document.getElementById('print-size').value.toUpperCase();

        // Create a new jsPDF instance with the correct format
        const pdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            format: printSize
        });

        // Get the image and text separately
        const imgElement = document.querySelector('#image-container img');
        const textElement = document.getElementById('flashcard-text-display');

        // Convert the image to a data URL
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);
        const imgData = canvas.toDataURL('image/png');

        // Calculate the ratio of the image's width to its height
        const ratio = imgElement.width / imgElement.height;

        // Calculate the width and height of the image in the PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdfWidth / ratio;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Add the text to the PDF
        pdf.text(textElement.textContent, 10, 10); // adjust these coordinates as needed

        // Save the PDF
        pdf.save('flashcard.pdf');
    });
}
