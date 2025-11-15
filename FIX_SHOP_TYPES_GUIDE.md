# Fix Shop Types for Existing Stores

## Problem
Existing stores in the database don't have the `shop_type` field set, so they all show as "Motorcycle Shop" on the map.

## Solution

### Step 1: Run the Migration

Open your terminal and run:

```bash
cd laravel-backend
php artisan migrate
```

This will add the `shop_type` column to your stores table.

### Step 2: Update Existing Stores

You have 3 options:

#### Option A: Update via Edit Form (Easiest)

1. Go to your dashboard
2. Click "Edit" on each store
3. Select the correct shop type from the dropdown
4. Save

#### Option B: Update via Database (Fastest)

Run this SQL in your database:

```sql
-- Update Max Vulcanizing Shop
UPDATE stores 
SET shop_type = 'vulcanizing_shop' 
WHERE name LIKE '%vulcaniz%';

-- Update any gas stations
UPDATE stores 
SET shop_type = 'gasoline_station' 
WHERE name LIKE '%gas%' OR name LIKE '%petrol%' OR name LIKE '%fuel%';

-- All others remain as motorcycle_shop (default)
```

#### Option C: Update via Laravel Tinker

```bash
cd laravel-backend
php artisan tinker
```

Then run:

```php
// Update Max Vulcanizing Shop
$store = App\Models\Store::where('name', 'Max Vulcanizing Shop')->first();
if ($store) {
    $store->shop_type = 'vulcanizing_shop';
    $store->save();
    echo "Updated: " . $store->name . "\n";
}

// Update all stores with "vulcaniz" in name
App\Models\Store::where('name', 'LIKE', '%vulcaniz%')->update(['shop_type' => 'vulcanizing_shop']);

// Update all stores with "gas" in name
App\Models\Store::where('name', 'LIKE', '%gas%')->update(['shop_type' => 'gasoline_station']);
```

### Step 3: Verify

1. Refresh your map page
2. The markers should now show the correct colors and labels:
   - 🏍️ Blue "Motorcycle" for motorcycle shops
   - 🔧 Yellow "Vulcanizing" for vulcanizing shops
   - ⛽ Red "Gas Station" for gas stations

## For New Stores

When creating new stores, sellers will now see a "Shop Type" dropdown where they can select:
- 🏍️ Motorcycle Shop
- 🔧 Vulcanizing Shop
- ⛽ Gas Station

The correct marker will automatically appear on the map!

## Troubleshooting

### Migration fails with "column already exists"
The migration checks if the column exists first, so this shouldn't happen. If it does, the column already exists and you can skip to Step 2.

### Markers still show wrong type
1. Clear your browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+F5)
3. Check the database to confirm shop_type is set correctly:
   ```sql
   SELECT id, name, shop_type FROM stores;
   ```

### Can't see the Shop Type dropdown in Create/Edit Store
Make sure you've pulled the latest code from GitHub and the frontend is updated.
