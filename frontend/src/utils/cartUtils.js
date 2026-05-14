/**
 * Utility functions for managing guest cart in localStorage.
 * 
 * Each item is keyed by `variant_id-color_id` to ensure
 * different variant/color combos are treated as separate products.
 */

const CART_KEY = "guest_cart";

/**
 * Get all items from the guest cart.
 * @returns {Array} Array of cart items
 */
export function getGuestCart() {
    try {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch {
        return [];
    }
}

/**
 * Save the entire cart array to localStorage.
 * @param {Array} cart 
 */
function saveGuestCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/**
 * Generate a unique key for a cart item based on variant and color.
 */
function itemKey(variantId, colorId) {
    return `${variantId}-${colorId || "none"}`;
}

/**
 * Add an item to the guest cart. If the same variant+color exists, increment quantity.
 * @param {Object} params
 * @param {number} params.variant_id
 * @param {number|null} params.color_id
 * @param {number} params.quantity
 * @param {Object} params.productInfo - { product_id, product_name, product_image, variant_name, variant_price, color_name, color_hex }
 * @returns {Array} Updated cart
 */
export function addToGuestCart({ variant_id, color_id, quantity = 1, productInfo }) {
    const cart = getGuestCart();
    const key = itemKey(variant_id, color_id);

    const existingIndex = cart.findIndex(item => itemKey(item.variant_id, item.color_id) === key);

    if (existingIndex !== -1) {
        // Cộng dồn số lượng
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].subtotal = cart[existingIndex].quantity * parseFloat(cart[existingIndex].variant_price);
    } else {
        // Thêm mới
        const price = parseFloat(productInfo.variant_price);
        cart.push({
            // ID tạm cho localStorage (dùng timestamp)
            id: `local-${Date.now()}`,
            variant_id,
            color_id: color_id || null,
            quantity,
            product_id: productInfo.product_id,
            product_name: productInfo.product_name,
            product_image: productInfo.product_image,
            variant: {
                id: variant_id,
                name: productInfo.variant_name,
                price: price,
                stock: 999, // Không biết stock khi offline
            },
            color_name: productInfo.color_name || null,
            color_hex: productInfo.color_hex || null,
            variant_price: price,
            subtotal: quantity * price,
            _localKey: key,
        });
    }

    saveGuestCart(cart);
    return cart;
}

/**
 * Update the quantity of a guest cart item by its local id.
 * @param {string} itemId 
 * @param {number} newQuantity 
 * @returns {Array} Updated cart
 */
export function updateGuestCartItem(itemId, newQuantity) {
    const cart = getGuestCart();
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        if (newQuantity < 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQuantity;
            cart[index].subtotal = newQuantity * parseFloat(cart[index].variant_price);
        }
    }
    saveGuestCart(cart);
    return cart;
}

/**
 * Remove an item from the guest cart by its local id.
 * @param {string} itemId 
 * @returns {Array} Updated cart
 */
export function removeGuestCartItem(itemId) {
    let cart = getGuestCart();
    cart = cart.filter(item => item.id !== itemId);
    saveGuestCart(cart);
    return cart;
}

/**
 * Clear the entire guest cart (e.g., after syncing to server on login).
 */
export function clearGuestCart() {
    localStorage.removeItem(CART_KEY);
}

/**
 * Change the variant of a guest cart item.
 * @param {string} itemId - The local item ID
 * @param {Object} newVariant - { id, name, price, stock }
 * @returns {Array} Updated cart
 */
export function changeGuestCartItemVariant(itemId, newVariant) {
    const cart = getGuestCart();
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const item = cart[index];
        item.variant_id = newVariant.id;
        item.variant = {
            id: newVariant.id,
            name: newVariant.name,
            price: parseFloat(newVariant.price),
            stock: newVariant.stock || 999,
        };
        item.variant_price = parseFloat(newVariant.price);
        item.subtotal = item.quantity * parseFloat(newVariant.price);
        item._localKey = itemKey(newVariant.id, item.color_id);
    }
    saveGuestCart(cart);
    return cart;
}

/**
 * Change the color of a guest cart item.
 * @param {string} itemId - The local item ID
 * @param {Object} newColor - { id, name, hex_code }
 * @returns {Array} Updated cart
 */
export function changeGuestCartItemColor(itemId, newColor) {
    const cart = getGuestCart();
    const index = cart.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const item = cart[index];
        item.color_id = newColor.id;
        item.color_name = newColor.name;
        item.color_hex = newColor.hex_code;
        item._localKey = itemKey(item.variant_id, newColor.id);
    }
    saveGuestCart(cart);
    return cart;
}

/**
 * Get the total price of the guest cart.
 * @returns {number}
 */
export function getGuestCartTotal() {
    const cart = getGuestCart();
    return cart.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
}
