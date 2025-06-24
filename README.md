# Becaknesia API

## Overview

Becaknesia API is a backend service for managing a tour and ride-sharing platform focused on "becak" (traditional tricycles). It provides endpoints for user authentication, tour package management, driver assignment, order processing, and reviews. The API is built with Node.js, Express, MongoDB, and integrates with Supabase for file storage and email services for user verification.

---

## Requirements

- Node.js (v16+ recommended)
- MongoDB instance (local or remote)
- Supabase account (for file storage)
- Email service credentials (Gmail, SendGrid, or Mailgun)
- Environment variables configured (see below)

---

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SALTROUNDS=10

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET_NAME=your_supabase_bucket_name

# Email
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true

# Verification URL
VERIFICATION_URL=https://your-frontend-url.com

# (Optional) SendGrid/Mailgun
SENDGRID_API_KEY=
MAILGUN_API_KEY=
MAILGUN_DOMAIN=
```

---

## How to Run

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up your `.env` file** as described above.

3. **Start the server:**
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

4. The API will be available at `http://localhost:3000` (or your specified port).

---

## Models

### User

| Field                | Type     | Description                        |
|----------------------|----------|------------------------------------|
| name                 | String   | User's full name                   |
| password             | String   | Hashed password                    |
| email                | String   | Unique email address               |
| no_hp                | String   | Phone number                       |
| role                 | Enum     | `user`, `admin`, `driver`          |
| status               | Enum     | `aktif`, `nonaktif`                |
| photoUrl             | String   | Profile photo URL                  |
| verificationToken    | String   | Email verification token           |
| verificationTokenExpires | Date | Token expiration                   |
| created_at           | Date     |                                    |
| update_at            | Date     |                                    |

### Tour

| Field        | Type     | Description                  |
|--------------|----------|------------------------------|
| route_name   | String   | Name of the tour route       |
| description  | String   | Description of the tour      |
| duration     | Number   | Duration in minutes/hours    |
| distances    | Number   | Distance in kilometers       |
| routes       | [String] | List of places/waypoints     |
| prices       | Number   | Price of the tour            |
| photo_url    | String   | Tour photo URL               |
| created_at   | Date     |                              |
| update_at    | Date     |                              |

### Driver

| Field      | Type           | Description                |
|------------|----------------|----------------------------|
| user_id    | ObjectId       | Reference to User          |
| status     | Enum           | `active`, `suspend`        |
| created_at | Date           |                            |
| update_at  | Date           |                            |

### Order

| Field           | Type           | Description                |
|-----------------|----------------|----------------------------|
| user_id         | ObjectId       | Reference to User          |
| tour_id         | ObjectId       | Reference to Tour          |
| payment_method  | Enum           | `cash`, `qris`             |
| order_status    | Enum           | `waiting`, `Accepted`, `done`, `Canceled` |
| total           | Number         | Total price                |
| payment_status  | Enum           | `failed`, `success`, `pending` |
| pickup_location | String         | Pickup location            |
| pickup_time     | String         | Pickup time                |
| created_at      | Date           |                            |
| update_at       | Date           |                            |

### Schedule

| Field      | Type           | Description                |
|------------|----------------|----------------------------|
| tour_id    | ObjectId       | Reference to Tour          |
| times      | String         | Schedule time              |
| available  | Boolean        | Is available?              |
| driver_id  | ObjectId       | Reference to Driver        |
| created_at | Date           |                            |
| updated_at | Date           |                            |

### Reviews

- **TourReview:** user_id, tour_id, stars, comment, created_at, updated_at
- **DriverReview:** user_id, driver_id, stars, comment, created_at, updated_at

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

- All endpoints (except `/auth/register` and `/auth/login`) require authentication via Bearer token.
- Admin-only endpoints require the user to have the `admin` role.
- File uploads (profile photo, tour photo) use Supabase storage.
- Email verification is required for account activation.

---

## License

MIT

