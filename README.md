# Becaknesia API Documentation

## Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or remote)
- Supabase account (for file storage)
- Email provider credentials (for verification emails)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URL=mongodb://localhost:27017/becaknesia
JWT_SECRET=your_jwt_secret
SALTROUNDS=10

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_NAME=your_bucket_name

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true

# Verification URL (for email links)
VERIFICATION_URL=http://localhost:3000

# (Optional) SendGrid/Mailgun configs if used
SENDGRID_API_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
DEFAULT_FROM_EMAIL=
DEFAULT_FROM_NAME=
```

## How to Run

1. **Install dependencies:**
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

2. **Start MongoDB** (if running locally).

3. **Run the API in development mode:**
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

   **Or run in production mode:**
   ```
   npm start
   ```

4. The API will be available at `http://localhost:3000` (or your configured port).

---

## Overview

This API powers the Becaknesia platform, enabling users to register, book tours, review drivers and tours, and for admins to manage drivers, tours, and places. It uses Node.js, Express, MongoDB, and integrates with Supabase for file storage and Nodemailer for email verification.
This documentation covers all available endpoints, required request parameters, authentication, and response formats.

---

## Table of Contents

- [Authentication](#authentication)
- [Models](#models)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Admin](#admin)
  - [Tour](#tour)
  - [Place](#place)
  - [Order](#order)
  - [Schedule](#schedule)
  - [Driver](#driver)
  - [Reviews](#reviews)
- [API Response Format](#api-response-format)

---

## Authentication

- Most endpoints require a Bearer JWT token in the `Authorization` header.
- Admin and driver endpoints require specific roles.
- Obtain a token via `/auth/login`.

**Header Example:**
```
Authorization: Bearer <your-jwt-token>
```

---

## Models

### Users

| Field                | Type     | Required | Description                |
|----------------------|----------|----------|----------------------------|
| _id                  | ObjectId | Yes      | User ID                    |
| name                 | String   | Yes      | User's name                |
| password             | String   | Yes      | Hashed password            |
| email                | String   | Yes      | Unique email address       |
| no_hp                | String   | Yes      | Phone number               |
| role                 | Enum     | Yes      | user, admin, driver        |
| status               | Enum     | Yes      | aktif, nonaktif            |
| photoUrl             | String   | Yes      | Profile photo URL          |
| verificationToken    | String   | No       | Email verification token   |
| verificationTokenExpires | Date | No       | Token expiry               |
| created_at           | Date     | Yes      | Creation timestamp         |
| update_at            | Date     | Yes      | Last update timestamp      |

### Tours

| Field        | Type     | Required | Description           |
|--------------|----------|----------|-----------------------|
| _id          | ObjectId | Yes      | Tour ID               |
| route_name   | String   | Yes      | Name of the route     |
| description  | String   | Yes      | Description           |
| duration     | Number   | Yes      | Duration in hours     |
| distances    | Number   | Yes      | Distance in km        |
| routes       | [String] | Yes      | List of places        |
| prices       | Number   | Yes      | Price                 |
| photo_url    | String   | Yes      | Photo URL             |
| created_at   | Date     | Yes      | Creation timestamp    |
| update_at    | Date     | Yes      | Last update timestamp |

### Places

| Field        | Type     | Required | Description           |
|--------------|----------|----------|-----------------------|
| _id          | ObjectId | Yes      | Place ID              |
| name         | String   | Yes      | Place name            |
| coordinates  | String   | Yes      | Coordinates           |
| description  | String   | Yes      | Description           |
| photo_url    | String   | Yes      | Photo URL             |
| created_at   | Date     | Yes      | Creation timestamp    |
| update_at    | Date     | Yes      | Last update timestamp |

### Orders

| Field          | Type     | Required | Description           |
|----------------|----------|----------|-----------------------|
| _id            | ObjectId | Yes      | Order ID              |
| user_id        | ObjectId | Yes      | User reference        |
| tour_id        | ObjectId | Yes      | Tour reference        |
| payment_method | Enum     | Yes      | cash, qris            |
| order_status   | Enum     | Yes      | waiting, accepted, done, canceled |
| total          | String   | Yes      | Total price           |
| payment_status | Enum     | Yes      | failed, success, pending |
| pickup_location| String   | Yes      | Pickup location       |
| pickup_time    | String   | Yes      | Pickup time           |
| created_at     | Date     | Yes      | Creation timestamp    |
| update_at      | Date     | Yes      | Last update timestamp |

### Schedules

| Field        | Type     | Required | Description           |
|--------------|----------|----------|-----------------------|
| _id          | ObjectId | Yes      | Schedule ID           |
| order_id     | ObjectId | Yes      | Order reference       |
| driver_id    | ObjectId | Yes      | Driver reference      |
| times        | String   | Yes      | Time slot             |
| available    | Boolean  | Yes      | Is available          |
| created_at   | Date     | Yes      | Creation timestamp    |
| update_at    | Date     | Yes      | Last update timestamp |

### Driver Reviews

| Field        | Type     | Required | Description           |
|--------------|----------|----------|-----------------------|
| _id          | ObjectId | Yes      | Review ID             |
| user_id      | ObjectId | Yes      | User reference        |
| driver_id    | ObjectId | Yes      | Driver reference      |
| order_id     | ObjectId | Yes      | Order reference       |
| stars        | Number   | Yes      | 1-5 rating            |
| comment      | String   | Yes      | Review comment        |
| created_at   | Date     | Yes      | Creation timestamp    |
| updated_at   | Date     | Yes      | Last update timestamp |

### Tour Reviews

| Field        | Type     | Required | Description           |
|--------------|----------|----------|-----------------------|
| _id          | ObjectId | Yes      | Review ID             |
| user_id      | ObjectId | Yes      | User reference        |
| tour_id      | ObjectId | Yes      | Tour reference        |
| stars        | Number   | Yes      | 1-5 rating            |
| comment      | String   | Yes      | Review comment        |
| created_at   | Date     | Yes      | Creation timestamp    |
| updated_at   | Date     | Yes      | Last update timestamp |

---

## Endpoints

### Auth

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/auth/register`           | Register new user          | No           | name, password, email, no_hp, photo (file) |
| POST   | `/auth/login`              | Login and get JWT token    | No           | email, password                   |
| GET    | `/auth/activate`           | Activate user via token    | No           | token (query param)               |
| POST   | `/auth/resend-verification-email` | Resend verification email | No           | email                             |
| PUT    | `/auth/update`             | Update user profile        | Yes          | name, email, no_hp, photoUrl      |

### Admin

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/admin/assign-driver`     | Assign user as driver      | Admin        | id (user id)                      |

### Tour

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/tour/`                   | Create new tour package    | Admin        | route_name, description, duration, distances, routes, prices, photo (file) |
| GET    | `/tour/`                   | Get all tour packages      | No           | page, limit, search (query)       |
| GET    | `/tour/:tourID`            | Get tour package by ID     | No           | tourID (param)                    |
| PUT    | `/tour/:tourID`            | Update tour package        | Admin        | fields to update, photo (file)    |
| DELETE | `/tour/:tourID`            | Delete tour package        | Admin        | tourID (param)                    |

### Place

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/place/`                  | Create new place           | Admin        | name, coordinates, description, photo (file) |
| GET    | `/place/`                  | Get all places             | No           | page, limit, search (query)       |
| GET    | `/place/:place_id`         | Get place by ID            | No           | place_id (param)                  |
| PUT    | `/place/:place_id`         | Update place               | Admin        | fields to update, photo (file)    |
| DELETE | `/place/:place_id`         | Delete place               | Admin        | place_id (param)                  |

### Order

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/order/`                  | Create new order           | User         | tour_id, payment_method, total, pickup_location, pickup_time |
| GET    | `/order/`                  | Get all orders             | User         | page, limit, search (query)       |
| GET    | `/order/:order_id`         | Get order by ID            | User         | order_id (param)                  |
| PUT    | `/order/:order_id`         | Update order               | User         | fields to update                  |
| DELETE | `/order/:order_id`         | Delete order               | User         | order_id (param)                  |

### Schedule

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/schedule/`               | Create schedule            | Admin        | order_id, driver_id, times, available |
| GET    | `/schedule/`               | Get all schedules          | Admin        | page, limit, week (query)         |
| GET    | `/schedule/:schedule_id`   | Get schedule by ID         | Admin        | schedule_id (param)               |
| PUT    | `/schedule/:schedule_id`   | Update schedule            | Admin        | fields to update                  |
| DELETE | `/schedule/:schedule_id`   | Delete schedule            | Admin        | schedule_id (param)               |

### Driver

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/driver/availability`     | Add driver availabilities  | Driver       | driver_id, days, times            |

### Reviews

#### Driver Reviews

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/review/driver/`          | Add driver review          | User         | driver_id, order_id, stars, comment |
| GET    | `/review/driver/`          | Get all driver reviews     | No           | page, limit, search (query)       |
| GET    | `/review/driver/:review_id`| Get driver review by ID    | No           | review_id (param)                 |
| PUT    | `/review/driver/:review_id`| Update driver review       | User         | stars, comment                    |
| DELETE | `/review/driver/:review_id`| Delete driver review       | User         | review_id (param)                 |

#### Tour Reviews

| Method | Endpoint                   | Description                | Auth Required | Body/Params                       |
|--------|----------------------------|----------------------------|--------------|-----------------------------------|
| POST   | `/review/tour/`            | Add tour review            | User         | tour_id, stars, comment           |
| GET    | `/review/tour/`            | Get all tour reviews       | No           | page, limit, search (query)       |
| GET    | `/review/tour/:review_id`  | Get tour review by ID      | No           | review_id (param)                 |
| PUT    | `/review/tour/:review_id`  | Update tour review         | User         | stars, comment                    |
| DELETE | `/review/tour/:review_id`  | Delete tour review         | User         | review_id (param)                 |

---

## API Response Format

All responses follow this structure:

```json
{
  "status": "success" | "fail",
  "message": "Description of the result",
  "data": { ... } // or null
}
```

### Example Success

```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": {
    "_id": "665b7c...",
    "user_id": "...",
    "tour_id": "...",
    "payment_method": "cash",
    "order_status": "waiting",
    "total": "100000",
    "payment_status": "pending",
    "pickup_location": "Hotel ABC",
    "pickup_time": "2024-06-10T09:00:00Z",
    "created_at": "2024-06-10T08:00:00Z",
    "update_at": "2024-06-10T08:00:00Z"
  }
}
```

### Example Error

```json
{
  "status": "fail",
  "message": "Validation failed",
  "data": {
    "email": "Invalid email address"
  }
}
```

---

## Notes

- All endpoints requiring authentication must include a valid JWT token.
- Admin endpoints require the user to have the `admin` role.
- File uploads (photo) must use `multipart/form-data`.
- Pagination: use `page` and `limit` query parameters.
- For enums, use the exact string values as shown in the models.

---

For further questions, please refer to the codebase or contact the maintainers.

