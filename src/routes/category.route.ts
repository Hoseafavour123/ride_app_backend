import { Router } from 'express'
import {
  createCategoryHandler,
  getCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/category.controller'
import { authenticate } from '../middleware/authenticate'
import Audience from '../constants/audience'

const router = Router()

// prefix: /api/v1/categories


/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Electronics"
 *               slug:
 *                 type: string
 *                 example: "electronics"
 *               description:
 *                 type: string
 *                 example: "Devices, gadgets, and accessories"
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticate(Audience.Admin), createCategoryHandler) // Admin only


/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/',  getCategoriesHandler)


/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 */
router.get('/:id', getCategoryByIdHandler)



/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated name"
 *               slug:
 *                 type: string
 *                 example: "updated-slug"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *     responses:
 *       200:
 *         description: Category updated
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Category not found
 */
router.put('/:id', authenticate(Audience.Admin), updateCategoryHandler) // Admin only




/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Category not found
 */
router.delete('/:id', authenticate(Audience.Admin), deleteCategoryHandler) // Admin only

export default router
