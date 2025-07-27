import { Router } from 'express'
import {
  addToCartHandler,
  getCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} from '../controllers/cart.controller'

const router = Router()

// prefix: /api/v1/cart

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get the authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', getCartHandler)


/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64fbc1f79b0cdd2c1e59df9d
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 *       400:
 *         description: Validation error or product not found
 *       401:
 *         description: Unauthorized
 */
router.post('/', addToCartHandler)


/**
 * @swagger
 * /api/v1/cart/{productId}:
 *   put:
 *     summary: Update quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update in the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Validation error or product not in cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
router.put('/:productId', updateCartItemHandler)



/**
 * @swagger
 * /api/v1/cart/{productId}:
 *   delete:
 *     summary: Remove a specific item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to remove from the cart
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found or item not in cart
 */
router.delete('/:productId', removeCartItemHandler)




/**
 * @swagger
 * /api/v1/cart:
 *   delete:
 *     summary: Clear all items from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/', clearCartHandler)

export default router