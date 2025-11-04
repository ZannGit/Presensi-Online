import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { startOfDay, subDays } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Helper untuk memastikan seed idempotent:
 * - Jika user sudah ada (berdasarkan email), tidak dibuat duplikat.
 * - Untuk attendance, kita create hanya jika belum ada record untuk user+date.
 */

async function ensureUser(email: string, name: string, passwordPlain: string, role: 'ADMIN' | 'STUDENT' | 'STAFF') {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const hashed = await bcrypt.hash(passwordPlain, 10);
  return prisma.user.create({
    data: { email, name, password: hashed, role },
  });
}

async function ensureAttendance(userId: number, date: Date, status: string, note?: string) {
  // normalisasi date ke startOfDay UTC-ish untuk konsistensi
  const dateKey = startOfDay(date);
  // Prisma unique constraint adalah on [userId, date], jadi kita cek apakah sudah ada
  const existing = await prisma.attendance.findFirst({
    where: { userId, date: dateKey },
  });
  if (existing) return existing;

  return prisma.attendance.create({
    data: {
      userId,
      date: dateKey,
      status,
      note,
    },
  });
}

async function main() {
  console.log('Start seeding...');

  // 1) Buat akun: 1 admin dan 2 siswa (idempotent)
  const admin = await ensureUser('admin@example.com', 'Administrator', 'admin123', 'ADMIN');
  const studentA = await ensureUser('student1@example.com', 'Siswa Satu', 'student123', 'STUDENT');
  const studentB = await ensureUser('student2@example.com', 'Siswa Dua', 'student123', 'STUDENT');

  console.log('Users ensured:', { admin: admin.email, studentA: studentA.email, studentB: studentB.email });

  // 2) Buat data presensi random untuk 7 hari terakhir untuk kedua siswa
  const days = 7;
  for (let i = 0; i < days; i++) {
    const d = subDays(new Date(), i); // i hari yang lalu
    // buat sedikit variasi: studentA lebih sering hadir, studentB ada beberapa absen/late
    const rand = Math.random();
    const statusA = rand > 0.1 ? 'present' : (rand > 0.05 ? 'late' : 'absent');
    const statusB = rand > 0.6 ? 'present' : (rand > 0.3 ? 'late' : 'absent');

    await ensureAttendance(studentA.id, d, statusA, statusA === 'absent' ? 'Tidak hadir' : statusA === 'late' ? 'Telat' : 'Hadir tepat waktu');
    await ensureAttendance(studentB.id, d, statusB, statusB === 'absent' ? 'Sakit' : statusB === 'late' ? 'Telat karena transportasi' : 'Hadir');

    // (Opsional) juga isi attendance untuk admin sebagai contoh
    await ensureAttendance(admin.id, d, 'present', 'Admin check-in');
  }

  console.log('Attendance seeded for last', days, 'days.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });