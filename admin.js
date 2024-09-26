// Import the Firebase Admin SDK
const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key JSON file
const serviceAccountPath = './<path of json file>'; // Use relative path if in the same folder

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

// Firestore instance
const db = admin.firestore();

// Function to create the first admin
const createFirstAdmin = async (email, password) => {
  try {
    // Create the admin user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true, // Optional: set this to true if you want to skip email verification
    });

    console.log('Successfully created new admin user:', userRecord.uid);

    // Store the admin's information in the 'admins' collection
    await db.collection('admins').doc(userRecord.uid).set({
      email: userRecord.email,
      role: 'admin', // Add the role field and set it to 'admin'
      // Add any additional admin-related data here
    });

    console.log('Admin information successfully stored in the "admins" collection.');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Replace these with your admin email and password
const adminEmail = 'admin@example.com';
const adminPassword = '123456';

// Create the first admin
createFirstAdmin(adminEmail, adminPassword);
