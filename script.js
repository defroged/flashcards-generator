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

    document.getElementById('save-pdf').addEventListener('click', async function() {
        const flashcard = document.getElementById('flashcard');
        const printSize = document.getElementById('print-size').value.toUpperCase();

        const { PDFDocument, rgb, StandardFonts } = pdfLib;

        // Create a new PDFDocument instance
        const pdfDoc = await PDFDocument.create();

        // Embed the fonts
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

        // Convert the flashcard to a canvas
        const canvas = await html2canvas(flashcard);
        const imgData = canvas.toDataURL('image/png');

        // Fetch the image and convert it to a buffer
        const imageBuffer = await fetch(imgData).then(res => res.arrayBuffer());

        // Embed the image to the PDF document
        const jpgImage = await pdfDoc.embedJpg(imageBuffer);

        // Create a new page
        const page = pdfDoc.addPage();

        const imgWidth = jpgImage.width;
        const imgHeight = jpgImage.height;

        // Draw the image to the page
        page.drawImage(jpgImage, {
            x: page.getWidth() / 2 - imgWidth / 2,
            y: page.getHeight() / 2 - imgHeight / 2,
            width: imgWidth,
            height: imgHeight,
        });

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save();

        // Save the PDF
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'flashcard.pdf';
        link.click();
    });
}
