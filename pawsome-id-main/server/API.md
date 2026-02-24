# Pawsome Backend - API Documentation

## Overview
Node.js + Express + MongoDB backend for the Pawsome pet registry frontend.

## Setup

```bash
cd server
npm install
copy .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run dev
```

## API Base URL
`http://localhost:4000/api`

## Models

### User
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  phone: String (required),
  address: String (required),
  role: String (owner|vet|shelter|admin, default: owner),
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Dog
```javascript
{
  _id: ObjectId,
  name: String (required),
  breed: String (required),
  age: Number (required),
  gender: String (male|female, required),
  color: String (required),
  photo: String (required, URL),
  chipId: String (required, unique),
  ownerId: String (required, user ID),
  implantDate: String (date format),
  implantLocation: String (required),
  status: String (pending|approved|rejected, default: pending),
  createdAt: Date,
  updatedAt: Date
}
```

### HealthRecord
```javascript
{
  _id: ObjectId,
  dogId: String (required, dog ID),
  vaccinationName: String (required),
  vaccinationDate: String (date format),
  notes: String (required),
  updatedBy: String (required, user ID),
  createdAt: Date,
  updatedAt: Date
}
```

## Endpoints

### Authentication

**POST** `/api/auth/register`
- Body: `{ name, email, password, phone, address, role }`
- Returns: `{ token, user }`

**POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user }`

**POST** `/api/auth/verify-otp`
- Body: `{ email, otp }`
- Returns: `{ message, user }`

### Dogs

**GET** `/api/dogs` (public)
- Query: `?q=name` (optional search)
- Returns: `[dogs]`

**GET** `/api/dogs/owner/:ownerId` (public)
- Returns: `[dogs]`

**GET** `/api/dogs/chip/:chipId` (public)
- Returns: `dog`

**GET** `/api/dogs/:id` (public)
- Returns: `dog`

**POST** `/api/dogs` (protected)
- Body: `{ name, breed, age, gender, color, photo, chipId, implantDate, implantLocation }`
- Returns: `dog`

**PUT** `/api/dogs/:id` (protected, owner/admin)
- Body: `{ ...updateFields }`
- Returns: `dog`

**PATCH** `/api/dogs/:id/status` (protected, admin only)
- Body: `{ status: pending|approved|rejected }`
- Returns: `dog`

**DELETE** `/api/dogs/:id` (protected, owner/admin)
- Returns: `{ message }`

### Health Records

**GET** `/api/dogs/:dogId/health` (public)
- Returns: `[healthRecords]`

**POST** `/api/dogs/:dogId/health` (protected, vet/admin)
- Body: `{ vaccinationName, vaccinationDate, notes }`
- Returns: `healthRecord`

**PUT** `/api/dogs/:dogId/health/:recordId` (protected, vet/admin)
- Body: `{ ...updateFields }`
- Returns: `healthRecord`

**DELETE** `/api/dogs/:dogId/health/:recordId` (protected, vet/admin)
- Returns: `{ message }`

## Authentication
Protected endpoints require `Authorization: Bearer <token>` header

## Improvements Made
1. ✅ User model now includes phone, address, verified fields matching frontend
2. ✅ Dog model uses correct schema with gender, color, photo, implantDate, implantLocation, ownerId (string)
3. ✅ Dog status field supports pending|approved|rejected
4. ✅ HealthRecord model uses vaccinationName, vaccinationDate, updatedBy
5. ✅ Auth routes return verified flag
6. ✅ Added OTP verification endpoint
7. ✅ Role-based access control (owner, vet, shelter, admin)
8. ✅ Authorization checks for dog and health record operations
9. ✅ All field names match frontend expectations
