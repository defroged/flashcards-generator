window.onload = function() {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
        const printSize = document.getElementById('print-size').value;

        // Set this to true to use the mock image, false to call the API
        const useMockImage = false;

        let imageResponse;
        if (useMockImage) {
            // Use a mock image URL
            imageResponse = await fetch("/public/mock.png");

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
            imageResponse = await fetch(data.imageUrl);
        }

        // Convert the fetched image to a Blob
        const imageBlob = await imageResponse.blob();

        // Create a new FileReader
        const reader = new FileReader();

        // Convert the Blob to a Data URL
        reader.readAsDataURL(imageBlob);

        reader.onloadend = function() {
            const base64data = reader.result;

            const img = new Image();
            img.src = base64data;
            img.alt = flashcardText;

            img.onload = function() {
                const flashcard = document.getElementById('flashcard');
                flashcard.className = printSize;

                document.getElementById('flashcard-text-display').textContent = flashcardText;
                document.getElementById('image-container').innerHTML = ''; // clear any previous image
                document.getElementById('image-container').appendChild(img);
            };
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

        // Use html2canvas to take a screenshot of the flashcard
        window.html2canvas(flashcard).then(function(canvas) {
            // Add the screenshot to the PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0);

            // Save the PDF
            pdf.save('flashcard.pdf');
        });
    });
};
