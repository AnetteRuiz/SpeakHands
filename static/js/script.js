document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.querySelector('.btn-primary');
    const registerModal = document.getElementById('registerModal');
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButtons = document.querySelectorAll('.close, .close-2'); 

    
    loginButton?.addEventListener('click', function () {
        if (loginModal) loginModal.style.display = 'block';
    });

    
    registerButton?.addEventListener('click', function () {
        if (registerModal) registerModal.style.display = 'block';
    });

    
    closeButtons.forEach((closeButton) => {
        closeButton.addEventListener('click', function () {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
        });
    });

    
    window.addEventListener('click', function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        } else if (event.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    
    const registerForm = document.querySelector('#registerModal form');
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent traditional form submission

            const formData = new FormData(registerForm);

            fetch('/register', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert('Registro exitoso');
                        if (registerModal) registerModal.style.display = 'none';
                    } else {
                        alert('Hubo un error al registrar');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error en el envío del formulario');
                });
        });
    }

    // Handle login form submission
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent traditional form submission

            const formData = new FormData(loginForm);

            fetch('/login', {
                method: 'POST',
                body: formData,
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        alert('Inicio de sesión exitoso');
                        if (loginModal) loginModal.style.display = 'none';
                        // Redirect directly to Avatar.html
                        window.location.href = '/Avatar';
                    } else {
                        alert('Credenciales incorrectas');
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error en el envío del formulario');
                });
        });
    }
});
