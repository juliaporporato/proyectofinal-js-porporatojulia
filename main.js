// Clase para representar un menú
class Menu {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }
}

// Array de menús disponibles
let menus = [];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Variables DOM
const menusContainer = document.getElementById('menus-container');
const cartContainer = document.getElementById('cart-container');
const finalizeButton = document.getElementById('finalize-button');
const clearCartButton = document.getElementById('clear-cart-button');

// Función para obtener menús desde un JSON local
async function fetchMenus() {
    try {
        const response = await axios.get('menus.json');
        menus = response.data.map(menu => new Menu(menu.id, menu.nombre, menu.precio));
        displayMenus();
    } catch (error) {
        console.error('Error al cargar los menús:', error);
    }
}

// Función para mostrar menús y carrito
function displayMenus() {
    menusContainer.innerHTML = menus.map(menu => `
        <div class="menu">
            <span>${menu.nombre} - $${menu.precio}</span>
            <button data-id="${menu.id}">Añadir al carrito</button>
        </div>
    `).join('');

    // Añadir eventos a los botones de añadir al carrito
    menusContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(parseInt(button.dataset.id, 10));
        });
    });
}

function displayCart() {
    cartContainer.innerHTML = cart.map((menu, index) => `
        <div class="cart-item">
            <span>${menu.nombre} - $${menu.precio}</span>
            <button data-index="${index}">Eliminar</button>
        </div>
    `).join('');

    // Añadir eventos a los botones de eliminar del carrito
    cartContainer.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            removeFromCart(parseInt(button.dataset.index, 10));
        });
    });
}

// Añadir un menú al carrito
function addToCart(menuId) {
    const menu = menus.find(m => m.id === menuId);
    cart.push(menu);
    updateCartStorage();
    displayCart();
}

// Eliminar un menú del carrito
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        updateCartStorage();
        displayCart();
    } else {
        Swal.fire('Índice inválido');
    }
}

// Actualizar el carrito en localStorage
function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Finalizar la compra
function finalizePurchase() {
    if (cart.length === 0) {
        Swal.fire('El carrito está vacío.');
    } else {
        const total = cart.reduce((sum, menu) => sum + menu.precio, 0);
        Swal.fire(`Compra finalizada. Total: $${total}`);
        cart = [];
        updateCartStorage();
        displayCart();
    }
}

// Vaciar el carrito
function clearCart() {
    cart = [];
    updateCartStorage();
    displayCart();
}

// Inicializar la vista
fetchMenus();
displayCart();

// Añadir eventos a los botones de finalizar y vaciar carrito
finalizeButton.addEventListener('click', finalizePurchase);
clearCartButton.addEventListener('click', clearCart);
