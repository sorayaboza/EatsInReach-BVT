-- Create the database
CREATE DATABASE eats_in_reach_db;

-- Connect to the newly created database
\c eats_in_reach_db;

-- Create the Food_Types table (removed description column)
CREATE TABLE Food_Types (
    food_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

-- Create the Price_Ranges table (Optional)
CREATE TABLE Price_Ranges (
    price_range_id SERIAL PRIMARY KEY,
    range VARCHAR(50) NOT NULL
);

-- Create the Users table
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    uid VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Vendor_Submissions table
CREATE TABLE Vendor_Submissions (
    submission_id SERIAL PRIMARY KEY,
    uid VARCHAR(255) REFERENCES Users(uid) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    hours_of_operation JSONB,
    description TEXT,
    website VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    price_range_id INTEGER NOT NULL,
    food_type_id INTEGER NOT NULL,
    FOREIGN KEY (price_range_id) REFERENCES Price_Ranges(price_range_id),
    FOREIGN KEY (food_type_id) REFERENCES Food_Types(food_type_id),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Restaurants table with phone number and email (modified)
CREATE TABLE Restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    uid VARCHAR(255) REFERENCES Users(uid) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    hours_of_operation JSONB,
    description TEXT,
    website VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    price_range_id INTEGER NOT NULL,
    food_type_id INTEGER REFERENCES Food_Types(food_type_id),
    is_open BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create the Photo_Types table
CREATE TABLE Photo_Types (
    photo_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

-- Create the Restaurant_Pictures table
CREATE TABLE Restaurant_Pictures (
    picture_id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    photo_type_id INTEGER REFERENCES Photo_Types(photo_type_id),
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255)
);

CREATE TABLE Vendor_Restaurant_Pictures (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(255) REFERENCES Users(uid) ON DELETE CASCADE,
    photo_type_id INT REFERENCES Photo_Types(photo_type_id),
    image_url TEXT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Menus table
CREATE TABLE Menus (
    menu_id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create the Menu_Items table
CREATE TABLE Menu_Items (
    item_id SERIAL PRIMARY KEY,
    menu_id INTEGER REFERENCES Menus(menu_id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    image_path VARCHAR(255),
    alt_text VARCHAR(255), -- Newly added column
    item_price DECIMAL(10,2) NOT NULL,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE
);

-- Create the Favorites table
CREATE TABLE Favorites (
    uid VARCHAR(255) REFERENCES Users(uid) ON DELETE CASCADE,
    restaurant_id INTEGER REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    PRIMARY KEY (uid, restaurant_id)
);

-- Create the Dietary_Restrictions table
CREATE TABLE Dietary_Restrictions (
    restriction_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Create the Restaurant_Dietary_Options table
CREATE TABLE Restaurant_Dietary_Options (
    restaurant_id INTEGER REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    restriction_id INTEGER REFERENCES Dietary_Restrictions(restriction_id) ON DELETE CASCADE,
    PRIMARY KEY (restaurant_id, restriction_id)
);

-- Create a new table for vendor submission images
CREATE TABLE Vendor_Submission_Images (
    image_id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES Vendor_Submissions(submission_id) ON DELETE CASCADE,
    photo_type_id INTEGER REFERENCES Photo_Types(photo_type_id),
    image_url TEXT NOT NULL
);

-- Insert predefined price ranges
INSERT INTO Price_Ranges (range)
VALUES
    ('$'),
    ('$$'),
    ('$$$'),
    ('$$$$');

-- Insert predefined photo types
INSERT INTO Photo_Types (type_name)
VALUES
    ('Menu'),
    ('Food'),
    ('Restaurant'),
    ('Display');

-- Insert dummy data into the Food_Types table
INSERT INTO Food_Types (type_name) VALUES
    ('American'),
    ('Argentinian'),
    ('Brazilian'),
    ('British'),
    ('Caribbean'),
    ('Cajun'),
    ('Chinese'),
    ('Colombian'),
    ('Cuban'),
    ('Ethiopian'),
    ('Filipino'),
    ('French'),
    ('German'),
    ('Greek'),
    ('Indian'),
    ('Italian'),
    ('Japanese'),
    ('Korean'),
    ('Lebanese'),
    ('Mediterranean'),
    ('Mexican'),
    ('Middle Eastern'),
    ('Moroccan'),
    ('Peruvian'),
    ('Polish'),
    ('Portuguese'),
    ('Russian'),
    ('Spanish'),
    ('Sri Lankan'),
    ('Steakhouse'),
    ('Thai'),
    ('Turkish'),
    ('Ukrainian'),
    ('Vietnamese');

INSERT INTO Users (uid, username, email, role)
VALUES ('Gxenk50qj7hj9xP3m0YQZiOTRnx2', 'vendor', 'vendor@gmail.com', 'vendor');


INSERT INTO Restaurants (name, location, price_range_id, hours_of_operation, is_open, description, website, phone_number, email, food_type_id)
VALUES
    ('Tonis Courtyard Cafe', '516 W 18th St, Merced, CA', 2, 
     '{"monday": "7:30 AM - 3:00 PM", "tuesday": "7:30 AM - 3:00 PM", "wednesday": "7:30 AM - 3:00 PM", "thursday": "7:30 AM - 3:00 PM", "friday": "7:30 AM - 3:00 PM", "saturday": "Closed", "sunday": "Closed"}', 
     TRUE, 
     'Featuring an extensive menu of casual Italian-inspired American eats & an idyllic courtyard patio.', 
     'http://www.toniscourtyardcafe.com/', '209-384-2580', 'contact@example.com', 1),  -- American

    ('Joystiq', '325 W Main St, Merced, CA', 3, 
     '{"monday": "3:00 PM - 12:00 AM", "tuesday": "3:00 PM - 12:00 AM", "wednesday": "3:00 PM - 12:00 AM", "thursday": "3:00 PM - 12:00 AM", "friday": "3:00 PM - 12:00 AM", "saturday": "3:00 PM - 12:00 AM", "sunday": "Closed"}', 
     TRUE, 
     'Experience great vibes and nostalgia at one of the best bars in town, featuring old arcade games, fantastic drinks, and lively music.', 
     'http://www.joystiqmerced.com/', '209-455-3300', 'joystiqmerced@gmail.com', 1),  -- American

    ('Kind Neighbor', '1635 M St, Merced, CA', 2, 
     '{"monday": "7:30 AM - 6:00 PM", "tuesday": "7:30 AM - 6:00 PM", "wednesday": "7:30 AM - 6:00 PM", "thursday": "7:30 AM - 6:00 PM", "friday": "7:30 AM - 6:00 PM", "saturday": "Closed", "sunday": "Closed"}', 
     TRUE, 
     'Enjoy one of the best smoothies ever, like our refreshing strawberry smoothie with almond milk, for a delicious treat worth the wait.', 
     'http://www.kindneighborjuicebar.com/', '209-617-6538', 'kindneighborinfo@gmail.com', 1),  -- American

    ('Oishi Teri Sushi Bar', '235 W Main St, Merced, CA', 4, 
     '{"monday": "11:00 AM - 8:00 PM", "tuesday": "11:00 AM - 8:00 PM", "wednesday": "11:00 AM - 8:00 PM", "thursday": "11:00 AM - 8:00 PM", "friday": "11:00 AM - 8:00 PM", "saturday": "Closed", "sunday": "Closed"}', 
     TRUE, 
     'Enduring, spacious eatery preparing traditional Thai staples & some Vietnamese options in calm digs.', 
     'http://www.oishisushibar.com', '209-653-5859', 'contact@example.com', 17);  -- Japanese
;  -- Mexican


INSERT INTO Restaurants (name, uid, location, price_range_id, hours_of_operation, is_open, description, website, phone_number, email, food_type_id)
VALUES
    ('El Palmar Taqueria', 'Gxenk50qj7hj9xP3m0YQZiOTRnx2', '1127 Martin Luther King Jr Way, Merced, CA', 1, 
     '{"monday": "10:00 AM - 9:00 PM", "tuesday": "10:00 AM - 9:00 PM", "wednesday": "10:00 AM - 9:00 PM", "thursday": "10:00 AM - 9:00 PM", "friday": "10:00 AM - 9:00 PM", "saturday": "Closed", "sunday": "Closed"}', 
     TRUE, 
     'Enjoy some of the best Mexican food in a relaxed atmosphere with reasonable prices', 
     'http://www.elpalmartaqueria.com/', '209-726-8855', 'contact@example.com', 21);

-- Insert dummy data into the Restaurant_Pictures table
INSERT INTO Restaurant_Pictures (restaurant_id, photo_type_id, image_url, alt_text)
VALUES
    (1, 4, 'https://utfs.io/f/TnfuvTEmVxjlck1916M2BxEX4gp9VPDHA36Trh8aUvOY7zCs', 'Toni Courtyard Cafe'), -- Restaurant Building
    (1, 2, 'https://utfs.io/f/TnfuvTEmVxjlInrtm52apk34Q7E8uxyASnJPMFIRsGU5bjcq', 'Bacon Hamburger'), -- Food
    (1, 3, 'https://utfs.io/f/TnfuvTEmVxjlhtRKBb6qKOM2H9kBCzda7buYc4g3DmJ5xLXv', 'Strawberry French Toast'), -- Menu Item
    (1, 3, 'https://utfs.io/f/TnfuvTEmVxjl1FtkoY0vkWRAzO9Y2jL5eDi8md1VI370QxnT', 'Avocado Toast'), -- Menu Item
    (2, 4, 'https://utfs.io/f/TnfuvTEmVxjlyPXQfYDHhsbgP0vlOBIMWmEpy47rAJcGFfRk', 'Joystiq'), -- Restaurant Building
    (2, 2, 'https://utfs.io/f/TnfuvTEmVxjlCPescbntgdci7ymOo2TqsBznkIPx4w5tE0uJ', 'Burger'), -- Food
    (2, 3, 'https://utfs.io/f/TnfuvTEmVxjlbYYhoBakm8yxDQ2zjXVK9tcIu0lpLiE6Y7qB', 'Salad'), -- Menu Item
    (2, 3, 'https://utfs.io/f/TnfuvTEmVxjlZz4bNykTB7r6NOijlVQRg2cA03qxX5aUYTfz', 'Mozzarella Sticks'), -- Menu Item
    (3, 4, 'https://utfs.io/f/TnfuvTEmVxjl0l8UBuqEZ9v5FejB6oSg1MqUtTHkAzJibs8Y', 'Kind Neighbor'), -- Restaurant Building
    (3, 2, 'https://utfs.io/f/TnfuvTEmVxjlgiXd7tBy3G7qojHwPSJmlOY4LDbXQ08Ud16a', 'Acai Bowl'), -- Food
    (3, 3, 'https://utfs.io/f/TnfuvTEmVxjl9OryBwlIeQupKIDmfM8nCXlidcw3vHVbNSBT', 'Avocado Toast'), -- Menu Item
    (3, 3, 'https://utfs.io/f/TnfuvTEmVxjlpTaT7M25KW7g1TMRV9vGABShrJzekdE0DCmI', 'Overnight Oats'), -- Menu Item
    (4, 4, 'https://utfs.io/f/TnfuvTEmVxjl2HEoDoGMbIEUYnsuAjNdxG1SViXq6pFgmeKT', 'Oishi Teri Sushi Bar'), -- Restaurant Building
    (4, 2, 'https://utfs.io/f/TnfuvTEmVxjlaY4TjEOW4Mo9jEqKlJRn1gfb8De0PVZGsuc2', 'Sashimi'), -- Food
    (4, 3, 'https://utfs.io/f/TnfuvTEmVxjla9FHYJOW4Mo9jEqKlJRn1gfb8De0PVZGsuc2', 'Sushi Heart'), -- Menu Item
    (4, 3, 'https://utfs.io/f/TnfuvTEmVxjlgC6DftBy3G7qojHwPSJmlOY4LDbXQ08Ud16a', 'Shrimp Head Sushi'), -- Menu Item
    (5, 4, 'https://utfs.io/f/TnfuvTEmVxjlaF7WYTOW4Mo9jEqKlJRn1gfb8De0PVZGsuc2', 'El Palmar Taqueria'), -- Restaurant Building
    (5, 2, 'https://utfs.io/f/TnfuvTEmVxjlOGKBa2nRnS8w5sUrlh73XzKe2jafgVbqPyJt', 'Wet Burrito'), -- Food
    (5, 3, 'https://utfs.io/f/TnfuvTEmVxjl31i0Lm4UbSKvmQr8spuFqhCjN2knDeW5Lyl3', 'Nachos'), -- Menu Item
    (5, 3, 'https://utfs.io/f/TnfuvTEmVxjlUafMQdy9CMir73AItu2pD6oZfkPF0zy1cUOH', 'Torta'); -- Menu Item



INSERT INTO Menus (restaurant_id, name, description)
VALUES
    (1, 'Specialty Sandwiches', 'Served with Salad, Potato Salad or French fries'),
    (1, 'Organic Salads', 'Served with choice of Dressing and Freshly Baked Bread & Butter'),
    (2, 'MULTIPLAYER PLATES', ''),
    (2, 'BURGERS', ''),
    (3, 'Smoothies', ''),
    (3, 'Smoothie Bowls', ''),
    (3, 'Broths/Soup', ''),
    (4, 'Appetiers', ''),
    (4, 'Sashimi', ''),
    (5, 'Taco Truck Menu', '');

INSERT INTO Menu_Items (menu_id, item_name, item_description, item_price, image_path, alt_text, is_vegetarian, is_vegan, is_gluten_free)
VALUES
    (1, 'MEDITERRANEAN GRILLED CHICKEN', 'Sundried tomatoes, feta, spinach, pesto mayo on homemade focaccia bread', 14.00, '/images/food-bg-images.jpg', NULL, false, false, false),
    (1, 'TRI TIP', 'Our house smoked tri tip sauteed mushrooms, caramelized onions, swiss, mayo on french bread', 14.00, '/images/food-bg-images.jpg', NULL, false, false, false),
    (2, 'COURTYARD SALAD', 'Mixed greens with apples, cranberries, tomatoes, blue cheese crumbles, and candied walnuts', 12.00, '/images/food-bg-images.jpg', NULL, true, false, false),
    (3, 'PITA & DIP TRIO', 'Warm pita served with hummus and tzatziki sauce. Choose two: creamy hummus, spinach & garlic, habanero', 16.25, '/images/food-bg-images.jpg', NULL, true, false, false),
    (4, 'HOUSE BURGER', '1/3 pound patty of Angus beef, lettuce, tomato, Swiss cheese, red onion, Dijon mustard served on toasted sesame seed bun | Add extra Angus beef patty +$2', 14.00, '/images/food-bg-images.jpg', NULL, false, false, false),
    (4, 'CUBANO SANDWICH', 'Smoked pulled pork, sliced ham, Swiss cheese, sliced dill pickles, Dijon mustard on Cuban bread', 16.25, '/images/food-bg-images.jpg', NULL, false, false, false),
    (5, 'Kiwi Smoothie', 'Ingredients: almond milk, banana, kiwi, apple, spinach, almond butter, honey.', 6.95, '/images/food-bg-images.jpg', NULL, true, true, true),
    (5, 'Sunrise Orange Smoothie', 'Ingredients: banana, orange, carrot, almond butter, honey, vanilla bean powder, turmeric, orange juice, coconut milk.', 6.95, '/images/food-bg-images.jpg', NULL, true, true, true),
    (6, 'Loaded Superfood Acai Bowl', 'Ingredients: açaí, banana, strawberries, hemp milk.', 12.50, '/images/food-bg-images.jpg', NULL, true, true, true),
    (7, 'Mama De Mi Alma: Vegan Green Chile Pozole', 'Soup: jackfruit, hominy, filtered water, garlic, organic white onion, olive oil, chile verde (tomatillo, serrano, poblano, white onion, garlic, cilantro, organic pumpkin seeds, cumin, sea salt), apple cider vinegar, homemade vegan bouillon, organic oregano.', 8.95, '/images/food-bg-images.jpg', NULL, true, true, true),
    (8, 'Mixed Tempura', 'Tempura shrimp & vegetable served with tempura sauce', 12.95, '/images/food-bg-images.jpg', NULL, false, false, false),
    (8, 'Grilled Squid', 'Lightly salted grilled squid, served with special sauce', 11.95, '/images/food-bg-images.jpg', NULL, false, false, false),
    (9, 'Maguro (Tuna)', '7 pieces', 20.95, '/images/food-bg-images.jpg', NULL, false, false, true),
    (9, 'Shiro Maguro (Albacore)', '7 pieces', 20.95, '/images/food-bg-images.jpg', NULL, false, false, true),
    (9, 'Sake (Salmon)', '7 pieces', 20.95, '/images/food-bg-images.jpg', NULL, false, false, true),
    (10, 'Burrito', 'Comes with rice, beans, cilantro, onion, sauce and your choice of meat.', 10.95, '/images/food-bg-images.jpg', NULL, false, false, false),
    (10, 'Quesadilla', 'Comes with jack/cheddar cheese, cilantro, onion, sauce and your choice of meat.', 11.25, '/images/food-bg-images.jpg', NULL, false, false, false),
    (10, 'Vegetarian Burrito', 'Comes with rice, beans, cilantro, onion, sauce, lettuce, cheddar/jack cheese, sour cream, and tomato.', 9.75, '/images/food-bg-images.jpg', NULL, true, false, false),
    (10, 'Red Taco', 'Comes with birria (beef), cilantro, onion, sauce, cheese and a 6 oz consome.', 4.25, '/images/food-bg-images.jpg', NULL, false, false, false);
   

INSERT INTO Dietary_Restrictions (name, description)
VALUES
    ('Vegetarian', 'No meat or fish'),
    ('Vegan', 'No animal products'),
    ('Gluten-Free', 'No gluten-containing ingredients');

INSERT INTO Restaurant_Dietary_Options (restaurant_id, restriction_id)
VALUES (1, 1), (2,1), (3,1), (3,2), (3,3), (4, 3), (5, 1);

-- Uncomment to drop the database (use with caution)
--  DROP DATABASE eats_in_reach_db;