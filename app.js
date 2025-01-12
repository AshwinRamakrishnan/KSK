
const admin = require('firebase-admin');

// serviceAccountKey.json கோப்பை import செய்தல்
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Firebase Admin SDK initialization was successful
console.log('Firebase Admin SDK initialized successfully!');
