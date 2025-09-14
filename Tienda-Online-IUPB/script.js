// Lista de productos (puedes modificarla o consumir una API)
const products = [
    { id: 1, name: "Portatil TUF Gamer", price: 3200000, image: "IMG/pc1.webp" },
    { id: 2, name: "Portatil MAC", price: 4000000, image: "IMG/pc2.webp" },
    { id: 3, name: "Portatil IdeaPad", price: 2500000, image: "IMG/pc3.webp" },
    { id: 4, name: "Portatil LOQ", price: 2000000, image: "IMG/pc4.webp" },
    { id: 5, name: "Portatil AZUS", price: 1900000, image: "IMG/pc5.webp" },
    { id: 6, name: "Portatil HP  IA", price: 2300000, image: "IMG/pc6.webp" }
];

// Carrito
let cart = [];

// Función para renderizar los productos
function renderProducts() {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";
    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Función para agregar un producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
}

// Función para renderizar el carrito
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");

        cartItemElement.innerHTML = `
            <span>${item.name}</span>
            <div class="cantidad">
                <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
            </div>
            <span>$${item.price * item.quantity}</span>
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    document.getElementById("total-price").textContent = total.toFixed(2);
}

// Nueva función para cambiar cantidad
function cambiarCantidad(productId, cambio) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += cambio;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId); // eliminar si llega a 0
        }
        renderCart();
    }
}


// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Evento para finalizar compra
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("El carrito está vacío");
    } else {
        alert("Compra finalizada. Total: $" + document.getElementById("total-price").textContent);
        cart = [];
        renderCart();
    }
});

// Inicializar la página
renderProducts();


//resaltar por poductos
let indiceResaltado = -1;

function resaltar(indice) {
    const productosHTML = document.querySelectorAll(".product"); 
    // Quita la clase 'resaltado' de todos los productos
    productosHTML.forEach(el => el.classList.remove("resaltado")); 
    // Si el indice es válido, aplica 'resaltado' al producto correspondiente
    if (indice >= 0 && indice < productosHTML.length) {
        productosHTML[indice].classList.add("resaltado");
        indiceResaltado = indice;
    }
}

// Eventos de teclado
document.addEventListener('keydown', (evento) => {
  const foco = document.activeElement; 
  // Verifica si el usuario está escribiendo en un input/textarea para no interferir
  const estaEnInput = foco
    && (foco.tagName === 'INPUT' || foco.tagName === 'TEXTAREA' || foco.isContentEditable);

  const productosHTML = document.querySelectorAll('.product');

  // Tecla Escape para limpiar buscador
  if (evento.key === 'Escape') {
    const buscador = document.getElementById('search');
    if (buscador) {
      buscador.value = "";     
      renderProducts();        
      indiceResaltado = -1;    
      buscador.focus();       
      evento.preventDefault();
    }
    return;
  }

  // Si el usuario está en un input, no aplicamos navegación con teclas
  if (estaEnInput) return;

  if (productosHTML.length === 0) return;

  // Navegación con teclas 
  if (evento.key === 'ArrowDown'  || evento.key === 'ArrowRight') {
    evento.preventDefault(); 
    if (indiceResaltado < productosHTML.length - 1) {
      resaltar(indiceResaltado + 1); // Resalta el siguiente producto
    } else {
      resaltar(0); // Si está en el ultimo vuelve al primero
    }
  } 
  else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
    evento.preventDefault();
    if (indiceResaltado > 0) {
      resaltar(indiceResaltado - 1); // Resalta el producto anterior
    } else {
      resaltar(productosHTML.length - 1); // Si está en el primero pasa al último
    }
  } 
  // Enter → agrega el producto resaltado al carrito
  else if (evento.key === 'Enter') {
    evento.preventDefault();
    if (indiceResaltado >= 0) {
      const idProducto = products[indiceResaltado].id;
      addToCart(idProducto); // Agrega al carrito el producto resaltado
    }
  }
});


document.addEventListener("click", () => {
    document.getElementById("menu-contextual").style.display = "none";
});


document.getElementById("opcion-eliminar").addEventListener("click", () => {
    const menu = document.getElementById("menu-contextual");
    const id = parseInt(menu.getAttribute("data-id")); // Obtiene id del producto
    removeFromCart(id); 
    menu.style.display = "none"; 
});


document.getElementById("opcion-cantidad").addEventListener("click", () => {
    const menu = document.getElementById("menu-contextual");
    const id = parseInt(menu.getAttribute("data-id")); 
    const nuevoValor = parseInt(prompt("Ingrese nueva cantidad:")); 
    if (!isNaN(nuevoValor) && nuevoValor > 0) {
        const item = cart.find(i => i.id === id);
        if (item) item.quantity = nuevoValor; 
        renderCart(); 
    }
    menu.style.display = "none"; 
});

//busqueda en tiempo real
document.getElementById("search").addEventListener("input", (evento) => {
    const texto = evento.target.value.toLowerCase(); 
    // Filtra productos nombre contenga el texto escrito
    const productosFiltrados = products.filter(producto =>
        producto.name.toLowerCase().includes(texto)
    );
    renderProducts(productosFiltrados);
    indiceResaltado = -1;
});

//renderizar productos
function renderProducts(lista = products) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = ""; // Limpia contenedor
    lista.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al Carrito</button>
        `;
        productsContainer.appendChild(productElement);
    });
}
