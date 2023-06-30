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

        img.onload = async function() {
    const flashcard = document.getElementById('flashcard');
    flashcard.className = printSize;

    document.getElementById('flashcard-text-display').textContent = flashcardText;
    document.getElementById('image-container').innerHTML = ''; // clear any previous image
    document.getElementById('image-container').appendChild(img);

    // Download the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    // Use the object URL as the image source for the PDF creation
    document.getElementById('save-pdf').addEventListener('click', function() {
        const flashcard = document.getElementById('flashcard');
        const printSize = document.getElementById('print-size').value.toUpperCase();

        // Create a new jsPDF instance with the correct format
        const pdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            format: printSize
        });

        // Use html2canvas to convert the flashcard to a canvas
        html2canvas(flashcard).then(canvas => {
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
    });
};

}