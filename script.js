window.onload = function() {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        // ... keep the original code for fetching image here ...

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

        // Wait for the image to load before capturing the flashcard
        if (document.querySelector("#image-container img").complete) {
            captureAndSaveFlashcard(flashcard, printSize);
        } else {
            document.querySelector("#image-container img").addEventListener('load', () => {
                captureAndSaveFlashcard(flashcard, printSize);
            });
        }
    });
}

function captureAndSaveFlashcard(flashcard, printSize) {
    // Create a new jsPDF instance with the correct format
    const pdf = new window.jspdf.jsPDF({
        orientation: 'landscape',
        format: printSize
    });

    // Use html2canvas to convert the flashcard to a canvas
    html2canvas(flashcard, { scale: 2 }) // Use higher DPI for better quality
        .then(canvas => {
            // Convert the canvas to an image
            const imgData = canvas.toDataURL('image/png');

            // Calculate the ratio of the flashcard's width to its height
            const ratio = flashcard.offsetWidth / flashcard.offsetHeight;

            // Calculate the width and height of the image in the PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdfWidth / ratio;

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Save the PDF
            pdf.save('flashcard.pdf');
        });
}
