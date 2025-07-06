#  Milestone 2 – Ride & Delivery Features + Dashcam Upload + Safety APIs

This milestone includes all APIs required for the ride-booking experience, parcel delivery, real-time driver management, safety flows, and dashcam upload support.

---

##  Features Covered

-  Ride Booking (with driver accept/reject)
-  Package Delivery Workflow
-  Fare Estimation
-  Dashcam Upload (Cloudinary)
-  SOS Emergency Trigger (webhook + fallback email)
-  Webhook Receiver (for security ops)
-  Driver Dashboard (status, earnings, rating)
-  Ratings & Reviews

---

##  Tech Stack

| Layer | Tool |
|-------|------|
| Backend | Node.js, Express, MongoDB, TypeScript |
| Auth | JWT (Access + Refresh Tokens) |
| Location | MongoDB 2dsphere indexing |
| File Upload | Cloudinary |
| Emergency Alerts | Internal webhook + Resend (email fallback) |
| Docs | Swagger (OpenAPI 3.0), Postman Collection |

---

##  How to Test

1. Clone the repo and install dependencies:

   ```bash
   git clone <repo>
   cd ride_app_backend
   npm install


## ENDPOINT DESCRIPTIONS 

###  Ride Booking

These endpoints allow passengers to book rides, check ride status, and view ride history.

| Method | Endpoint                     | Description |
|--------|------------------------------|-------------|
| POST   | `/api/v1/ride/book`          | Passenger books a new ride |
| GET    | `/api/v1/ride/:rideId/status`| Get current status of a ride |
| GET    | `/api/v1/ride/passenger`     | Get ride history for the logged-in passenger |



### Ride Matching Endpoint

Triggers the ride-matching logic to notify nearby available drivers for a ride.

| Method | Endpoint                                | Description |
|--------|-----------------------------------------|-------------|
| POST   | `/api/v1/matching/notify-drivers/:rideId` | Find nearby drivers and send ride requests |



###  Driver Ride & Dashboard Endpoints

These endpoints are used by drivers to manage their ride lifecycle and personal dashboard.

| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| PUT    | `/api/v1/driver/status`           | Update driver’s real-time location |
| POST   | `/api/v1/driver/ride/:rideId/accept` | Accept a ride request |
| POST   | `/api/v1/driver/ride/:rideId/reject` | Reject a ride request |
| PUT    | `/api/v1/driver/ride/:rideId/start`   | Start the ride |
| PUT    | `/api/v1/driver/ride/:rideId/complete`| Complete the ride |
| GET    | `/api/v1/driver/rides`           | Get driver’s ride history |
| GET    | `/api/v1/driver/dashboard`       | Get driver dashboard data (earnings, rating, etc.) |
| PUT    | `/api/v1/driver/availability`    | Update availability (ONLINE/OFFLINE) |



### Package Delivery Endpoints

This set of endpoints handles parcel delivery from booking to driver assignment and delivery tracking.

| Method | Endpoint                               | Description |
|--------|----------------------------------------|-------------|
| POST   | `/api/v1/delivery/`                    | Book a new package delivery |
| POST   | `/api/v1/delivery/:deliveryId/notify`  | Notify nearby drivers (internal matching trigger) |
| POST   | `/api/v1/delivery/:deliveryId/accept`  | Driver accepts a delivery |
| POST   | `/api/v1/delivery/:deliveryId/reject`  | Driver rejects a delivery |
| PUT    | `/api/v1/delivery/:deliveryId/pickup`  | Mark package as picked up |
| PUT    | `/api/v1/delivery/:deliveryId/complete`| Mark package as delivered |
| GET    | `/api/v1/delivery/:deliveryId/status`  | Track the delivery status |



###  Dashcam Upload Endpoints

These endpoints manage the dashcam recording upload lifecycle. The actual file upload is handled directly by the client to Cloudinary using the signed config from `/upload/initiate`.

| Method | Endpoint                            | Description |
|--------|-------------------------------------|-------------|
| POST   | `/api/v1/dashcam/upload/initiate`   | Generate signed Cloudinary upload config |
| POST   | `/api/v1/dashcam/upload/complete`   | Mark the uploaded clip as complete |



### SOS Emergency Trigger

This endpoint allows a passenger or driver to trigger an emergency alert. It will notify the backend, which in turn calls internal security webhooks and sends fallback email alerts.

| Method | Endpoint              | Description |
|--------|-----------------------|-------------|
| POST   | `/api/v1/sos/trigger` | Trigger an emergency (SOS alert) |



### Ratings & Reviews

This endpoint allows passengers or drivers to submit a review after a ride is completed. Each user can only review once per ride.

| Method | Endpoint                 | Description |
|--------|--------------------------|-------------|
| POST   | `/api/v1/reviews/submit` | Submit a rating and comment for a ride |


# Additional Notes
- SOS webhooks use both POST and fallback email (for reliability)
- All ride/delivery services are location-aware
- Cloudinary uploads are direct from mobile client (signed config from backend)
- JWTs must be sent as Authorization: Bearer <token> in protected routes
- Driver availability is required for ride matching