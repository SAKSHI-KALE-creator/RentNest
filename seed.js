const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rentnest_db');
    console.log('[MongoDB Connected for Seeding]');

    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    console.log('[Cleared Existing Records]');

    // Create Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const ownerPassword = await bcrypt.hash('Owner@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: 'Aarav Singhania (Admin)',
        email: 'admin@rentnest.in',
        password: adminPassword,
        role: 'admin',
        phone: '+91 98111 22334',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Senior Real Estate Moderator & Chief Platform Administrator for RentNest India.',
        city: 'Bengaluru',
        state: 'Karnataka'
      },
      {
        name: 'Rajesh V. Sharma',
        email: 'rajesh.sharma@rentnest.in',
        password: ownerPassword,
        role: 'owner',
        phone: '+91 98450 12345',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Property Owner & Architect with prime properties in Bengaluru and Mumbai.',
        city: 'Bengaluru',
        state: 'Karnataka'
      },
      {
        name: 'Priya Sundaram Nair',
        email: 'priya.nair@rentnest.in',
        password: ownerPassword,
        role: 'owner',
        phone: '+91 97112 34567',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Real Estate Investor & Luxury Property Host in Gurgaon, Pune, and Hyderabad.',
        city: 'Gurgaon',
        state: 'Haryana'
      },
      {
        name: 'Arjun Verma',
        email: 'arjun.verma@rentnest.in',
        password: userPassword,
        role: 'user',
        phone: '+91 99887 66554',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
        bio: 'Lead Software Engineer looking for modern 2 BHK / 3 BHK homes near tech hubs.',
        city: 'Bengaluru',
        state: 'Karnataka'
      },
      {
        name: 'Sneha K. Patel',
        email: 'sneha.patel@rentnest.in',
        password: userPassword,
        role: 'user',
        phone: '+91 91234 56780',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        bio: 'Product Designer relocatee seeking quiet furnished apartments in Mumbai or Pune.',
        city: 'Mumbai',
        state: 'Maharashtra'
      }
    ]);

    const admin = users[0];
    const owner1 = users[1]; // Rajesh
    const owner2 = users[2]; // Priya
    const renter1 = users[3]; // Arjun
    const renter2 = users[4]; // Sneha

    // 2. Create Indian Properties
    const propertiesData = [
      {
        title: 'Luxury 3 BHK High-Rise Apartment with Skyline View',
        description: 'Exquisite 3 BHK apartment located in prestigious Indiranagar. Featuring marble flooring, Italian modular kitchen with chimney & pipeline gas, expansive wrap-around balcony overlooking lush greenery, and smart automation switches. Located 5 minutes walking distance from 100 Feet Road and Indiranagar Metro Station.',
        propertyType: 'Apartment / Flat',
        bhk: '3 BHK',
        rentAmount: 68000,
        securityDeposit: 250000,
        maintenanceCharges: 4500,
        carpetArea: 1850,
        furnishing: 'Furnished',
        preferredTenants: 'Family Only',
        address: {
          locality: 'Indiranagar 100 Feet Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          landmark: 'Opposite Toit & Indiranagar Metro'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Swimming Pool',
          'Gymnasium & Yoga Deck',
          'Clubhouse',
          'Modular Kitchen',
          'Piped Gas Connection',
          'Vastu Compliant',
          'Balcony with View'
        ],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 7,
        totalFloors: 14,
        facing: 'East',
        bathrooms: 3,
        balconies: 2,
        parking: 'Covered 4 & 2-Wheeler',
        featured: true,
        averageRating: 4.9,
        reviewsCount: 2,
        viewsCount: 342
      },
      {
        title: 'Chic 2 BHK Smart Gated Society Home near Tech Parks',
        description: 'Bright and airy 2 BHK apartment in Whitefield within a top-tier gated society. Walking distance to Prestige Shantiniketan, ITPL, and Kadugodi Metro. High-speed fiber-ready, modern wardrobes, vitrified tiles, and solar water heating.',
        propertyType: 'Apartment / Flat',
        bhk: '2 BHK',
        rentAmount: 38000,
        securityDeposit: 150000,
        maintenanceCharges: 3000,
        carpetArea: 1250,
        furnishing: 'Semi-Furnished',
        preferredTenants: 'Bachelors / Professionals',
        address: {
          locality: 'Whitefield near ITPL',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
          landmark: 'Behind Forum Shantiniketan Mall'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Gymnasium & Yoga Deck',
          'Childrens Play Area',
          'Modular Kitchen',
          'Wi-Fi Ready'
        ],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 4,
        totalFloors: 10,
        facing: 'North-East',
        bathrooms: 2,
        balconies: 1,
        parking: 'Covered 4-Wheeler',
        featured: true,
        averageRating: 4.7,
        reviewsCount: 1,
        viewsCount: 215
      },
      {
        title: 'Sea-Breeze 3 BHK Luxury Apartment at Carter Road',
        description: 'Immaculately crafted 3 BHK seaside residence overlooking the Arabian Sea in Bandra West. Features Italian marble, imported fixtures, central VRV air-conditioning, dedicated servant quarter, and 2 reserved basement parking slots. Elite neighborhood with celebrity residences and seafront promenade.',
        propertyType: 'Apartment / Flat',
        bhk: '3 BHK',
        rentAmount: 185000,
        securityDeposit: 600000,
        maintenanceCharges: 12000,
        carpetArea: 1950,
        furnishing: 'Furnished',
        preferredTenants: 'Anyone',
        address: {
          locality: 'Carter Road, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          landmark: 'Near Joggers Park & Promenade'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Gymnasium & Yoga Deck',
          'Modular Kitchen',
          'Air Conditioning',
          'Balcony with View',
          'Intercom Facility'
        ],
        images: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 12,
        totalFloors: 24,
        facing: 'West',
        bathrooms: 3,
        balconies: 2,
        parking: 'Covered 4 & 2-Wheeler',
        featured: true,
        averageRating: 5.0,
        reviewsCount: 1,
        viewsCount: 520
      },
      {
        title: 'Modern 2 BHK Condo overlooking Powai Lake',
        description: 'Serene 2 BHK in Hiranandani Gardens, Powai. Breathtaking lake and hill views, neoclassical architecture, walking distance to Haiko Mall, Galleria, and international schools. Complete with high-end appliances, teakwood furniture, and club membership.',
        propertyType: 'Apartment / Flat',
        bhk: '2 BHK',
        rentAmount: 62000,
        securityDeposit: 200000,
        maintenanceCharges: 5000,
        carpetArea: 1050,
        furnishing: 'Furnished',
        preferredTenants: 'Family Only',
        address: {
          locality: 'Hiranandani Gardens, Powai',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400076',
          landmark: 'Close to Galleria & D-Mart'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Swimming Pool',
          'Gymnasium & Yoga Deck',
          'Clubhouse',
          'Balcony with View'
        ],
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 8,
        totalFloors: 18,
        facing: 'North',
        bathrooms: 2,
        balconies: 1,
        parking: 'Covered 4-Wheeler',
        featured: false,
        averageRating: 4.8,
        reviewsCount: 1,
        viewsCount: 180
      },
      {
        title: 'Ultra-Premium 4 BHK Penthouse on Golf Course Road',
        description: 'Magnificent 4 BHK duplex penthouse on Golf Course Road, DLF Phase 5. Features double-height living room ceilings, private terrace garden with Jacuzzi, automated climate control, modular German kitchen, and concierge services. Minutes from Rapid Metro and Cyber City.',
        propertyType: 'Penthouse',
        bhk: '4 BHK',
        rentAmount: 175000,
        securityDeposit: 500000,
        maintenanceCharges: 15000,
        carpetArea: 3800,
        furnishing: 'Furnished',
        preferredTenants: 'Company Lease',
        address: {
          locality: 'Golf Course Road, Sector 54',
          city: 'Gurgaon',
          state: 'Haryana',
          pincode: '122002',
          landmark: 'Sector 54 Chowk Rapid Metro Station'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Swimming Pool',
          'Gymnasium & Yoga Deck',
          'Clubhouse',
          'Private Terrace',
          'Air Conditioning',
          'Modular Kitchen'
        ],
        images: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner2._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 21,
        totalFloors: 22,
        facing: 'East',
        bathrooms: 4,
        balconies: 3,
        parking: 'Covered 4 & 2-Wheeler',
        featured: true,
        averageRating: 4.9,
        reviewsCount: 1,
        viewsCount: 410
      },
      {
        title: 'Elegant 3 BHK Builder Floor with Stilt Parking',
        description: 'Independent luxury builder floor in South Extension Part II, New Delhi. Dedicated private passenger lift opening straight into the foyer, spacious drawing-dining hall with false ceiling and chandelier lighting, modular kitchen, and separate servant room with washroom.',
        propertyType: 'Builder Floor',
        bhk: '3 BHK',
        rentAmount: 85000,
        securityDeposit: 170000,
        maintenanceCharges: 2500,
        carpetArea: 2100,
        furnishing: 'Semi-Furnished',
        preferredTenants: 'Family Only',
        address: {
          locality: 'South Extension II',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110049',
          landmark: 'Near AIIMS & Ring Road'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Modular Kitchen',
          'Balcony with View',
          'Vastu Compliant'
        ],
        images: [
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner2._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 2,
        totalFloors: 4,
        facing: 'North-East',
        bathrooms: 3,
        balconies: 2,
        parking: 'Covered 4-Wheeler',
        featured: false,
        averageRating: 4.6,
        reviewsCount: 0,
        viewsCount: 164
      },
      {
        title: 'Spacious 3 BHK Gated Society Flat in Gachibowli',
        description: 'Brand new 3 BHK flat in high-end high-rise gated society in Financial District, Gachibowli. 5 minutes from Microsoft, Google, Amazon campuses, and ORR. World class 50,000 sq ft clubhouse with squash courts, badminton, temperature-controlled pool.',
        propertyType: 'Apartment / Flat',
        bhk: '3 BHK',
        rentAmount: 48000,
        securityDeposit: 100000,
        maintenanceCharges: 4000,
        carpetArea: 1700,
        furnishing: 'Semi-Furnished',
        preferredTenants: 'Bachelors / Professionals',
        address: {
          locality: 'Financial District, Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500032',
          landmark: 'Beside Wipro Circle & ORR Exit 1'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Swimming Pool',
          'Gymnasium & Yoga Deck',
          'Clubhouse',
          'Childrens Play Area',
          'Modular Kitchen'
        ],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner2._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 15,
        totalFloors: 30,
        facing: 'East',
        bathrooms: 3,
        balconies: 2,
        parking: 'Covered 4 & 2-Wheeler',
        featured: true,
        averageRating: 4.8,
        reviewsCount: 1,
        viewsCount: 290
      },
      {
        title: 'Cosy 1 BHK Fully Furnished Studio in Koregaon Park',
        description: 'Aesthetic, Scandinavian-designed 1 BHK home in the greenest lane of Koregaon Park. Walking distance to popular German Bakery, Osho Garden, and upscale cafes. Features high-speed Wi-Fi, 55" 4K Smart TV, workstation desk, and sunny sit-out balcony.',
        propertyType: 'Studio / 1 RK',
        bhk: '1 BHK',
        rentAmount: 26000,
        securityDeposit: 60000,
        maintenanceCharges: 1500,
        carpetArea: 650,
        furnishing: 'Furnished',
        preferredTenants: 'Bachelors / Professionals',
        address: {
          locality: 'Lane 7, Koregaon Park',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          landmark: 'Near German Bakery & Osho Garden'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Elevator / Lift',
          'Modular Kitchen',
          'Wi-Fi Ready',
          'Balcony with View'
        ],
        images: [
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 3,
        totalFloors: 6,
        facing: 'North',
        bathrooms: 1,
        balconies: 1,
        parking: '2-Wheeler Only',
        featured: false,
        averageRating: 4.9,
        reviewsCount: 1,
        viewsCount: 195
      },
      {
        title: 'Luxurious 4 BHK Independent Villa with Private Garden',
        description: 'Sprawling 4 BHK independent duplex villa situated in premium gated layout in HSR Layout Sector 2. Private manicured lawn, solar water heating, separate servant quarters, home theatre room, and covered parking for 2 SUVs.',
        propertyType: 'Independent House / Villa',
        bhk: '4 BHK',
        rentAmount: 110000,
        securityDeposit: 400000,
        maintenanceCharges: 5000,
        carpetArea: 3200,
        furnishing: 'Semi-Furnished',
        preferredTenants: 'Family Only',
        address: {
          locality: 'HSR Layout Sector 2',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560102',
          landmark: 'Near 27th Main Road Commercial Hub'
        },
        amenities: [
          '24/7 Security & CCTV',
          '100% Power Backup',
          'Covered Car Parking',
          'Private Garden / Lawn',
          'Modular Kitchen',
          'Rainwater Harvesting',
          'Vastu Compliant'
        ],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner1._id,
        status: 'approved',
        isAvailable: true,
        floorNumber: 1,
        totalFloors: 2,
        facing: 'East',
        bathrooms: 4,
        balconies: 2,
        parking: 'Covered 4 & 2-Wheeler',
        featured: true,
        averageRating: 4.9,
        reviewsCount: 0,
        viewsCount: 310
      },
      {
        title: 'Pending Listing: 2 BHK Cozy Flat in Hinjewadi Phase 1',
        description: 'Under moderation: newly listed 2 BHK flat near Cognizant and Infosys Hinjewadi campus. Great connectivity to Pune-Mumbai Expressway.',
        propertyType: 'Apartment / Flat',
        bhk: '2 BHK',
        rentAmount: 24000,
        securityDeposit: 60000,
        maintenanceCharges: 2000,
        carpetArea: 950,
        furnishing: 'Semi-Furnished',
        preferredTenants: 'Bachelors / Professionals',
        address: {
          locality: 'Hinjewadi Phase 1',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411057',
          landmark: 'Close to Shivaji Chowk'
        },
        amenities: [
          '24/7 Security & CCTV',
          'Elevator / Lift',
          'Covered Car Parking',
          'Modular Kitchen'
        ],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
        ],
        owner: owner2._id,
        status: 'pending', // Pending for Admin Approval testing!
        isAvailable: true,
        floorNumber: 5,
        totalFloors: 11,
        facing: 'North',
        bathrooms: 2,
        balconies: 1,
        parking: 'Covered 4-Wheeler',
        featured: false,
        averageRating: 4.5,
        reviewsCount: 0,
        viewsCount: 12
      }
    ];

    const insertedProperties = await Property.insertMany(propertiesData);
    console.log(`[Inserted ${insertedProperties.length} Indian Properties]`);

    // 3. Create Bookings & Visit Schedules
    const bookingsData = [
      {
        property: insertedProperties[0]._id, // 3 BHK Indiranagar
        user: renter1._id, // Arjun
        owner: owner1._id,
        bookingType: 'Schedule Visit',
        visitDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        visitTimeSlot: '11:00 AM - 01:00 PM',
        proposedMoveInDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        proposedRent: 65000,
        contactPhone: '+91 99887 66554',
        message: 'Looking for a long-term 2-year lease for my family. Would like to inspect the balcony and society clubhouse during the visit.',
        employmentType: 'IT / Corporate Professional',
        familyMembersCount: 3,
        status: 'confirmed',
        ownerResponse: 'Visit confirmed! I will be at the building reception at 11 AM.'
      },
      {
        property: insertedProperties[1]._id, // 2 BHK Whitefield
        user: renter2._id, // Sneha
        owner: owner1._id,
        bookingType: 'Rental Application',
        visitDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        visitTimeSlot: '02:00 PM - 04:00 PM',
        proposedMoveInDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        proposedRent: 38000,
        contactPhone: '+91 91234 56780',
        message: 'Transferring to Bengaluru branch next month. Looking forward to completing rental paperwork swiftly.',
        employmentType: 'IT / Corporate Professional',
        familyMembersCount: 2,
        status: 'pending'
      },
      {
        property: insertedProperties[4]._id, // Golf Course Road Gurgaon
        user: renter1._id,
        owner: owner2._id,
        bookingType: 'Schedule Visit',
        visitDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        visitTimeSlot: '04:00 PM - 06:00 PM',
        proposedRent: 175000,
        contactPhone: '+91 99887 66554',
        message: 'Company executive lease inquiry. Need to verify parking space for 2 cars.',
        employmentType: 'Salaried Employee',
        familyMembersCount: 4,
        status: 'pending'
      }
    ];

    await Booking.insertMany(bookingsData);
    console.log('[Inserted Bookings & Visits]');

    // 4. Create Reviews
    const reviewsData = [
      {
        property: insertedProperties[0]._id,
        user: renter1._id,
        rating: 5,
        comment: 'Outstanding locality and builder quality! The ventilation is great, 24/7 Cauvery water and power backup are dependable, and the metro is right next door.',
        pros: 'Prime Indiranagar location, massive balcony, responsive owner.',
        cons: 'Traffic on 100ft road during peak weekend evenings.',
        localityRating: 5
      },
      {
        property: insertedProperties[1]._id,
        user: renter2._id,
        rating: 5,
        comment: 'Peaceful gated community with top amenities. Gym and pool are maintained very well, super close to ITPL.',
        pros: 'High security, near tech park, fiber broadband ready.',
        cons: 'Visitor parking slots fill up fast.',
        localityRating: 4
      },
      {
        property: insertedProperties[2]._id, // Carter Road
        user: renter1._id,
        rating: 5,
        comment: 'Breathtaking sunset views over Carter Road. Worth every rupee for the location and luxury fittings.',
        pros: 'Unmatched sea view, celebrity neighborhood, peaceful breeze.',
        cons: 'Slightly high maintenance charges.',
        localityRating: 5
      }
    ];

    await Review.insertMany(reviewsData);
    console.log('[Inserted Verified Reviews]');

    console.log('\n=============================================');
    console.log(' RentNest India Database Seeded Successfully!');
    console.log('=============================================');
    console.log('Admin Login:    admin@rentnest.in / Admin@123');
    console.log('Landlord Login: rajesh.sharma@rentnest.in / Owner@123');
    console.log('Landlord Login: priya.nair@rentnest.in / Owner@123');
    console.log('Renter Login:   arjun.verma@rentnest.in / User@123');
    console.log('Renter Login:   sneha.patel@rentnest.in / User@123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
