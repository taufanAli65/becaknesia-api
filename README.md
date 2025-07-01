# Becaknesia API Documentation

## Authentication

### Register
**POST** `/auth/register`  
Form-data (with photo upload):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "no_hp": "08123456789",
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Registration successful. Please check your email to verify your account.",
  "data": null
}
```

### Activate User
**GET** `/auth/activate?token=...`  
**Response:**
```json
{
  "status": "success",
  "message": "User activated successfully. You can now log in.",
  "data": null
}
```

### Resend Verification Email
**POST** `/auth/resend-verification-email`
```json
{
  "email": "john@example.com"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Verification email sent successfully. Please check your inbox.",
  "data": null
}
```

### Login
**POST** `/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "no_hp": "08123456789",
      "role": "User",
      "photoUrl": "https://..."
    }
  }
}
```

### Update User
**PUT** `/auth/update`  
Headers: `Authorization: Bearer <token>`
Form-data (with photo upload):
```json
{
  "name": "John Updated",
  "email": "john2@example.com",
  "no_hp": "08123456780",
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": null
}
```

---

## Places

### Create Place
**POST** `/place/`  
Headers: `Authorization: Bearer <admin_token>`  
Form-data (with photo upload):
```json
{
  "name": "Borobudur",
  "coordinates": "-7.6079,110.2038",
  "description": "Candi Borobudur",
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Place created successfully",
  "data": null
}
```

### Get Places
**GET** `/place/?page=1&limit=10&search=borobudur`
**Response:**
```json
{
  "status": "success",
  "message": "Places fetched successfully",
  "data": {
    "data": [ /* array of places */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Place by ID
**GET** `/place/:place_id`
**Response:**
```json
{
  "status": "success",
  "message": "Place with ID: ... is fetched successfully",
  "data": { /* place object */ }
}
```

### Update Place
**PUT** `/place/:place_id`  
Headers: `Authorization: Bearer <admin_token>`
Form-data (with photo upload):
```json
{
  "name": "Borobudur Updated",
  "coordinates": "-7.6079,110.2038",
  "description": "Candi Borobudur Updated",
  "category": "Candi",
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Place updated successfully",
  "data": { /* updated place object */ }
}
```

### Delete Place
**DELETE** `/place/:place_id`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Place deleted successfully",
  "data": null
}
```

---

## Tours

### Create Tour Package
**POST** `/tour/`  
Headers: `Authorization: Bearer <admin_token>`  
Form-data (with photo upload):
```json
{
  "route_name": "Tour Borobudur",
  "description": "Wisata ke Borobudur",
  "duration": 2,
  "distances": 10,
  "routes": ["Borobudur", "Mendut"],
  "prices": 100000,
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "New tour package is created successfully",
  "data": null
}
```

### Get All Tour Packages
**GET** `/tour/?page=1&limit=10&search=borobudur`
**Response:**
```json
{
  "status": "success",
  "message": "Tour packages fetched successfully",
  "data": {
    "data": [ /* array of tours */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Tour Package by ID
**GET** `/tour/:tourID`
**Response:**
```json
{
  "status": "success",
  "message": "Tour package with ID: ... fetched successfully",
  "data": { /* tour object */ }
}
```

### Update Tour Package
**PUT** `/tour/:tourID`  
Headers: `Authorization: Bearer <admin_token>`
Form-data (with photo upload):
```json
{
  "route_name": "Tour Borobudur Updated",
  "description": "Wisata ke Borobudur Updated",
  "duration": 3,
  "distances": 12,
  "routes": ["Borobudur", "Mendut", "Pawon"],
  "prices": 120000,
  "photo": (file)
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Tour package updated successfully",
  "data": { /* updated tour object */ }
}
```

### Delete Tour Package
**DELETE** `/tour/:tourID`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Tour package deleted successfully",
  "data": { /* deleted tour object */ }
}
```

---

## Orders

### Create Order
**POST** `/order/`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "tour_id": "...",
  "payment_method": "transfer",
  "total": "100000",
  "pickup_location": "Hotel A",
  "pickup_time": "2024-06-01T08:00:00Z"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "data": { /* order object */ }
}
```

### Get Orders
**GET** `/order/?page=1&limit=10&search=borobudur`
Headers: `Authorization: Bearer <user_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Orders fetched successfully",
  "data": {
    "data": [ /* array of orders */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Order by ID
**GET** `/order/:order_id`  
Headers: `Authorization: Bearer <user_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Order fetched successfully",
  "data": { /* order object */ }
}
```

### Update Order
**PUT** `/order/:order_id`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "payment_method": "cash"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Order updated successfully",
  "data": { /* updated order object */ }
}
```

### Delete Order
**DELETE** `/order/:order_id`  
Headers: `Authorization: Bearer <user_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Order deleted successfully",
  "data": null
}
```

### Driver: Get Accepted Orders (See Orders to Work On)
**GET** `/order/driver/accepted?page=1&limit=10&search=...`  
Headers: `Authorization: Bearer <driver_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Accepted orders fetched successfully",
  "data": {
    "data": [
      {
        /* order object */,
        "schedule": { /* schedule object for this order and driver */ }
      }
      // ...more orders
    ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## Order Endpoints

### Get All Orders by User ID

- **Endpoint:** `GET /order/user/:user_id/all`
- **Auth:** User (must be the same as `user_id`)
- **Description:** Get all orders for the specified user.
- **Params:**
  - `user_id` (string, required): The user's ObjectId.
- **Response:**
  - `200 OK` with array of order objects.

**Example Request:**
```
GET /order/user/60f7c2e5b4d1c8001c8e4b2a/all
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "_id": "orderid1",
      "user_id": "60f7c2e5b4d1c8001c8e4b2a",
      // ...other order fields...
    },
    // ...
  ]
}
```

---

## Schedules

### Create Schedule
**POST** `/schedule/`  
Headers: `Authorization: Bearer <admin_token>`
```json
{
  "order_id": "...",
  "driver_id": "...",
  "times": "2024-06-01T08:00:00Z",
  "available": true
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Schedule created successfully",
  "data": { /* schedule object */ }
}
```

### Get Schedules
**GET** `/schedule/?page=1&limit=10&week=2024-06-01`
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Schedules fetched successfully",
  "data": {
    "data": [ /* array of schedules */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Schedule by ID
**GET** `/schedule/:schedule_id`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Schedule fetched successfully",
  "data": { /* schedule object */ }
}
```

