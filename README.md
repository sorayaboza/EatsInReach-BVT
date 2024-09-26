[Prerequisites](#prerequisites) |
[Database Setup](#database-setup) |
[Firebase Setup](#firebase-setup) |
[Setup for Images](#setup-for-images) |
[Setup for Contact Page](#setup-for-contact-page) |
[Creating Admins](#creating-admins)


_Please make sure to follow the instructions in order. You may run into errors if you follow them out of order._

# PREREQUISITES

## Windows

1. Install [PostgreSQL 15.8](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). (Uncheck 'Stack builder' and 'pgAdmin' when installing, we don't need those.)
2. After installation, open your Command Prompt and type `psql`.

- If `psql` is not recognized, then open your environment variables, and add `C:\Program Files\PostgreSQL\15\lib` and `C:\Program Files\PostgreSQL\15\bin` to your system variables PATH. (If you don't know how to access the environment variables, see the link below.)
- [Follow this tutorial to access and edit the environment variables.](https://www.c-sharpcorner.com/article/how-to-addedit-path-environment-variable-in-windows-11/#:~:text=We%20require%20permission%20from%20the,if%20you%20are%20not%20one.&text=Press%20Windows%2BR%2C%20type%20%22,%22%20and%20press%20%22Ok%22.)
- Open and close Command Prompt, try `psql` again. (If issues persist, message Soraya if you need help.)

3. In cmd, type `psql -U postgres`. Press enter, then enter your password. If this all works, you're good to go!

## MacOS

1. Install [PostgreSQL 16.4](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). (Uncheck 'Stack builder' and 'pgAdmin' when installing, we don't need those.)
2. After installation, open a terminal window and type `psql` to ensure that PostgreSQL is added to your system’s PATH.

- If `psql` is not recognized, then open your .zshrc or .bash_profile file in a text editor (depending on which shell you’re using):
- - code ~/.zshrc # For zsh users
- - nano ~/.bash_profile # For bash users
- - - Instead of using the nano text editor you could use VS Code using: code ~/.bash_profile
- Add the following line (adjust the path if needed):
- - export PATH="/Library/PostgreSQL/16/bin:$PATH"
- Save and close the file, then reload your terminal by running:
- - source ~/.zshrc # For zsh users
- - source ~/.bash_profile # For bash users

3. Open a new terminal window and type `psql --version`. If you see `psql(PostgreSQL)16.4`, then it worked!

# DATABASE SETUP

After cloning the repo:

1. Navigate to EatsInReach in terminal by typing `cd EatsInReach`.
2. Install packages by typing `npm install` in terminal. You can also type `npm i`.
3. Create a file named `.env` in the base folder. Add the following contents inside:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=[your postgreSQL password here]
DB_NAME=eats_in_reach_db
DATABASE_URL=postgres://postgres:[your postgreSQL password here]@localhost:5432/eats_in_reach_db
```
Do not include the brackets when adding in the password. 

4. In terminal, type `psql -U postgres -f src/app/data/database.sql`. This creates the database for you.
5. Install the PostgreSQL Explorer by Chris Kolkman on VS Code.
6. Once you install this, follow the instructions in [this Youtube video](https://youtu.be/ezjoDYs72GA?si=0U7jKxL2xwNuQ5YR&t=680) to create a connection to the database. The instruction ends at 13:20.
7. Run the program using `npm run dev`.
8. Go to <http://localhost:3000> to view the website.
9. Kill the program by pressing `CTRL+C` in the terminal.

# Firebase Setup

## Prerequisites

Before setting up Firebase, ensure you have the following:

- A Firebase account: [Sign up here](https://firebase.google.com/).
- Node.js version 14 or later

## Firebase Setup Instructions

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on **Add Project** and follow the steps to create your project.
3. After the project is created, navigate to the **Project Overview**.

### 2. Enable Firestore and Authentication

- **Firestore**: Go to the **Firestore Database** section in the Firebase Console and enable it.
- **Authentication**: Navigate to the **Authentication** section, then enable **Email/Password** authentication.

### 3. Add a Web App to Firebase

1. In the Firebase Console, go to **Project Overview > Add App**.
2. Choose the **Web** option and register your app with a name.
3. After registering the app, Firebase will provide you with a config object containing keys like `apiKey`, `authDomain`, etc. This will end up going in the `.env` file as follows:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Update Firebase Rules

1. By default the rules will allow anyone to read/write to the Firebase
2. Update these rules based on the roles of the users

### 5. Service account key JSON file
1. Under the project overview in firebase click the gear icon
2. Click project settings
3. Click the services account tab
4. Click the button generate new private key
5. Temporarily add the downloaded json file to the root of your directory for the Create Admins section
6. Once that is done add the JSON file in your `.env` file as `FIREBASE_SERVICE_ACCOUNT_KEY = '<Copy of JSON file>'`

# Setup for Images

The service we used for storing images and file hosting is called [UploadThing](https://uploadthing.com/). 

_UploadThing is a file upload solution for full stack applications that offers a balance of ownership, flexibility, and safety._

In your `.env` file you will need to include this token for _UploadThing_. 

```
UPLOADTHING_TOKEN='[your uploadthing token here]'
```

# Setup for Contact Page

Add this to the `.env` file to setup the email used for users to contact.

```
EMAIL_USER=eatsinreach@gmail.com
EMAIL_PASS=utxm xlhx iiiy olgq
```

# Creating Admins

## Prerequisites for Creating Admins

### 1. Firebase must be setup correctly

Follow the steps outlined in [Firebase Setup](#firebase-setup).

### 2. Create an Admin Script

1. Create a file named `admin.js` in the base folder.

2. Paste the following code into that file:

```
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
```

## Running Admin Script

### 1. Update `admin.js` script

1. Add your service account key JSON file in line 6.

```
const serviceAccountPath = './<path of json file>'; // Use relative path if in the same folder
```

2. Replace `adminEmail` and `adminPassword` with your admin email and password in line 42-43.

```
const adminEmail = 'admin@example.com';
const adminPassword = '123456';
```

### 2. Run in terminal `admin.js`

_Ensure you are in the root of your directory not `src/app`._

To run this script type this command in the terminal:

```
node admin.js
```

### 3. Delete the JSON file after adding it to your `.env` file
