
const admin = require('firebase-admin');
admin.initializeApp();

// Assign role 'teacher' to a specific user
admin.auth().setCustomUserClaims('user_id_for_teacher', { role: 'teacher' }).then(() => {
    console.log('Teacher role assigned successfully');
}).catch((error) => {
    console.error('Error assigning role:', error);
});

// Assign role 'principal' to another user
admin.auth().setCustomUserClaims('user_id_for_principal', { role: 'principal' }).then(() => {
    console.log('Principal role assigned successfully');
}).catch((error) => {
    console.error('Error assigning role:', error);
});
