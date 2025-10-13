/*
  # Desawali E-commerce Seed Data

  This file contains sample data for testing and development:
  1. Product categories (Pickles, Seafood)
  2. Sample products with realistic data
  3. Admin user setup
  4. Sample coupons
  5. Sample reviews

  Note: Update the admin user ID with your actual user ID after signup
*/

-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url) VALUES 
(
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  'Pickles',
  'pickles',
  'Authentic homemade pickles made with traditional recipes and finest ingredients. From spicy mango to tangy lemon, discover flavors that bring back memories.',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
),
(
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  'Seafood',
  'seafood',
  'Fresh catch from coastal waters, delivered with care. Premium prawns, fish, and shellfish that meet the highest quality standards for your table.',
  'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg'
);

-- Insert sample products
INSERT INTO products (title, slug, description, category_id, price, unit, inventory, images, metadata) VALUES 
-- Pickles
(
  'Homemade Mango Pickle',
  'homemade-mango-pickle',
  'Traditional raw mango pickle made with mustard oil, fenugreek, and aromatic spices. A perfect accompaniment to rice, roti, and dal. Made in small batches to ensure freshness and authentic taste.',
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  299.00,
  '500g',
  50,
  ARRAY[
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg'
  ],
  '{"ingredients": ["Raw Mango", "Mustard Oil", "Fenugreek", "Red Chili", "Turmeric", "Asafoetida"], "spice_level": "Medium", "shelf_life": "6 months", "badge": "Best Seller"}'
),
(
  'Spicy Lemon Pickle',
  'spicy-lemon-pickle',
  'Tangy and spicy lemon pickle that adds zing to any meal. Made with fresh lemons, red chilies, and secret spices passed down through generations.',
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  249.00,
  '250g',
  35,
  ARRAY[
    'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg'
  ],
  '{"ingredients": ["Fresh Lemon", "Red Chili Powder", "Mustard Seeds", "Fenugreek", "Salt"], "spice_level": "Hot", "shelf_life": "8 months"}'
),
(
  'Mixed Vegetable Pickle',
  'mixed-vegetable-pickle',
  'A delightful mix of seasonal vegetables pickled to perfection. Contains carrots, cauliflower, turnip, and green chilies in aromatic mustard oil.',
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  349.00,
  '500g',
  25,
  ARRAY[
    'https://images.pexels.com/photos/1247677/pexels-photo-1247677.jpeg'
  ],
  '{"ingredients": ["Mixed Vegetables", "Mustard Oil", "Spices"], "spice_level": "Medium", "shelf_life": "4 months"}'
),
(
  'Garlic Pickle',
  'garlic-pickle',
  'Pungent and flavorful garlic pickle made with fresh garlic cloves and traditional spices. Perfect for garlic lovers who enjoy bold flavors.',
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  279.00,
  '250g',
  40,
  ARRAY[
    'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg'
  ],
  '{"ingredients": ["Fresh Garlic", "Mustard Oil", "Red Chili", "Fenugreek"], "spice_level": "Hot", "shelf_life": "6 months"}'
),
(
  'Sweet & Sour Amla Pickle',
  'sweet-sour-amla-pickle',
  'Healthy amla (Indian gooseberry) pickle with a perfect balance of sweet and sour flavors. Rich in Vitamin C and antioxidants.',
  'b8f3d8e0-4c1a-4c1a-8c1a-4c1a8c1a4c1a',
  329.00,
  '500g',
  30,
  ARRAY[
    'https://images.pexels.com/photos/1247677/pexels-photo-1247677.jpeg'
  ],
  '{"ingredients": ["Fresh Amla", "Jaggery", "Mustard Oil", "Spices"], "spice_level": "Mild", "shelf_life": "8 months", "badge": "Healthy Choice"}'
),

