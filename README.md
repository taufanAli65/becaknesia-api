# Becaknesia API

Becaknesia API is a backend service for managing a tourism platform focused on traditional "becak" (pedicab) tours. It provides endpoints for user authentication, tour packages, places, driver management, and admin operations.

## Table of Contents

- [About](#about)
- [Requirements](#requirements)
- [How to Run](#how-to-run)
- [Models](#models)
- [API Usage](#api-usage)

---

## About

This API powers the Becaknesia platform, enabling users to register, book tours, review drivers and tours, and for admins to manage drivers, tours, and places. It uses Node.js, Express, MongoDB, and integrates with Supabase for file storage and Nodemailer for email verification.

---

## Requirements

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or remote)
- Supabase account (for file uploads)
- Gmail or SMTP credentials (for email sending)
- Environment variables set in a `.env` file (see below)

### Example `.env` file

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

VERIFICATION_URL=http://localhost:3000
```

---

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up your `.env` file** (see above).

3. **Start MongoDB** (if running locally).

4. **Run the server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The API will be available at `http://localhost:3000`.

---

## Models

### User

| Field                   | Type     | Description                        |
|-------------------------|----------|------------------------------------|
| name                    | string   | User's name                        |
| password                | string   | Hashed password                    |
| email                   | string   | Unique email address               |
| no_hp                   | string   | Phone number                       |
| role                    | enum     | `user` \| `admin` \| `driver`      |
| status                  | enum     | `aktif` \| `nonaktif`              |
| photoUrl                | string   | Profile photo URL                  |
| verificationToken       | string   | Email verification token           |
| verificationTokenExpires| Date     | Token expiry date                  |
| created_at              | Date     | Created timestamp                  |
| update_at               | Date     | Updated timestamp                  |

### Tour

| Field        | Type         | Description                  |
|--------------|--------------|------------------------------|
| route_name   | string       | Name of the tour route       |
| description  | string       | Description of the tour      |
| duration     | number       | Duration (minutes/hours)     |
| distances    | number       | Distance (km)                |
| routes       | string[]     | List of place IDs/names      |
| prices       | number       | Price                        |
| photo_url    | string       | Photo URL                    |
| created_at   | Date         | Created timestamp            |
| update_at    | Date         | Updated timestamp            |

### Place

| Field        | Type     | Description                  |
|--------------|----------|------------------------------|
| name         | string   | Place name                   |
| coordinates  | string   | Latitude,Longitude           |
| description  | string   | Description                  |
| photo_url    | string   | Photo URL                    |
| created_at   | Date     | Created timestamp            |
| updated_at   | Date     | Updated timestamp            |

### Driver

| Field        | Type         | Description                  |
|--------------|--------------|------------------------------|
| user_id      | ObjectId     | Reference to User            |
| status       | enum         | `active` \| `suspend`        |
| created_at   | Date         | Created timestamp            |
| update_at    | Date         | Updated timestamp            |

### Driver Availability

| Field        | Type         | Description                  |
|--------------|--------------|------------------------------|
| driver_id    | ObjectId     | Reference to Driver          |
| days         | string[]     | Days available (`monday` ... `sunday`) |
| times        | string[]     | Time slots (`08.00 - 10.00`, etc.)     |
| created_at   | Date         | Created timestamp            |
| updated_at   | Date         | Updated timestamp            |

### Order

| Field           | Type         | Description                  |
|-----------------|--------------|------------------------------|
| user_id         | ObjectId     | Reference to User            |
| tour_id         | ObjectId     | Reference to Tour            |
| payment_method  | enum         | `cash` \| `qris`             |
| order_status    | enum         | `waiting` \| `accepted` \| `done` \| `canceled` |
| total           | number       | Total price                  |
| payment_status  | enum         | `pending` \| `success` \| `failed` |
| pickup_location | string       | Pickup location              |
| pickup_time     | string       | Pickup time                  |
| created_at      | Date         | Created timestamp            |
| update_at       | Date         | Updated timestamp            |

---

## API Endpoints

### Auth

- **POST `/auth/register`**
  - Register a new user.
  - Body: `name`, `password`, `email`, `no_hp`, `role`, `photo` (multipart/form-data)
- **GET `/auth/activate`**
  - Activate user account (requires authentication and token in user object)
- **POST `/auth/resend-verification-email`**
  - Resend verification email (requires authentication)
- **POST `/auth/login`**
  - Login user.
  - Body: `email`, `password`
- **PUT `/auth/update`**
  - Update user data (requires authentication).
  - Body: any of `name`, `email`, `no_hp`, `photoUrl`

### Admin

- **POST `/admin/assign-driver`**
  - Assign a user as a driver (admin only).
  - Body: `id` (user id)

### Tour

- **POST `/tour/`**
  - Create a new tour package (admin only).
  - Body: `route_name`, `description`, `duration`, `distances`, `routes`, `prices`, `photo` (multipart/form-data)
- **GET `/tour/`**
  - Get all tour packages (admin only).
  - Query: `page`, `limit`
- **GET `/tour/:tourID`**
  - Get a specific tour package by ID (admin only).
- **PUT `/tour/:tourID`**
  - Update a tour package (admin only).
  - Body: any of `route_name`, `description`, `duration`, `distances`, `routes`, `prices`
- **DELETE `/tour/:tourID`**
  - Delete a tour package (admin only).

### Place

- **POST `/place/`**
  - Create a new place (admin only).
  - Body: `name`, `coordinates`, `description`, `photo_url`
- **GET `/place/`**
  - Get all places.
  - Query: `page`, `limit`
- **GET `/place/:place_id`**
  - Get a specific place by ID.
- **PUT `/place/:place_id`**
  - Update a place (admin only).
  - Body: any of `name`, `coordinates`, `description`, `photo_url`
- **DELETE `/place/:place_id`**
  - Delete a place (admin only).

### Driver

- **POST `/driver/availability`**
  - Add driver availabilities (driver only).
  - Body: `driver_id`, `days`, `times`

---

## Notes

- All protected routes require a valid JWT in the `Authorization: Bearer <token>` header.
- Admin and driver routes require appropriate roles.
- File uploads (photos) use Supabase Storage.
- Email verification is required for account activation.

---

For further details, see the code and inline documentation.
