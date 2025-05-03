// Información de los videos y los textos que se irán mostrando
const steps = [
    {
        videoSrc: '/static/images/talk.mp4',
        text: 'Encontrarás varias secciones que te ayudarán en tu día a día '
    },
    {
        videoSrc: '/static/images/Talk.mp4',
        text: 'Recuerda, la práctica constante es clave para aprender.'
    },
    {
        videoSrc: '/static/images/Dance.mp4',
        text: '¡Diviértete! SpeakHands te brindará la mejor experiencia.'
    }
];

let currentStep = 0;

function nextStep() {
    // Si no hay más pasos, redirige al usuario
    if (currentStep >= steps.length) {
        window.location.href = '/home'; // Redirigir a la página principal
        return;
    }

    const textContent = document.getElementById('text-content')
    const video = document.getElementById('avatar-video');

    // Animar la salida del mensaje anterior
   
    textContent.style.animation = 'messageExit 1s ease-out forwards';

    // Cambiar el video y el texto después de un pequeño retraso para la animación
    setTimeout(() => {
        // Cambiar el video
        video.src = steps[currentStep].videoSrc;
        video.play();

        // Actualizar el contenido del mensaje
        textContent.textContent = steps[currentStep].text;

        // Aplicar la animación de entrada al nuevo mensaje
        textContent.style.animation = 'none';  // Eliminar la animación anterior
        textContent.offsetHeight; // Forzar el reflow para reiniciar la animación
        textContent.style.animation = 'messageEnter 1s ease-out forwards';

        // Incrementar el paso actual
        currentStep++;
    }, 1000); // Espera de 1 segundo antes de cambiar el contenido (para coordinar con las animaciones)
}
