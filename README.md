# BIS SA - Manpower Management System

ระบบจัดการ Manpower Requests พร้อมระบบอนุมัติสำหรับ Admin

## 🎯 Features

### 👤 User Features (พนักงานทั่วไป)
- ✅ สร้าง Manpower Request ใหม่
- ✅ ดูรายการ Request ที่ส่งไปแล้ว
- ✅ ตรวจสอบสถานะของ Request
- ✅ ดูรายละเอียดของแต่ละ Request

### 👨‍💼 Admin Features (Admin123)
- ✅ ดูรายการ Manpower Requests ทั้งหมด
- ✅ อนุมัติ (Approve) Requests
- ✅ ปฏิเสธ (Reject) Requests พร้อมเหตุผล
- ✅ Dashboard แสดงสถิติ (Waiting, Approved, Rejected)
- ✅ กรอง Requests ตามสถานะ (Tabs)
- ✅ ดูรายละเอียดครบถ้วนของแต่ละ Request

## 🚀 Getting Started

### Prerequisites
- Node.js v14+
- MongoDB
- npm หรือ yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd SA_BIS
\`\`\`

2. Install Backend dependencies
\`\`\`bash
cd BE
npm install
\`\`\`

3. Install Frontend dependencies
\`\`\`bash
cd ../demo-app
npm install
\`\`\`

4. Start MongoDB
\`\`\`bash
mongod
\`\`\`

5. Start Backend server
\`\`\`bash
cd BE
npm start
# Backend runs on http://localhost:8000
\`\`\`

6. Start Frontend application
\`\`\`bash
cd demo-app
npm start
# Frontend runs on http://localhost:3000
\`\`\`

## 👥 User Accounts

### Admin Account
- **Username:** Admin123
- **Password:** (ตามที่กำหนดใน database)
- **Capabilities:** 
  - อนุมัติ/ปฏิเสธ Manpower Requests
  - ดู Dashboard และสถิติ
  - จัดการ Requests ทั้งหมด

### Regular User Account
- **Username:** (พนักงานทั่วไป)
- **Password:** (ตามที่กำหนดใน database)
- **Capabilities:**
  - สร้าง Manpower Requests
  - ดูรายการ Requests ของตัวเอง
  - ติดตามสถานะ

## 📁 Project Structure

\`\`\`
SA_BIS/
├── BE/                          # Backend (Node.js + Express)
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Authentication
│   │   ├── MController.js       # Manpower management
│   │   └── masterController.js  # Master data
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth & Role middleware
│   └── config/                  # Database config
│
└── demo-app/                    # Frontend (React)
    └── src/
        ├── pages/
        │   ├── Login.jsx           # Login page
        │   ├── AdminDashboard.jsx  # Admin dashboard
        │   └── UserDashboard.jsx   # User dashboard
        ├── context/
        │   └── AuthContext.js      # Authentication context
        └── App.js                  # Main app component
\`\`\`

## 🎨 Tech Stack

### Frontend
- ⚛️ React 18
- 🎨 Material-UI (MUI)
- 🔄 Axios
- 🍬 SweetAlert2
- 🎭 CSS Animations

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication
- 🛡️ Role-based Authorization

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/profile` - Get user profile

### Manpower Requests
- `GET /api/manpower/requests` - Get all requests
- `POST /api/manpower/requests` - Create new request
- `GET /api/manpower/requests/:id` - Get request by ID
- `POST /api/manpower/requests/:id/approve` - Approve request (Admin only)
- `POST /api/manpower/requests/:id/reject` - Reject request (Admin only)

### Master Data
- `GET /api/master/organizations` - Get all organizations
- `GET /api/master/departments` - Get all departments
- `GET /api/master/positions` - Get all positions

## 🎯 Features Highlights

### 🔐 Role-Based Access Control
- ระบบแยก Role ระหว่าง Admin และ User อัตโนมัติ
- Admin (Admin123) เห็นหน้า Admin Dashboard
- User ทั่วไปเห็นหน้า User Dashboard

### 📊 Admin Dashboard
- Card สถิติแสดงจำนวน Requests แต่ละสถานะ
- Tab กรอง Requests (Waiting, Approved, Rejected)
- ปุ่ม Approve/Reject พร้อม confirmation
- Notification badge แสดงจำนวน Requests รอดำเนินการ

### 📝 User Dashboard
- Form สร้าง Request แบบครบถ้วน
- ตารางแสดง Requests ของตัวเอง
- ดูรายละเอียด Request
- Status badge แสดงสถานะปัจจุบัน

### 🎨 UI/UX
- Gradient backgrounds สวยงาม
- Glass morphism effects
- Smooth animations
- Responsive design (รองรับทุกขนาดหน้าจอ)
- Material Design principles

## 📝 Request Status

- **Draft** - ร่าง (ยังไม่ส่ง)
- **WaitingApproval** - รออนุมัติ
- **Approved** - อนุมัติแล้ว ✅
- **Rejected** - ปฏิเสธ ❌

## 🔒 Security Features

- JWT Token Authentication
- Protected API Routes
- Role-based Middleware
- Password Hashing
- Secure HTTP headers

## 📱 Screenshots

### Login Page
- Modern glass morphism design
- Gradient animated background
- Show/hide password toggle
- Form validation

### Admin Dashboard
- Statistics cards with animations
- Tabbed interface
- Action buttons (View, Approve, Reject)
- Notification system

### User Dashboard
- Request creation form
- Personal requests table
- Status tracking
- Clean and intuitive interface

## 🛠️ Development

### Run in Development Mode

Backend:
\`\`\`bash
cd BE
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd demo-app
npm start
\`\`\`

### Build for Production

\`\`\`bash
cd demo-app
npm run build
\`\`\`

## 📄 License

This project is licensed under the MIT License

## 👨‍💻 Author

BIS SA Development Team

---

**Note:** ระบบนี้ออกแบบมาสำหรับการจัดการ Manpower Requests ภายในองค์กร โดย Admin123 จะมีสิทธิ์ในการอนุมัติหรือปฏิเสธ Requests ที่พนักงานส่งมา
