// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Estado del carrito en memoria local
    let cart = [];
    
    // Elementos del DOM
    const addButtons = document.querySelectorAll('.btn-add-cart');
    const cartBadge = document.getElementById('cartBadge');
    const cartWidget = document.getElementById('cartWidget');

    // Función para actualizar la burbuja numérica del carrito
    function updateCartUI() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }

    // Evento para añadir productos al hacer click en "Comprar"
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Buscamos la tarjeta contenedora del producto para extraer los datos
            const card = e.target.closest('.card');
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'), 10);

            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.find(item => item.name === name);

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            // Actualizar interfaz
            updateCartUI();

            // Pequeño feedback visual en el botón
            const originalContent = button.innerHTML;
            button.innerHTML = '¡Agregado! <i class="fas fa-check"></i>';
            button.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.style.backgroundColor = '';
            }, 1000);
        });
    });

    // Evento al hacer click en el botón flotante del carrito
    cartWidget.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. ¡Explorá nuestros artículos impresos en 3D para añadir alguno!');
            return;
        }

        // Construcción del desglose del pedido de forma entendible
        let summary = '🛒 DETALLE DE TU CARRITO Deco3D:\n\n';
        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            summary += `- ${item.name} (x${item.quantity}): $${subtotal}\n`;
            total += subtotal;
        });

        summary += `\n💰 TOTAL DE LA COMPRA: $${total}\n\n¿Querés proceder a finalizar tu pedido mediante nuestro formulario de contacto?`;

        // Confirmación simulada
        if (confirm(summary)) {
            // Si acepta, se lo desplaza automáticamente al formulario de contacto
            document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
            
            // Pre-rellenamos el cuadro de mensaje con su pedido para facilitarle la compra humana
            const mensajeInput = document.getElementById('mensaje');
            let formText = `Hola Deco3D! Me gustaría encargar el siguiente pedido:\n`;
            cart.forEach(item => {
                formText += `- ${item.name} (Cantidad: ${item.quantity})\n`;
            });
            formText += `Total estimado: $${total}. Aguardo su respuesta para coordinar el pago y envío.`;
            mensajeInput.value = formText;
        }
    });
});