-- Seafood
(
  'Fresh Tiger Prawns',
  'fresh-tiger-prawns',
  'Premium tiger prawns sourced from coastal waters. Large, meaty prawns perfect for curries, fries, or grills. Cleaned and deveined for your convenience.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  899.00,
  '500g',
  20,
  ARRAY[
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
  ],
  '{"size": "Large (16-20 pieces per kg)", "processing": "Cleaned & Deveined", "origin": "West Coast", "badge": "Fresh Daily"}'
),
(
  'Pomfret Fish (Medium)',
  'pomfret-fish-medium',
  'Fresh pomfret fish, known for its delicate flavor and firm texture. Perfect for frying, steaming, or making curries. Each piece is carefully selected for quality.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  599.00,
  '1 piece (400-500g)',
  15,
  ARRAY[
    'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg'
  ],
  '{"size": "Medium (400-500g)", "processing": "Whole Fish - Cleaned", "origin": "Arabian Sea", "badge": "Premium Quality"}'
),
(
  'King Fish Steaks',
  'king-fish-steaks',
  'Thick, boneless king fish steaks perfect for grilling or pan-frying. Rich in omega-3 fatty acids and protein. Cut fresh from large king fish.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  749.00,
  '500g (4-5 steaks)',
  12,
  ARRAY[
    'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg'
  ],
  '{"cut": "Boneless Steaks", "thickness": "2cm", "pieces": "4-5 steaks per 500g", "origin": "Deep Sea"}'
),
(
  'Crab (Medium Size)',
  'crab-medium-size',
  'Fresh mud crabs with sweet, tender meat. Perfect for crab curry, crab fry, or steamed preparations. Live crabs available on pre-order.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  399.00,
  '1 piece (300-400g)',
  8,
  ARRAY[
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg'
  ],
  '{"size": "Medium (300-400g)", "type": "Mud Crab", "condition": "Live/Fresh", "origin": "Backwaters"}'
),
(
  'Squid Rings (Cleaned)',
  'squid-rings-cleaned',
  'Pre-cut squid rings, cleaned and ready to cook. Great for stir-fries, curries, or as appetizers. Tender texture with mild seafood flavor.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  449.00,
  '250g',
  18,
  ARRAY[
    'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg'
  ],
  '{"cut": "Rings", "processing": "Cleaned & Cut", "size": "Medium Rings", "origin": "Coastal Waters"}'
),
(
  'Fish Fillet (Kingfish)',
  'fish-fillet-kingfish',
  'Boneless kingfish fillets, perfect for those who prefer fish without bones. Ideal for pan-searing, baking, or making fish fingers.',
  'c9f4d9e1-5d2b-5d2b-9d2b-5d2b9d2b5d2b',
  679.00,
  '500g',
  10,
  ARRAY[
    'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg'
  ],
  '{"cut": "Boneless Fillets", "processing": "Skinless & Boneless", "thickness": "1.5cm", "origin": "Deep Sea", "badge": "Premium Cut"}'
);

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, minimum_amount, maximum_discount, is_active, usage_limit, expires_at) VALUES 
(
  'WELCOME10',
  'percentage',
  10.00,
  500.00,
  100.00,
  true,
  1000,
  (now() + interval '30 days')::timestamptz
),
(
  'PICKLE50',
  'fixed',
  50.00,
  300.00,
  NULL,
  true,
  500,
  (now() + interval '15 days')::timestamptz
),
(
  'SEAFOOD100',
  'fixed',
  100.00,
  800.00,
  NULL,
  true,
  200,
  (now() + interval '7 days')::timestamptz
);

-- Note: To create an admin user, first sign up through the application
-- Then update the profile with the actual user ID:
-- UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';

-- Sample admin user (replace with actual user ID after signup)
-- This is a placeholder - you'll need to update with real user ID
INSERT INTO profiles (id, full_name, phone, is_admin) VALUES 
(
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  'Admin User',
  '+91-9876543210',
  true
) ON CONFLICT (id) DO UPDATE SET is_admin = true;

-- Insert sample reviews (these will need actual user IDs)
INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified) VALUES 
(
  (SELECT id FROM products WHERE slug = 'homemade-mango-pickle' LIMIT 1),
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  5,
  'Authentic taste!',
  'This mango pickle tastes exactly like my grandmother used to make. The spices are perfectly balanced and the mango pieces are just the right texture.',
  true
),
(
  (SELECT id FROM products WHERE slug = 'fresh-tiger-prawns' LIMIT 1),
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  5,
  'Super fresh prawns',
  'The prawns were incredibly fresh and large. Perfect for the prawn curry I made. Will definitely order again!',
  true
),
(
  (SELECT id FROM products WHERE slug = 'spicy-lemon-pickle' LIMIT 1),
  '00000000-0000-0000-0000-000000000000', -- Replace with actual user ID
  4,
  'Good but very spicy',
  'Great flavor but quite spicy for my taste. Quality is excellent though.',
  false
);