### Update Schedule
**PUT** `/schedule/:schedule_id`  
Headers: `Authorization: Bearer <admin_token>`
```json
{
  "available": false
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Schedule updated successfully",
  "data": { /* updated schedule object */ }
}
```

### Delete Schedule
**DELETE** `/schedule/:schedule_id`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Schedule deleted successfully",
  "data": null
}
```

### Driver: Get Accepted Schedules (See When to Work)
**GET** `/schedule/driver/accepted?week=2024-06-01`  
Headers: `Authorization: Bearer <driver_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Accepted schedules fetched successfully",
  "data": [
    /* array of schedule objects where order status is accepted */
  ]
}
```

---

## Reviews

### Driver Review

#### Add Review
**POST** `/driverReview/`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "driver_id": "...",
  "order_id": "...",
  "stars": 5,
  "comment": "Great driver!"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Review added successfully",
  "data": null
}
```

#### Get Reviews
**GET** `/driverReview/?page=1&limit=10&search=driver`
**Response:**
```json
{
  "status": "success",
  "message": "Reviews fetched successfully",
  "data": {
    "data": [ /* array of reviews */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Get Review by ID
**GET** `/driverReview/:review_id`
**Response:**
```json
{
  "status": "success",
  "message": "Review fetched successfully",
  "data": { /* review object */ }
}
```

#### Update Review
**PUT** `/driverReview/:review_id`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "stars": 4,
  "comment": "Good driver"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Review updated successfully",
  "data": { /* updated review object */ }
}
```

