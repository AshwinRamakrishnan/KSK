// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUcPaGdOPQtsk9YqMeDWqvNKWFu7I-F_o",
    authDomain: "test-420914.firebaseapp.com",
    databaseURL: "https://test-420914-default-rtdb.firebaseio.com",
    projectId: "test-420914",
    storageBucket: "test-420914.appspot.com",
    messagingSenderId: "551223275238",
    appId: "1:551223275238:web:3d883e1e3ca2473d02d527",
    measurementId: "G-S25F8L72DH"
  };
  

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Students Data
const studentsData = {
    CSE: {
        "1st Year": [
            { name: "Abin Raj A", id: "821023104001" },
            { name: "Akalya D", id: "821023104002" }
        ],
        "2nd Year": [
            { name: "Anandhan V", id: "821023104003" },
            { name: "Anisha A", id: "821023104004" }
        ]
    },
    ECE: {
        "1st Year": [
            { name: "Student ECE1", id: "ECE001" },
            { name: "Student ECE2", id: "ECE002" }
        ],
        "2nd Year": [
            { name: "Student ECE3", id: "ECE003" },
            { name: "Student ECE4", id: "ECE004" }
        ]
    }
};

// Role-Based Access
let userRole = 'teacher'; // Change to 'principal' for principal access

// DOM Elements
const loginPage = document.getElementById("login-page");
const departmentPage = document.getElementById("department-page");
const yearPage = document.getElementById("year-page");
const attendancePage = document.getElementById("attendance-page");
const studentList = document.getElementById("student-list");
const errorMessage = document.getElementById("error-message");

// Show page based on role
function showPageBasedOnRole() {
    loginPage.classList.add("hidden");
    if (userRole === "teacher") {
        departmentPage.classList.remove("hidden");
    } else if (userRole === "principal") {
        // Load attendance summary for the principal
        loadAttendanceSummary();
    }
}

// Handle Login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            userRole = email === "principal@example.com" ? "principal" : "teacher"; // Assign roles based on email
            showPageBasedOnRole();
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
}

// Handle Department Selection
function selectDepartment(department) {
    departmentPage.classList.add("hidden");
    yearPage.classList.remove("hidden");
    yearPage.setAttribute("data-department", department);
}

// Handle Year Selection
function selectYear(year) {
    const department = yearPage.getAttribute("data-department");
    loadStudents(department, year);
}

// Load Students Based on Department and Year
function loadStudents(department, year) {
    const students = studentsData[department][year];
    if (!students) return;

    studentList.innerHTML = ""; // Clear previous students
    students.forEach((student) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${student.name} (${student.id})
            <select data-id="${student.id}">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
            </select>
        `;
        studentList.appendChild(li);
    });

    yearPage.classList.add("hidden");
    attendancePage.classList.remove("hidden");
}

// Submit Attendance
function submitAttendance() {
    const attendance = [];
    const selects = studentList.querySelectorAll("select");
    selects.forEach((select) => {
        const id = select.dataset.id;
        const status = select.value;
        attendance.push({ id, status });
    });

    saveAttendance(attendance);
}

// Save Attendance to Firestore
function saveAttendance(attendance) {
    const attendanceRef = db.collection('attendance').doc('today');
    attendanceRef.set({
        date: new Date().toISOString(),
        attendanceData: attendance
    })
    .then(() => {
        console.log("Attendance saved successfully!");
        alert("Attendance Submitted!");
    })
    .catch(error => {
        console.error("Error saving attendance:", error);
    });
}

// Load Attendance Summary for Principal
function loadAttendanceSummary() {
    const summaryDiv = document.getElementById("attendance-summary");
    const attendanceRef = db.collection('attendance').doc('today');

    attendanceRef.get().then(doc => {
        if (doc.exists) {
            const attendanceData = doc.data().attendanceData;
            attendanceData.forEach(record => {
                const div = document.createElement("div");
                div.innerHTML = `${record.name} (${record.id}): ${record.status}`;
                summaryDiv.appendChild(div);
            });
        } else {
            console.log("No attendance data found for today.");
        }
    }).catch(error => {
        console.error("Error fetching attendance:", error);
    });
}





