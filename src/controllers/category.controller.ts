import { Request, Response } from 'express'
import CategoryModel from '../models/category.model'
import catchErrors from '../utils/catchErrors'

// Create category
export const createCategoryHandler = catchErrors(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden' })
    }
    const { name, slug, description } = req.body
    const category = await CategoryModel.create({
      name,
      slug,
      description,
      createdBy: req.user?.id,
    })
    res.status(201).json({ msg: 'Category created', data: category })
  }
)

// Get all categories
export const getCategoriesHandler = catchErrors(
  async (_req: Request, res: Response) => {
    const categories = await CategoryModel.find().sort({ createdAt: -1 })
    res.json({ data: categories })
  }
)

// Get category by ID
export const getCategoryByIdHandler = catchErrors(
  async (req: Request, res: Response) => {
    const category = await CategoryModel.findById(req.params.id)
    if (!category) return res.status(404).json({ msg: 'Category not found' })
    res.json({ data: category })
  }
)

// Update category
export const updateCategoryHandler = catchErrors(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Forbidden' })
    }
    const updates = req.body
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )
    if (!category) return res.status(404).json({ msg: 'Category not found' })
    res.json({ msg: 'Updated', data: category })
  }
)

// Delete category
export const deleteCategoryHandler = catchErrors(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden' })
        }
    const category = await CategoryModel.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ msg: 'Category not found' })
    res.json({ msg: 'Category deleted' })
  }
)