#### Delete Review
**DELETE** `/driverReview/:review_id`  
Headers: `Authorization: Bearer <user_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Review deleted successfully",
  "data": null
}
```

---

### Tour Review

#### Add Review
**POST** `/tourReview/`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "tour_id": "...",
  "stars": 5,
  "comment": "Amazing tour!"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Review added successfully",
  "data": null
}
```

#### Get Reviews
**GET** `/tourReview/?page=1&limit=10`
**Response:**
```json
{
  "status": "success",
  "message": "Reviews fetched successfully",
  "data": {
    "data": [ /* array of reviews */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Get Review by ID
**GET** `/tourReview/:review_id`
**Response:**
```json
{
  "status": "success",
  "message": "Review fetched successfully",
  "data": { /* review object */ }
}
```

#### Update Review
**PUT** `/tourReview/:review_id`  
Headers: `Authorization: Bearer <user_token>`
```json
{
  "stars": 4,
  "comment": "Nice tour"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Review updated successfully",
  "data": { /* updated review object */ }
}
```

#### Delete Review
**DELETE** `/tourReview/:review_id`  
Headers: `Authorization: Bearer <user_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Review deleted successfully",
  "data": null
}
```

---

## Admin

### Assign Driver Role
**POST** `/admin/assign-driver`  
Headers: `Authorization: Bearer <admin_token>`
```json
{
  "user_id": "..."
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Driver role assigned successfully",
  "data": null
}
```

### Get Users By Role
**GET** `/admin/users`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Users fetched successfully",
  "data": [
    /* array of user objects */
  ]
}
```

### Get Admin Dashboard Stats
**GET** `/admin/dashboard/stats`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Dashboard stats fetched successfully",
  "data": {
    /* stats object, e.g. { totalUsers: 100, totalOrders: 50, ... } */
  }
}
```

### Get All Driver Availabilities
**GET** `/admin/driver-availabilities?page=1&limit=10&days=monday&times=08.00%20-%2010.00`  
Headers: `Authorization: Bearer <admin_token>`
**Response:**
```json
{
  "status": "success",
  "message": "All driver availabilities fetched successfully",
  "data": {
    "data": [ /* array of driver availabilities */ ],
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Driver Availability

### Add Availability
**POST** `/driver/availability`  
Headers: `Authorization: Bearer <driver_token>`
```json
{
  "days": "monday",
  "times": "08.00 - 10.00"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Add availabilities successfully",
  "data": { /* availability object */ }
}
```

### Get Driver's Own Availabilities
**GET** `/driver/availability`  
Headers: `Authorization: Bearer <driver_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Get driver availabilities successfully",
  "data": [ /* array of availabilities */ ]
}
```

### Update Driver Availability
**PUT** `/driver/availability/:availability_id`  
Headers: `Authorization: Bearer <driver_token>`
```json
{
  "days": "tuesday",
  "times": "14.00 - 16.00"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Availability updated successfully",
  "data": { /* updated availability object */ }
}
```

### Delete Driver Availability
**DELETE** `/driver/availability/:availability_id`  
Headers: `Authorization: Bearer <driver_token>`
**Response:**
```json
{
  "status": "success",
  "message": "Availability deleted successfully",
  "data": null
}
```

### Search Driver Availabilities
**POST** `/driver/availability/search`  
Headers: `Authorization: Bearer <admin_token>`
```json
{
  "days": "monday",
  "times": "08.00 - 10.00"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Search driver availabilities successfully",
  "data": [ /* array of availabilities */ ]
}
```

---

## Notes

- Semua endpoint yang membutuhkan autentikasi harus menyertakan header:  
  `Authorization: Bearer <token>`
- Untuk upload file (photo), gunakan form-data.
- Semua response error akan memiliki format:
```json
{
  "status": "fail",
  "message": "Error message",
  "data": null
}
```
