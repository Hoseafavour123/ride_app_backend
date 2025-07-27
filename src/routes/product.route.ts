import { Router } from 'express'
import {
  addProductImageHandler,
  createProductHandler,
  deleteProductHandler,
  deleteProductImageHandler,
  getAllProductsHandler,
  getInventoryOverview,
  getProductByIdHandler,
  searchProductsHandler,
  updateProductHandler,
  updateStockHandler,

} from '../controllers/product.controller'
import upload from '../utils/multer'
import { authenticate } from '../middleware/authenticate'
import Audience from '../constants/audience'

const router = Router()

// prefix: /api/v1/products






/**
 * @swagger
 * /products/inventory-overview:
 *   get:
 *     summary: Get an overview of product inventory
 *     description: Returns an overview including total inventory.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory overview retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                   example: 120
 *                 outOfStock:
 *                   type: integer
 *                   example: 8
 *                 lowStock:
 *                   type: integer
 *                   example: 15
 *                 stockByCategory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       totalStock:
 *                         type: integer
 *                         example: 42
 *                 recentProducts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Wireless Mouse
 *                       inStock:
 *                         type: integer
 *                         example: 20
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-07-26T12:34:56.789Z
 *       401:
 *         description: Unauthorized - Admin token required
 *       500:
 *         description: Server error
 */
router.get(
  '/inventory-overview',
  authenticate(Audience.Admin),
  getInventoryOverview
)




/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - inStock
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               inStock:
 *                 type: integer
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticate(Audience.Admin), upload.array('images'), createProductHandler)// Admin only




/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', getAllProductsHandler)


/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search and filter products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search in name and description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID or name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filter by availability (true/false)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: A list of filtered and paginated products
 */
router.get('/search', searchProductsHandler)




/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID
 */
router.get('/:productId', getProductByIdHandler)


/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: T-Shirt
 *               description:
 *                 type: string
 *                 example: A soft cotton t-shirt
 *               price:
 *                 type: number
 *                 example: 19.99
 *               inStock:
 *                 type: number
 *                 example: 100
 *               discountPrice:
 *                type: number
 *                example: 15.99
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put('/:productId', authenticate(Audience.Admin), updateProductHandler)


/**
 * @swagger
 * /products/{productId}/images:
 *   post:
 *     summary: Upload an image to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add an image to
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Image missing or maximum image limit exceeded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/:productId/images', authenticate(Audience.Admin), upload.single('image'), addProductImageHandler)




/**
 * @swagger
 * /products/{productId}/images/{imageId}:
 *   delete:
 *     summary: Delete an image from a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The public_id of the image to delete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageId:
 *                 type: string
 *                 example: products/image123
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Invalid image ID or request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/:productId/images', authenticate(Audience.Admin), deleteProductImageHandler)


/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/:productId', authenticate(Audience.Admin), deleteProductHandler)

/**
 * @swagger
 * /products/{productId}/stock:
 *   put:
 *     summary: Update product stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update stock for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 50
 *               action:
 *                 type: string
 *                 enum: [INCREASE, DECREASE]
 *                 example: INCREASE
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       400:
 *         description: Invalid input or insufficient stock to decrease
 */
router.put('/:productId/stock', updateStockHandler)




export default router