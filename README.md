<div align="center">

# 📊 Sistem Manajemen Kehadiran - UKL 2025

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.x-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**Aplikasi manajemen kehadiran berbasis RESTful API dengan NestJS, Prisma ORM, dan JWT Authentication**

[Fitur](#-fitur-utama) • [Instalasi](#-instalasi) • [API Docs](#-dokumentasi-api) • [Testing](#-hasil-testing)

</div>

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Teknologi](#-teknologi-yang-digunakan)
- [Fitur Utama](#-fitur-utama)
- [Struktur Project](#-struktur-project)
- [Database Schema](#️-database-schema)
- [Instalasi](#-instalasi)
- [Dokumentasi API](#-dokumentasi-api)
- [Hasil Testing](#-hasil-testing)
- [Postman Collection](#-postman-collection)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)

---

## 💡 Tentang Project

Sistem Manajemen Kehadiran adalah aplikasi backend berbasis **NestJS** yang dirancang untuk mengelola data kehadiran karyawan dengan fitur autentikasi JWT dan kontrol akses berbasis role (Admin & User). Aplikasi ini mendukung operasi CRUD lengkap, analitik kehadiran, dan manajemen user dengan berbagai tingkat jabatan.

> **📌 Important Note:** Import file Postman Collection dan Environment yang tersedia untuk testing API dengan mudah!

---

## 🚀 Teknologi yang Digunakan

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Framework** | NestJS 11.x | Progressive Node.js framework |
| **Language** | TypeScript 5.7.x | Type-safe development |
| **Database** | MySQL 8.0 | Relational database |
| **ORM** | Prisma 6.18.x | Next-gen ORM toolkit |
| **Authentication** | JWT | Token-based authentication |
| **Password Hash** | bcrypt | Secure password hashing |
| **Runtime** | Node.js 18+ | JavaScript runtime |

---

## ✨ Fitur Utama

### 🔐 Autentikasi & Otorisasi
- ✅ JWT-based authentication dengan token expiration
- ✅ Role-based access control (Admin & User)
- ✅ Password hashing menggunakan bcrypt
- ✅ Protected routes dengan guards

### 👥 Manajemen User
- ✅ CRUD operations untuk user management
- ✅ Multi-role support (Admin/User)
- ✅ Multi-jabatan support (Staff/Manager/Supervisor/Admin)
- ✅ Update profile, password, dan jabatan
- ✅ Admin-only endpoints untuk manajemen user

### 📅 Sistem Kehadiran
- ✅ Pencatatan kehadiran dengan 4 status (Hadir, Izin, Sakit, Alpha)
- ✅ Riwayat kehadiran per user
- ✅ Ringkasan kehadiran bulanan
- ✅ Update dan delete kehadiran
- ✅ Filter berdasarkan tanggal

### 📊 Analitik & Reporting
- ✅ Analisis kehadiran dengan filter rentang tanggal
- ✅ Analisis per jabatan (Staff/Manager/Supervisor)
- ✅ Perhitungan persentase kehadiran
- ✅ Summary statistics untuk admin

---

## 📁 Struktur Project

```
latihanukl2025/
├── 📂 prisma/
│   ├── schema.prisma              # Database schema
│   ├── prisma.module.ts           # Prisma module
│   ├── prisma.service.ts          # Prisma service
│   └── 📂 migrations/             # Database migrations
│
├── 📂 src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   │
│   ├── 📂 auth/                   # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── 📂 dto/
│   │
│   ├── 📂 user/                   # User management module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── 📂 dto/
│   │   └── 📂 entities/
│   │
│   ├── 📂 attendance/             # Attendance module
│   │   ├── attendance.controller.ts
│   │   ├── attendance.service.ts
│   │   ├── 📂 dto/
│   │   └── 📂 entities/
│   │
│   ├── 📂 guards/                 # Security guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   │
│   └── 📂 decorators/             # Custom decorators
│       └── roles.decorator.ts
│
├── 📂 images/                     # Testing screenshots
├── 📄 package.json
├── 📄 .env
└── 📄 README.md
```

---

## 🗄️ Database Schema

### 📊 Entity Relationship Diagram

```
┌─────────────────────┐           ┌─────────────────────┐
│       User          │           │     Attendance      │
├─────────────────────┤           ├─────────────────────┤
│ id (PK)            │ 1       N │ id (PK)            │
│ name               │───────────│ userId (FK)        │
│ username (UNIQUE)  │           │ date               │
│ password (HASHED)  │           │ status             │
│ role               │           │ createdAt          │
│ jabatan            │           │ updatedAt          │
│ createdAt          │           └─────────────────────┘
│ updatedAt          │
└─────────────────────┘
```

### 📝 Table: User

| Column | Type | Constraint | Default | Description |
|--------|------|------------|---------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | - | Unique identifier |
| `name` | VARCHAR | NOT NULL | - | Nama lengkap user |
| `username` | VARCHAR | UNIQUE, NOT NULL | - | Username untuk login |
| `password` | VARCHAR | NOT NULL | - | Password (bcrypt hashed) |
| `role` | VARCHAR | NOT NULL | `"user"` | Role: admin/user |
| `jabatan` | VARCHAR | NOT NULL | `"staff"` | Jabatan: staff/manager/supervisor/admin |
| `createdAt` | DATETIME | NOT NULL | NOW() | Timestamp pembuatan |
| `updatedAt` | DATETIME | NOT NULL | NOW() | Timestamp update terakhir |

### 📝 Table: Attendance

| Column | Type | Constraint | Default | Description |
|--------|------|------------|---------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | - | Unique identifier |
| `userId` | INT | FOREIGN KEY → User.id | - | Referensi ke user |
| `date` | DATETIME | NOT NULL | NOW() | Tanggal kehadiran |
| `status` | VARCHAR | NOT NULL | - | Status: hadir/izin/sakit/alpha |
| `createdAt` | DATETIME | NOT NULL | NOW() | Timestamp pembuatan |
| `updatedAt` | DATETIME | NOT NULL | NOW() | Timestamp update terakhir |

**📌 Relasi:** User (1) → Attendance (N) - One-to-Many Relationship

---

## 🔧 Instalasi

### Prasyarat

- Node.js (v18 atau lebih tinggi)
- MySQL Database
- npm atau yarn

### Langkah-langkah Setup

#### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd latihanukl2025
```

#### 2️⃣ Install Dependencies

```bash
npm install
```

#### 3️⃣ Konfigurasi Environment

Buat file `.env` di root directory:

```env
DATABASE_URL="mysql://user:password@localhost:3306/attendance_db"
JWT_SECRET="your-super-secret-key-here"
```

#### 4️⃣ Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi
npx prisma migrate dev

# (Opsional) Seed database
npx prisma db seed
```

#### 5️⃣ Jalankan Aplikasi

```bash
# Mode development
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

✅ Aplikasi akan berjalan di: **http://localhost:3000**

---

## 📚 Dokumentasi API

### 🔐 Modul Autentikasi

#### 1. Login Admin

```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

---

#### 2. Login User

```http
POST /auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "password123"
}
```

---

### 👥 Modul User Management (Khusus Admin)

> ⚠️ **Catatan:** Semua endpoint user memerlukan header `Authorization: Bearer <admin-token>` dan role admin.

#### 3. Buat User - Staff

```http
POST /user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Staff User",
  "username": "staff01",
  "password": "password123",
  "role": "user",
  "jabatan": "staff"
}
```

---

#### 4. Buat User - Manager

```http
POST /user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Manager User",
  "username": "manager01",
  "password": "password123",
  "role": "user",
  "jabatan": "manager"
}
```

---

#### 5. Buat User - Supervisor

```http
POST /user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Supervisor User",
  "username": "supervisor01",
  "password": "password123",
  "role": "user",
  "jabatan": "supervisor"
}
```

---

#### 6. Buat Admin Baru

```http
POST /user
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Admin User",
  "username": "admin02",
  "password": "password123",
  "role": "admin",
  "jabatan": "admin"
}
```

---

#### 7. Lihat Semua User

```http
GET /user
Authorization: Bearer <admin-token>
```

---

#### 8. Lihat User Berdasarkan ID

```http
GET /user/:id
Authorization: Bearer <admin-token>
```

---

#### 9. Update User - Ubah Nama

```http
PUT /user/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Nama User Updated"
}
```

---

#### 10. Update User - Ubah Jabatan

```http
PUT /user/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "jabatan": "manager"
}
```

---

#### 11. Update User - Ubah Password

```http
PUT /user/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "password": "newpassword123"
}
```

---

#### 12. Hapus User

```http
DELETE /user/:id
Authorization: Bearer <admin-token>
```

---

### 📅 Modul Attendance (Kehadiran)

#### 13. Buat Kehadiran (User/Admin)

```http
POST /attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "hadir"
}
```

**Status yang tersedia:** `hadir`, `izin`, `sakit`, `alpha`

---

#### 14. Lihat Semua Kehadiran (Khusus Admin)

```http
GET /attendance
Authorization: Bearer <admin-token>
```

---

#### 15. Lihat Riwayat Kehadiran User (User/Admin)

```http
GET /attendance/history
Authorization: Bearer <token>
```

---

#### 16. Lihat Ringkasan Bulanan (User/Admin)

```http
GET /attendance/summary
Authorization: Bearer <token>
```

---

#### 17. Analisis Kehadiran - Umum (Khusus Admin)

```http
POST /attendance/analyze
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "startDate": "2025-11-01",
  "endDate": "2025-11-30"
}
```

---

#### 18. Analisis Kehadiran - Per Jabatan (Khusus Admin)

```http
POST /attendance/analyze
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "startDate": "2025-11-01",
  "endDate": "2025-11-30",
  "groupByJabatan": "manager"
}
```

---

#### 19. Lihat Kehadiran Berdasarkan ID (Khusus Admin)

```http
GET /attendance/:id
Authorization: Bearer <admin-token>
```

---

#### 20. Update Kehadiran (Khusus Admin)

```http
PATCH /attendance/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "izin"
}
```

---

#### 21. Hapus Kehadiran (Khusus Admin)

```http
DELETE /attendance/:id
Authorization: Bearer <admin-token>
```

---

## 📸 Hasil Testing

### 🔐 Testing Autentikasi

| Endpoint | Screenshot |
|----------|------------|
| **Login Admin** | ![Login Admin](images/login-admin.png) |
| **Login User** | ![Login User](images/login-user.png) |

---

### 👥 Testing User Management

| Endpoint | Screenshot |
|----------|------------|
| **Create Staff** | ![Create Staff](images/create-staff.png) |
| **Create Manager** | ![Create Manager](images/create-manager.png) |
| **Create Supervisor** | ![Create Supervisor](images/create-supervisor.png) |
| **Create Admin** | ![Create Admin](images/create-admin.png) |
| **Get All Users** | ![Get All Users](images/get-user.png) |
| **Get User By ID** | ![Get User By ID](images/get-userbyid.png) |
| **Update Name** | ![Update Name](images/put-changename.png) |
| **Update Jabatan** | ![Update Jabatan](images/put-changejabatan.png) |
| **Update Password** | ![Update Password](images/put-changepassword.png) |
| **Delete User** | ![Delete User](images/delete-user.png) |

---

### 📅 Testing Attendance

| Endpoint | Screenshot |
|----------|------------|
| **Create Attendance** | ![Create Attendance](images/create-attendance.png) |
| **Get All Attendance** | ![Get All Attendance](images/get-attendances.png) |
| **Get User History** | ![Get User History](images/get-userattendancehistory.png) |
| **Get Summary** | ![Get Summary](images/get-summary.png) |
| **Analyze Attendance** | ![Analyze Attendance](images/analyzeattendance.png) |
| **Analyze By Jabatan** | ![Analyze By Jabatan](images/analyzeattendancebyjabatan.png) |
| **Get By ID** | ![Get By ID](images/get-attendancebyid.png) |
| **Update Attendance** | ![Update Attendance](images/update-attendance.png) |
| **Delete Attendance** | ![Delete Attendance](images/delete-attendance.png) |

---

## 🎯 Format Response Standar

### ✅ Response Sukses

```json
{
  "statusCode": 200,
  "message": "Success message",
  "success": true,
  "data": {
    // Data object atau array
  }
}
```

### ❌ Response Error

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "error": "Error details"
}
```

### 📊 Status Code yang Digunakan

| Status Code | Keterangan |
|-------------|------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Input tidak valid |
| 401 | Unauthorized - Token tidak valid/expired |
| 403 | Forbidden - Tidak memiliki akses |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Error server |

---

## 🔒 Security

### 🔑 JWT Token

- ⏰ **Token Expiration:** 2 jam
- 📋 **Token Payload:** `userId`, `username`, `role`
- 📤 **Header Format:** `Authorization: Bearer <token>`
- 🔄 **Refresh:** Login ulang setelah token expired

### 👮 Role-Based Access Control (RBAC)

| Endpoint | Admin | User |
|----------|-------|------|
| POST /auth/login | ✅ | ✅ |
| POST /user | ✅ | ❌ |
| GET /user | ✅ | ❌ |
| GET /user/:id | ✅ | ❌ |
| PUT /user/:id | ✅ | ❌ |
| DELETE /user/:id | ✅ | ❌ |
| POST /attendance | ✅ | ✅ |
| GET /attendance | ✅ | ❌ |
| GET /attendance/history | ✅ | ✅ (own) |
| GET /attendance/summary | ✅ | ✅ (own) |
| POST /attendance/analyze | ✅ | ❌ |
| GET /attendance/:id | ✅ | ❌ |
| PATCH /attendance/:id | ✅ | ❌ |
| DELETE /attendance/:id | ✅ | ❌ |

### 🔐 Password Security

- ✅ Hash dengan bcrypt (salt rounds: 10)
- ✅ Password tidak pernah dikembalikan dalam response
- ✅ Minimum password length: 6 karakter
- ✅ Password di-hash sebelum disimpan ke database

---

## 🛠️ Command Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (⚠️ HATI-HATI!)
npx prisma migrate reset

# Open Prisma Studio (GUI Database)
npx prisma studio

# Format schema.prisma
npx prisma format

# Pull schema from existing database
npx prisma db pull

# Push schema to database (tanpa migration)
npx prisma db push
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Generate test coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

---

## 📦 Postman Collection

Untuk mempermudah testing API, sudah tersedia **Postman Collection** lengkap dengan 27 requests!

### 📂 File yang Tersedia:

1. **Attendance-API.postman_collection.json** - Collection dengan 27 requests
2. **Attendance-API.postman_environment.json** - Environment variables
3. **POSTMAN_GUIDE.md** - Panduan lengkap penggunaan
4. **POSTMAN_COLLECTION_SUMMARY.md** - Ringkasan collection

### 📥 Cara Import ke Postman:

1. Buka aplikasi **Postman**
2. Klik tombol **Import** di pojok kiri atas
3. Pilih **file** atau drag & drop kedua file JSON:
   - `Attendance-API.postman_collection.json`
   - `Attendance-API.postman_environment.json`
4. Pilih environment **"Attendance API"** di dropdown (pojok kanan atas)
5. Selesai! Siap untuk testing 🚀

### ✨ Fitur Collection:

- ✅ 27 request lengkap (Auth, User, Attendance)
- ✅ Auto-save token setelah login
- ✅ Environment variables untuk token & IDs
- ✅ Test scripts untuk validasi otomatis
- ✅ Multiple test scenarios (Admin flow, User flow)

---

## 🚨 Troubleshooting

### ❌ Database Connection Error

```bash
# Solusi 1: Pastikan MySQL berjalan
sudo service mysql start    # Linux
net start MySQL             # Windows

# Solusi 2: Cek DATABASE_URL di .env
cat .env

# Solusi 3: Test koneksi database
npx prisma db pull
```

### ❌ JWT Token Invalid

**Penyebab:**
- Token sudah expired (> 2 jam)
- Format header salah
- Token tidak dari endpoint `/auth/login`

**Solusi:**
1. Login ulang untuk mendapatkan token baru
2. Pastikan format header: `Authorization: Bearer <token>`
3. Cek token di environment Postman

### ❌ Port Already in Use

```bash
# Solusi 1: Ubah port di main.ts
# Solusi 2: Kill process yang menggunakan port 3000

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9

# Solusi 3: Gunakan port lain
PORT=3001 npm run start:dev
```

### ❌ Prisma Generate Error

```bash
# Solusi: Clear cache dan regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

---

## 📝 Best Practices

| No | Practice | Keterangan |
|----|----------|------------|
| 1️⃣ | **Environment Variables** | Gunakan `.env` untuk data sensitif |
| 2️⃣ | **Validasi Input** | Implementasi DTO validation di semua endpoint |
| 3️⃣ | **Error Handling** | Gunakan proper HTTP status codes |
| 4️⃣ | **Database Transaction** | Untuk operasi multiple database |
| 5️⃣ | **Logging** | Implement logging untuk debugging |
| 6️⃣ | **Testing** | Test semua endpoint sebelum deployment |
| 7️⃣ | **Documentation** | Update API docs saat ada perubahan |
| 8️⃣ | **Version Control** | Commit dengan message yang jelas |

---

## 📊 Statistik API

| Kategori | Jumlah |
|----------|--------|
| Total Endpoints | 21 |
| Auth Endpoints | 2 |
| User Endpoints | 10 |
| Attendance Endpoints | 9 |
| Admin Only | 14 |
| User Access | 7 |

---

## 📄 Lisensi

Project ini dibuat untuk keperluan **UKL 2025**

---

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk **UKL 2025**

---

## 📞 Kontak & Support

Jika ada pertanyaan atau issue, silakan buat issue di repository ini atau hubungi maintainer.

---

<div align="center">

### 🎉 Selamat Coding dan Semoga Nilai UKL-mu Sempurna! 🎉

**Made with ❤️ using NestJS**

</div>
