CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  default_office_id UUID REFERENCES offices(id),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  opening_hours_json JSONB,
  food_style TEXT,
  takeaway BOOLEAN NOT NULL DEFAULT FALSE,
  delivery BOOLEAN NOT NULL DEFAULT FALSE,
  vegetarian_friendly BOOLEAN NOT NULL DEFAULT FALSE,
  vegan_options BOOLEAN NOT NULL DEFAULT FALSE,
  accepts_own_bowls BOOLEAN NOT NULL DEFAULT FALSE,
  eco_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lunch_intentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  office_id UUID NOT NULL REFERENCES offices(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  lunch_date DATE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('dine_in', 'takeaway')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lunch_date)
);

CREATE TABLE IF NOT EXISTS roulette_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_id UUID NOT NULL REFERENCES offices(id),
  created_by UUID NOT NULL REFERENCES users(id),
  lunch_date DATE NOT NULL,
  shortlist_restaurant_ids_json JSONB NOT NULL,
  selected_restaurant_id UUID REFERENCES restaurants(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lunch_intention_id UUID NOT NULL REFERENCES lunch_intentions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  tags_json JSONB,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lunch_intention_id)
);

CREATE INDEX IF NOT EXISTS idx_restaurants_name ON restaurants(name);
CREATE INDEX IF NOT EXISTS idx_intentions_date_office ON lunch_intentions(lunch_date, office_id);
CREATE INDEX IF NOT EXISTS idx_reviews_restaurant ON reviews(restaurant_id);
