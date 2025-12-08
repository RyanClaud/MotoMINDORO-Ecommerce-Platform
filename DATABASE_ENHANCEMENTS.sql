-- Enhanced Database Schema for Analytics, Spare Parts, and Store Management
-- Add these tables to your existing database

-- Store Analytics Table
CREATE TABLE `store_analytics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `date` date NOT NULL,
  `views` int DEFAULT 0,
  `unique_visitors` int DEFAULT 0,
  `clicks` int DEFAULT 0,
  `messages_received` int DEFAULT 0,
  `favorites_added` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_analytics_store_id_date_unique` (`store_id`,`date`),
  KEY `store_analytics_store_id_foreign` (`store_id`),
  CONSTRAINT `store_analytics_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Store Visits Tracking
CREATE TABLE `store_visits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `referrer` varchar(255) DEFAULT NULL,
  `visited_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `store_visits_store_id_foreign` (`store_id`),
  KEY `store_visits_user_id_foreign` (`user_id`),
  KEY `store_visits_visited_at_index` (`visited_at`),
  CONSTRAINT `store_visits_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `store_visits_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Activity Log
CREATE TABLE `user_activity_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `activity_type` enum('login','logout','view_listing','view_store','search','message','favorite','review') NOT NULL,
  `entity_type` varchar(50) DEFAULT NULL,
  `entity_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_activity_logs_user_id_foreign` (`user_id`),
  KEY `user_activity_logs_activity_type_index` (`activity_type`),
  KEY `user_activity_logs_created_at_index` (`created_at`),
  CONSTRAINT `user_activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Spare Parts Categories
CREATE TABLE `spare_parts_categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `description` text,
  `icon` varchar(255) DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `spare_parts_categories_parent_id_foreign` (`parent_id`),
  CONSTRAINT `spare_parts_categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `spare_parts_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Spare Parts Inventory
CREATE TABLE `spare_parts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `part_number` varchar(100) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `compatible_models` json DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int DEFAULT 0,
  `condition` enum('new','used','refurbished') DEFAULT 'new',
  `warranty_period` varchar(100) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `views` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `spare_parts_store_id_foreign` (`store_id`),
  KEY `spare_parts_category_id_foreign` (`category_id`),
  KEY `spare_parts_slug_index` (`slug`),
  CONSTRAINT `spare_parts_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `spare_parts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `spare_parts_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Store Services
CREATE TABLE `store_services` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price_range` varchar(100) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_services_store_id_foreign` (`store_id`),
  CONSTRAINT `store_services_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Store Images Gallery
CREATE TABLE `store_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `type` enum('gallery','service','facility') DEFAULT 'gallery',
  `order` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_images_store_id_foreign` (`store_id`),
  CONSTRAINT `store_images_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Store Operating Hours (Enhanced)
CREATE TABLE `store_operating_hours` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `is_open` tinyint(1) DEFAULT 1,
  `open_time` time DEFAULT NULL,
  `close_time` time DEFAULT NULL,
  `break_start` time DEFAULT NULL,
  `break_end` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `store_operating_hours_store_id_day_unique` (`store_id`,`day_of_week`),
  CONSTRAINT `store_operating_hours_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Store Features/Amenities
CREATE TABLE `store_features` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `store_features_store_id_foreign` (`store_id`),
  CONSTRAINT `store_features_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- System Analytics Dashboard
CREATE TABLE `system_analytics` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL UNIQUE,
  `total_users` int DEFAULT 0,
  `new_users` int DEFAULT 0,
  `active_users` int DEFAULT 0,
  `total_stores` int DEFAULT 0,
  `new_stores` int DEFAULT 0,
  `total_listings` int DEFAULT 0,
  `new_listings` int DEFAULT 0,
  `total_messages` int DEFAULT 0,
  `total_searches` int DEFAULT 0,
  `total_page_views` int DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add new columns to existing stores table
ALTER TABLE `stores` 
ADD COLUMN `shop_type` enum('repair_shop','spare_parts','both') DEFAULT 'both' AFTER `description`,
ADD COLUMN `business_license` varchar(255) DEFAULT NULL AFTER `email`,
ADD COLUMN `tax_id` varchar(100) DEFAULT NULL AFTER `business_license`,
ADD COLUMN `website` varchar(255) DEFAULT NULL AFTER `email`,
ADD COLUMN `facebook` varchar(255) DEFAULT NULL AFTER `website`,
ADD COLUMN `instagram` varchar(255) DEFAULT NULL AFTER `facebook`,
ADD COLUMN `whatsapp` varchar(20) DEFAULT NULL AFTER `phone`,
ADD COLUMN `rating_average` decimal(3,2) DEFAULT 0.00 AFTER `is_active`,
ADD COLUMN `rating_count` int DEFAULT 0 AFTER `rating_average`,
ADD COLUMN `total_views` int DEFAULT 0 AFTER `rating_count`,
ADD COLUMN `verified` tinyint(1) DEFAULT 0 AFTER `is_active`,
ADD COLUMN `featured` tinyint(1) DEFAULT 0 AFTER `verified`;

-- Add business_logo column to users table
ALTER TABLE `users`
ADD COLUMN `business_logo` varchar(255) DEFAULT NULL AFTER `profile_photo`;

-- Insert sample spare parts categories
INSERT INTO `spare_parts_categories` (`name`, `slug`, `description`) VALUES
('Engine Parts', 'engine-parts', 'Engine components and accessories'),
('Brake System', 'brake-system', 'Brake pads, discs, and related parts'),
('Suspension', 'suspension', 'Shock absorbers and suspension components'),
('Electrical', 'electrical', 'Batteries, lights, and electrical components'),
('Body Parts', 'body-parts', 'Fairings, fenders, and body panels'),
('Exhaust System', 'exhaust-system', 'Mufflers, pipes, and exhaust components'),
('Transmission', 'transmission', 'Clutch, gears, and transmission parts'),
('Tires & Wheels', 'tires-wheels', 'Tires, rims, and wheel accessories'),
('Filters', 'filters', 'Oil filters, air filters, and fuel filters'),
('Accessories', 'accessories', 'Helmets, riding gear, and accessories');
