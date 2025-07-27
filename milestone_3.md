
# Milestone 3: E-Commerce & Inventory Management

This milestone introduces a fully functional product management and shopping system. It supports product browsing, categorization, shopping cart workflows, order placement, and robust admin-side inventory and order tracking capabilities.

---

## Features Implemented

### For Customers:
- Browse products with:
  - Category filter
  - Price range filter
  - Keyword search
  - Availability status
  - Pagination and sorting
- View individual product details
- Add items to shopping cart
- View and manage cart items
- Create orders with delivery info
- View order history

### For Admins:
- Create, update, and delete products
- Upload multiple product images
- Add/remove images from a product
- Manage product categories
- Track product stock levels
- Automated stock reduction during order placement
- Low-stock alert flag
- Get filtered list of orders (by status/date/email)
- View order history with pagination
- Admin inventory dashboard for total stock & low-stock

## API Modules

### Product Module

- `POST /api/v1/products` — Create product (with image upload to Cloudinary)
- `GET /api/v1/products` — Browse/search/filter/sort products
- `GET /api/v1/products/:id` — Get single product details
- `PUT /api/v1/products/:id` — Update product details
- `DELETE /api/v1/products/:id` — Delete product
- `POST /api/v1/products/:id/images` — Add new image(s)
- `DELETE /api/v1/products/:id/images/:publicId` — Delete a product image

### Category Module

- `POST /api/v1/categories` — Create new category
- `GET /api/v1/categories` — List all categories
- `PUT /api/v1/categories/:id` — Update category
- `DELETE /api/v1/categories/:id` — Delete category

### Cart Module

- `POST /api/v1/cart` — Add item to cart
- `GET /api/v1/cart` — View user cart
- `PUT /api/v1/cart/:productId` — Update quantity
- `DELETE /api/v1/cart/:productId` — Remove item

### Order Module

- `POST /api/v1/order` — Create order
- `GET /api/v1/order` — Get user order history
- `PUT /api/v1/order/:orderId/status` — Admin updates order status
- `GET /api/v1/order/admin` — Admin get all orders (paginated)
- `GET /api/v1/order/filter` — Admin filter orders (status/date/user)

### Inventory Dashboard

- `GET /api/v1/products/inventory-overview` — Get admin inventory stats:
  - Total products
  - Total stock count
  - Count of low-stock products

---

## Postman Collections

- All routes are available and testable via Postman.
- Image upload is handled via `multipart/form-data`.
- Authenticated routes require `Bearer <token>` headers.
- Example request bodies and responses are documented inline in each route folder.


## Validation & Architecture

- **Zod** is used for schema validation with inline parsing in controllers.
- **Error handling** is standardized using `catchErrors()` and `appAssert()`.
- Business logic is separated cleanly into `services/` folders.
- File structure follows RESTful, scalable patterns for eCommerce apps.

---

## Authentication

- All cart, order, product management, and inventory endpoints require JWT-authenticated users.
- Admin-only features are protected by role-based access control (RBAC).

---

##  What's Next?

> Milestone 4 will include:
- **Checkout payment integration**
- **Notifications (email/SMS/web)**
- **User profile & address book**
- **Admin analytics and reporting**
- **Sales dashboard**
