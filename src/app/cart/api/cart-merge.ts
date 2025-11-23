import { CartAPI } from './cart-api';
import { GuestCartService } from '../services/guest-cart.service';

/**
 * Fusionne le panier invité avec le panier utilisateur connecté côté backend.
 * Envoie les items du panier invité au backend, puis supprime le panier invité local.
 */
export async function mergeGuestCartWithUserCart(userId?: string) {
  const guestCart = GuestCartService.getCart();
  if (!guestCart || !guestCart.items.length) return;
    console.log('Merging guest cart with user cart. Guest cart items:', guestCart.items);
    for (const item of guestCart.items) {
    try {
      await CartAPI.addToCart({
        productId: item.productId,
        quantity: item.quantity,
        userId,
      });
    } catch (e) {
      // Ignore les erreurs pour éviter de bloquer la fusion
      // (ex: doublon, stock, etc.)
      // On pourrait améliorer la gestion ici si besoin
    }
  }
  // Supprime le panier invité local
  GuestCartService.deleteGuestCart();
}
