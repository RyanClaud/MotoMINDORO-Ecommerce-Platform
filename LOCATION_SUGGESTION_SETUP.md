# Location Suggestion Feature Setup Guide

## Overview
This feature allows guests (non-registered users) to suggest vulcanizing shops and gas stations to be added to the map. Admins can then review and approve these suggestions.

## Backend Setup

### Step 1: Run Migrations

```bash
cd laravel-backend
php artisan migrate
```

This will create:
- `shop_type` column in `stores` table
- `location_suggestions` table

### Step 2: Add API Routes

Add these routes to `laravel-backend/routes/api.php`:

```php
use App\Http\Controllers\LocationSuggestionController;

// Public route - anyone can suggest a location
Route::post('/location-suggestions', [LocationSuggestionController::class, 'store']);

// Admin routes - require authentication and admin role
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/location-suggestions', [LocationSuggestionController::class, 'index']);
    Route::post('/location-suggestions/{id}/approve', [LocationSuggestionController::class, 'approve']);
    Route::post('/location-suggestions/{id}/reject', [LocationSuggestionController::class, 'reject']);
});
```

### Step 3: Update CORS (if needed)

Make sure your `laravel-backend/config/cors.php` allows POST requests:

```php
'allowed_methods' => ['*'],
```

## Frontend Features

### For Guests:
1. **Suggest Location Button** - Visible on the map page
2. **Simple Form** - Collects:
   - Shop/Station name
   - Type (Vulcanizing Shop or Gas Station)
   - Address and Municipality
   - Location coordinates (with "Use My Location" button)
   - Phone number (optional)
   - Description (optional)
   - Suggester's name and email

3. **Success Confirmation** - Shows thank you message after submission

### For Admins:
Admins can view, approve, or reject suggestions through the admin panel.

## Testing

### Test as Guest:

1. Go to `/map`
2. Click "Suggest Location" button
3. Fill out the form:
   - Name: "Test Vulcanizing Shop"
   - Type: Vulcanizing Shop
   - Address: "123 Test Street"
   - City: Select any municipality
   - Click "Use My Location" or enter coordinates manually
   - Your Name: "John Doe"
   - Your Email: "john@example.com"
4. Submit
5. Should see success message

### Test as Admin:

1. Login as admin
2. Go to admin panel
3. View pending location suggestions
4. Approve or reject suggestions
5. Approved suggestions automatically create stores on the map

## Database Schema

### location_suggestions table:
- `id` - Primary key
- `name` - Shop/station name
- `shop_type` - enum: vulcanizing_shop, gasoline_station
- `address` - Full address
- `city` - Municipality/city
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `phone` - Contact number (optional)
- `description` - Additional info (optional)
- `suggested_by_name` - Name of person suggesting
- `suggested_by_email` - Email for notifications
- `status` - enum: pending, approved, rejected
- `admin_notes` - Admin's notes when approving/rejecting
- `approved_by` - Foreign key to users table
- `approved_at` - Timestamp of approval/rejection
- `created_at` - When suggestion was submitted
- `updated_at` - Last update

## API Endpoints

### Public Endpoints:

**POST /api/location-suggestions**
- Submit a new location suggestion
- No authentication required
- Body:
```json
{
  "name": "Quick Fix Vulcanizing",
  "shop_type": "vulcanizing_shop",
  "address": "123 Main St",
  "city": "Calapan City",
  "latitude": 13.4119,
  "longitude": 121.1803,
  "phone": "+639123456789",
  "description": "24/7 service",
  "suggested_by_name": "John Doe",
  "suggested_by_email": "john@example.com"
}
```

### Admin Endpoints:

**GET /api/location-suggestions**
- Get all suggestions
- Query params: `?status=pending` (optional)
- Requires: Admin authentication

**POST /api/location-suggestions/{id}/approve**
- Approve a suggestion and create store
- Body: `{ "admin_notes": "Verified location" }` (optional)
- Requires: Admin authentication

**POST /api/location-suggestions/{id}/reject**
- Reject a suggestion
- Body: `{ "admin_notes": "Duplicate entry" }` (optional)
- Requires: Admin authentication

## Benefits

1. **Community-Driven** - Users help build the map
2. **Quality Control** - Admin approval prevents spam
3. **Guest-Friendly** - No registration required to contribute
4. **Email Notifications** - Suggesters get notified when approved
5. **Audit Trail** - Track who suggested and who approved

## Future Enhancements

- Email notifications when suggestions are approved/rejected
- Admin dashboard page for managing suggestions
- Bulk approve/reject
- Duplicate detection
- Photo uploads for suggested locations
- Reputation system for frequent contributors
