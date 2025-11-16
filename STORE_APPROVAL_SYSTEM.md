# Store Approval System

## Overview
Implemented a comprehensive store approval system that allows admins to review and approve/reject stores before they become active in the system.

## Features Added

### 1. **Database Changes**
- Added `approval_status` field (pending/approved/rejected) to stores table
- Added `rejection_reason` field to store rejection reasons
- Added `approved_by` field to track which admin approved/rejected
- Added `approved_at` timestamp field

### 2. **Backend API Endpoints**
- `PUT /api/admin/stores/{id}/approve` - Approve a pending store
- `PUT /api/admin/stores/{id}/reject` - Reject a store with reason
- Updated `GET /api/admin/stores` to support `approval_status` filter

### 3. **Frontend Enhancements**

#### Stats Dashboard
- Added **Pending Approval** card showing count of stores awaiting approval
- Card is clickable and filters to show only pending stores
- Yellow/orange gradient to highlight urgency

#### Filters Section
- Added **Approval Status Filter** dropdown with options:
  - All Approval Status
  - ⏳ Pending
  - ✓ Approved
  - ✗ Rejected

#### Store Cards
- **Approval Status Badge** showing current status with color coding:
  - 🟢 Green for Approved
  - 🔴 Red for Rejected
  - 🟡 Yellow for Pending

- **Approval Action Buttons** (for pending stores):
  - ✓ Approve button (green gradient)
  - ✗ Reject button (red gradient)

- **Rejection Reason Display** (for rejected stores):
  - Shows the reason why the store was rejected
  - Displayed in a red-bordered box

#### Rejection Modal
- Premium modal design with backdrop blur
- Text area for admin to provide rejection reason
- Required field validation
- Cancel and Reject buttons

## How It Works

### For Sellers:
1. Seller creates a new store
2. Store is automatically set to `approval_status = 'pending'`
3. Store awaits admin approval

### For Admins:
1. Admin sees pending stores count in the dashboard
2. Admin can filter stores by approval status
3. Admin can:
   - **Approve**: Store becomes available in the system
   - **Reject**: Store is marked as rejected with a reason
4. Rejection reason is visible to help sellers understand why

## Default Behavior
- All new stores are created with `approval_status = 'pending'`
- Stores must be approved by an admin before being fully active
- Admins can see all stores regardless of approval status

## Migration
Run the migration to add the approval fields:
```bash
php artisan migrate
```

## Benefits
- ✅ Quality control for stores
- ✅ Prevents spam or inappropriate stores
- ✅ Clear communication with rejection reasons
- ✅ Audit trail with approved_by and approved_at fields
- ✅ Easy filtering and management
