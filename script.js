window.onload = function () {
    document.getElementById('image-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const flashcardText = document.getElementById('flashcard-text').value;
        const imagePrompt = document.getElementById('image-prompt').value + ' clipart';
        const printSize = document.getElementById('print-size').value;
        const fontFamily = document.getElementById('font-family').value;

        document.getElementById('loader').style.display = 'block';

        const useMockImage = false;

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
            document.getElementById('loader').style.display = 'none';
            document.getElementById('regenerate-hint').style.display = 'inline-block';
            document.getElementById('save-pdf').style.display = 'block';

            const flashcard = document.getElementById('flashcard');
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
        const flashcard = document.getElementById('flashcard');
        const printSize = document.getElementById('print-size').value.toUpperCase();

        const pdf = new window.jspdf.jsPDF({
            orientation: 'landscape',
            format: printSize
        });

        html2canvas(flashcard, { backgroundColor: 'white' }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const ratio = flashcard.offsetWidth / flashcard.offsetHeight;
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdfWidth / ratio;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('flashcard.pdf');
        });
    });
}
