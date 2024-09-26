import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}

const firestore = getFirestore();

export async function DELETE(req) {
  try {
    const { userId, role } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (role === "admin") {
      return new Response(JSON.stringify({ error: "Admin accounts cannot be deleted" }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete user from Firebase Authentication
    await getAuth().deleteUser(userId);

    // Determine the correct Firestore collection based on the user's role
    const collection = role === 'vendor' ? 'vendors' : 'users';

    // Delete the user/vendor from the respective collection in Firestore
    await firestore.collection(collection).doc(userId).delete();

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
