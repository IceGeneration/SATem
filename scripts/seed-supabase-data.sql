-- Insert sample data into lost_found_items table for Supabase
INSERT INTO lost_found_items (
    object_name, 
    description, 
    full_description, 
    image_url, 
    student_number, 
    student_nickname, 
    found_date, 
    location_found, 
    status
) VALUES 
(
    'Water Bottle',
    'Blue water bottle found at the cafeteria...',
    'Blue water bottle found at the cafeteria during lunch break. Has a small dent on the side and a sticker with a cartoon character. The bottle appears to be made of stainless steel and has a sports cap. Found near table 15 in the main dining area.',
    '/placeholder.svg?height=300&width=300',
    '30234',
    'Ice',
    '2024-01-15',
    'Cafeteria - Table 15',
    'available'
),
(
    'School Bag',
    'Red backpack with multiple compartments...',
    'Red backpack with multiple compartments found in the library. Contains several textbooks and notebooks. The bag has a small tear on the front pocket and appears to belong to a high school student based on the contents. Found on the second floor near the study area.',
    '/placeholder.svg?height=300&width=300',
    '28156',
    'Mint',
    '2024-01-14',
    'Library - 2nd Floor',
    'available'
),
(
    'Calculator',
    'Scientific calculator found in math classroom...',
    'Scientific calculator (Casio fx-991ES) found in math classroom 201. The calculator is in good condition with all buttons working properly. Has a small scratch on the back cover. Found after the afternoon math class on the teacher''s desk.',
    '/placeholder.svg?height=300&width=300',
    '31089',
    'Bank',
    '2024-01-13',
    'Math Classroom 201',
    'claimed'
),
(
    'Lunch Box',
    'Pink lunch box with cartoon characters...',
    'Pink lunch box with Hello Kitty cartoon characters found in the playground area. The lunch box is made of plastic and has two compartments. Still contains some leftover food items. Found near the basketball court after recess.',
    '/placeholder.svg?height=300&width=300',
    '29847',
    'Ploy',
    '2024-01-12',
    'Playground - Basketball Court',
    'available'
),
(
    'Pencil Case',
    'Blue pencil case with zipper...',
    'Blue fabric pencil case with zipper found in the art room. Contains various colored pencils, erasers, and a small ruler. The case has a small embroidered flower design on the front. Found on one of the art tables after the afternoon art class.',
    '/placeholder.svg?height=300&width=300',
    '32145',
    'Nam',
    '2024-01-11',
    'Art Room - Table 3',
    'available'
),
(
    'Sports Shoes',
    'White sneakers size 38...',
    'White sneakers size 38 found in the gymnasium locker room. The shoes appear to be relatively new with minimal wear. Brand appears to be Nike with blue accents. Found in locker area after PE class.',
    '/placeholder.svg?height=300&width=300',
    '29563',
    'Fon',
    '2024-01-10',
    'Gymnasium - Locker Room',
    'available'
),
(
    'USB Flash Drive',
    '16GB USB drive found in computer lab...',
    '16GB SanDisk USB flash drive found in computer lab 3. The drive is black with a red stripe and has a lanyard attached. Contains some school project files. Found plugged into computer station 12 after the afternoon computer class.',
    '/placeholder.svg?height=300&width=300',
    '30987',
    'Arm',
    '2024-01-09',
    'Computer Lab 3 - Station 12',
    'available'
),
(
    'Eyeglasses',
    'Black-framed prescription glasses...',
    'Black-framed prescription glasses found in the school library. The glasses appear to be for nearsightedness with anti-glare coating. Found on a study table on the first floor near the reference section.',
    '/placeholder.svg?height=300&width=300',
    '28734',
    'View',
    '2024-01-08',
    'Library - Reference Section',
    'claimed'
);
