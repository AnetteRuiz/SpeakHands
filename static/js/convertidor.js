document.addEventListener('DOMContentLoaded', () => {
    const dynamicText = document.getElementById('dynamic-text'); // Elemento para mostrar el texto
    const micButton = document.getElementById('mic-button'); // Botón para activar/desactivar el micrófono

    // Verificar soporte de la API de reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES'; // Configurar el idioma a español
        recognition.interimResults = false; // Solo resultados finales
        recognition.maxAlternatives = 1; // Una sola interpretación principal

        let isListening = false; // Estado del micrófono (activo/inactivo)

        // Manejar clic en el botón del micrófono
        micButton.addEventListener('click', () => {
            if (!isListening) {
                recognition.start(); // Iniciar reconocimiento
                micButton.textContent = "🎤 Apagar Micrófono";
                dynamicText.textContent = "Micrófono encendido... Escuchando.";
                isListening = true;
            } else {
                recognition.stop(); // Detener reconocimiento
                micButton.textContent = "🎤 Activar Micrófono";
                dynamicText.textContent = " " + dynamicText.textContent.replace("Dijiste: ", "");
                isListening = false;
            }
        });

        // Evento: Resultado del reconocimiento de voz
        recognition.addEventListener('result', (event) => {
            const transcript = event.results[0][0].transcript; // Obtener texto reconocido
            dynamicText.textContent = `Dijiste: ${transcript}`;
            console.log("Texto reconocido:", transcript);
        });

        // Evento: Fin del reconocimiento
        recognition.addEventListener('end', () => {
            if (isListening) {
                recognition.start(); // Reinicia si sigue activo
            }
        });

        // Evento: Error durante el reconocimiento
        recognition.addEventListener('error', (event) => {
            console.error("Error en reconocimiento de voz:", event.error);
            dynamicText.textContent = `Error: ${event.error}`;
            micButton.textContent = "🎤 Activar Micrófono";
            isListening = false;
        });
    } else {
        micButton.disabled = true; // Desactivar el botón si no hay soporte
        dynamicText.textContent = "Tu navegador no soporta el reconocimiento de voz.";
        console.warn("API de SpeechRecognition no disponible en este navegador.");
    }
});

document.getElementById('submit-button').addEventListener('click', () => {
    const text = document.getElementById('dynamic-text').textContent.replace("Dijiste: ", "").trim();

    fetch('/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: text }),
    })
        .then(response => response.json())
        .then(data => {
            const imageElement = document.getElementById('dynamic-image');

            // Aquí es donde se coloca el bloque de código para manejar las imágenes
            if (data.images && data.images.length > 0) {
                imageElement.src = data.images[0]; // Actualiza con la primera imagen de ejemplo
            } else {
                imageElement.src = "/static/images/default.webp"; // Imagen predeterminada si no hay imágenes
            }
        })
        .catch(error => console.error('Error al procesar la frase:', error));
});

let words = []; // Array para almacenar las palabras de la frase
let currentIndex = 0; // Índice de la palabra actual

document.getElementById('submit-button').addEventListener('click', () => {
    const text = document.getElementById('dynamic-text').textContent.replace("Dijiste: ", "").trim();
    words = text.split(" "); // Dividir la frase en palabras
    currentIndex = 0; // Comenzar desde la primera palabra

    fetch('/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase: words[currentIndex] }),
    })
        .then(response => response.json())
        .then(data => {
            const imageElement = document.getElementById('dynamic-image');
            if (data.images && data.images.length > 0) {
                imageElement.src = data.images[0];
            } else {
                imageElement.src = "/static/images/default.webp";
            }
        })
        .catch(error => console.error('Error al procesar la frase:', error));
});

document.getElementById('next-button').addEventListener('click', () => {
    if (currentIndex < words.length - 1) {
        currentIndex++; // Avanzar a la siguiente palabra

        fetch('/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phrase: words[currentIndex] }),
        })
            .then(response => response.json())
            .then(data => {
                const imageElement = document.getElementById('dynamic-image');
                if (data.images && data.images.length > 0) {
                    imageElement.src = data.images[0]; // Cambiar la imagen
                } else {
                    imageElement.src = "/static/images/default.webp";
                }
            })
            .catch(error => console.error('Error al procesar la frase:', error));
    }
});

