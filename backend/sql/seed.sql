TRUNCATE TABLE inquiries, property_images, properties, agents, users RESTART IDENTITY CASCADE;

INSERT INTO users (name, email, phone, preferred_area) VALUES
  ('Guest User', 'guest@example.com', '+251 900 000 000', 'Bole'),
  ('Demo Owner', 'owner@example.com', '+251 911 100 200', 'CMC');

INSERT INTO agents (name, area, specialty, rating, deals, phone, email, image, bio) VALUES
  ('Mekdes Alemu', 'CCD', 'Family Homes', 4.9, 42, '+251 911 234 111', 'mekdes@noah.example', 'avatar_1.png', 'Known for calm negotiation, clear paperwork guidance, and matching families with practical homes.'),
  ('Nahom Tesfaye', 'Bole', 'Luxury Apartments', 4.8, 37, '+251 922 431 444', 'nahom@noah.example', 'avatar_2.png', 'A Bole-focused broker with strong knowledge of apartment pricing, building quality, and rental yields.'),
  ('Saron Bekele', 'CMC', 'Premium Villas', 5.0, 55, '+251 933 887 220', 'saron@noah.example', 'avatar_3.png', 'Trusted for premium villa tours, buyer shortlists, and fast follow-up with serious property owners.'),
  ('Robel Hailu', 'Bole', 'Rentals', 4.7, 28, '+251 944 190 515', 'robel@noah.example', 'avatar_1.png', 'Helps renters compare value quickly and keeps communication simple between owners and tenants.'),
  ('Hana Girma', 'Kazanchis', 'City Apartments', 4.8, 31, '+251 911 880 101', 'hana@noah.example', 'avatar_2.png', 'A clear communicator for buyers who want central apartments and strong rental potential.'),
  ('Biruk Tadesse', 'Summit', 'New Builds', 4.6, 24, '+251 922 770 202', 'biruk@noah.example', 'avatar_3.png', 'Tracks new-build homes and helps clients compare finishing quality before committing.'),
  ('Liya Kebede', 'Sarbet', 'Diplomatic Homes', 4.9, 46, '+251 933 660 303', 'liya@noah.example', 'avatar_1.png', 'Experienced with larger homes, privacy requirements, and diplomatic-family relocation needs.'),
  ('Dawit Merga', 'Megenagna', 'Budget Homes', 4.5, 21, '+251 944 550 404', 'dawit@noah.example', 'avatar_2.png', 'Practical, fast, and focused on helping buyers find realistic options inside budget.'),
  ('Selam Tola', 'Ayat', 'Villas', 4.8, 33, '+251 955 440 505', 'selam@noah.example', 'avatar_3.png', 'Strong in Ayat and east-side villa stock, with a patient property-tour style.'),
  ('Yared Desta', 'Piassa', 'Commercial Mixed Use', 4.7, 29, '+251 966 330 606', 'yared@noah.example', 'avatar_1.png', 'Helps investors evaluate mixed-use properties, access, and neighborhood activity.');

INSERT INTO properties
  (title, location, area, property_type, intent, price, rooms, size_sqm, status, owner_kind, description, cover_image, agent_id, listed_by_user_id)
VALUES
  ('Warm Family Villa', 'CCD, Addis Ababa', 'CCD', 'Villa', 'Buy', 20500000, 4, 300, 'Available', 'demo', 'A comfortable family villa with warm interiors, parking space, and easy access to daily essentials.', 'residence-photo_1.png', 1, NULL),
  ('Bright Bole Residence', 'Bole, Addis Ababa', 'Bole', 'Apartment', 'Buy', 100000000, 3, 500, 'Available', 'demo', 'A premium Bole home with generous glazing, formal rooms, and a calm private compound.', 'residence-photo_2.png', 2, NULL),
  ('CMC Grand House', 'CMC, Addis Ababa', 'CMC', 'House', 'Buy', 120700000, 6, 1000, 'Available', 'demo', 'A large statement house with multiple living zones, premium finishes, and excellent frontage.', 'residence-photo_3.png', 3, NULL),
  ('CCD Rental Home', 'CCD, Addis Ababa', 'CCD', 'House', 'Rent', 95000, 4, 300, 'Available', 'demo', 'A practical rental home for families who want a quiet neighborhood and fast city access.', 'residence-photo_1.png', 4, NULL),
  ('Bole Executive Apartment', 'Bole, Addis Ababa', 'Bole', 'Apartment', 'Rent', 140000, 3, 420, 'Available', 'demo', 'A polished apartment option near business corridors, restaurants, and airport-side roads.', 'residence-photo_2.png', 2, NULL),
  ('CMC Premium Villa', 'CMC, Addis Ababa', 'CMC', 'Villa', 'Buy', 118000000, 5, 880, 'Sold', 'demo', 'A refined CMC villa used here as a sold listing example for owner-side management flows.', 'residence-photo_3.png', 3, NULL),
  ('Kazanchis City Flat', 'Kazanchis, Addis Ababa', 'Kazanchis', 'Apartment', 'Rent', 125000, 2, 180, 'Available', 'demo', 'A city apartment close to offices, hotels, restaurants, and transport corridors.', 'residence-photo_2.png', 5, NULL),
  ('Summit New Build', 'Summit, Addis Ababa', 'Summit', 'House', 'Buy', 68000000, 4, 460, 'Available', 'demo', 'A newer home with clean spaces and flexible rooms for a growing household.', 'residence-photo_1.png', 6, NULL),
  ('Sarbet Private Home', 'Sarbet, Addis Ababa', 'Sarbet', 'Villa', 'Buy', 132000000, 5, 760, 'Available', 'demo', 'A private villa with mature neighborhood access and strong family-oriented spaces.', 'residence-photo_3.png', 7, NULL),
  ('Ayat Modern Villa', 'Ayat, Addis Ababa', 'Ayat', 'Villa', 'Buy', 74000000, 4, 520, 'Available', 'demo', 'A modern east-side villa option with bright rooms and useful outdoor space.', 'residence-photo_1.png', 9, NULL);

INSERT INTO property_images (property_id, image, sort_order)
SELECT id, cover_image, 0 FROM properties;

INSERT INTO property_images (property_id, image, sort_order)
SELECT id, 'residence-photo_1.png', 1 FROM properties WHERE cover_image <> 'residence-photo_1.png';

INSERT INTO property_images (property_id, image, sort_order)
SELECT id, 'residence-photo_2.png', 2 FROM properties WHERE cover_image <> 'residence-photo_2.png';

INSERT INTO property_images (property_id, image, sort_order)
SELECT id, 'residence-photo_3.png', 3 FROM properties WHERE cover_image <> 'residence-photo_3.png';
