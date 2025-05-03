// Función para buscar restaurantes
function searchRestaurants() {
    const searchQuery = document.getElementById("restaurant-search").value.toLowerCase();
    const restaurants = document.querySelectorAll(".restaurant");

    // Filtra restaurantes según el texto ingresado en el buscador
    restaurants.forEach(restaurant => {
        const name = restaurant.querySelector("h3").textContent.toLowerCase();
        if (name.includes(searchQuery)) {
            restaurant.style.display = "block";  // Mostrar restaurante si coincide
        } else {
            restaurant.style.display = "none";   // Ocultar restaurante si no coincide
        }
    });
}
