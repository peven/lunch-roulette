INSERT INTO offices (name, address, lat, lng, timezone)
VALUES ('HQ', '1 Main St, City', 48.8566, 2.3522, 'Europe/Paris')
ON CONFLICT DO NOTHING;

INSERT INTO users (email, display_name, role)
VALUES
  ('alice@example.com', 'Alice', 'admin'),
  ('bob@example.com', 'Bob', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO restaurants (name, address, lat, lng, food_style, takeaway, delivery, vegetarian_friendly, vegan_options, accepts_own_bowls)
VALUES
  ('Green Bowl', '10 River Rd', 48.8570, 2.3500, 'Healthy', true, false, true, true, true),
  ('Pizza Corner', '22 Lake St', 48.8580, 2.3550, 'Italian', true, true, false, false, false)
ON CONFLICT DO NOTHING;
