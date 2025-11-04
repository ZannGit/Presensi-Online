// src/attendance/attendance.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttendanceDto) {
    // ✅ Validasi data dasar
    if (!dto.user_id || !dto.date || !dto.time || !dto.status) {
      throw new BadRequestException('Missing required fields');
    }

    // ✅ Cegah duplikasi presensi pada hari yang sama untuk user yang sama
    const existing = await this.prisma.attendance.findFirst({
      where: {
        userId: dto.user_id,
        date: new Date(dto.date),
      },
    });

    if (existing) {
      throw new BadRequestException('User has already recorded attendance for this date');
    }

    // ✅ Simpan data ke database
    return this.prisma.attendance.create({
      data: {
        userId: dto.user_id,
        date: new Date(dto.time ? `${dto.date}T${dto.time}` : dto.date),
        status: dto.status,
      },
    });
  }

  // ✅ method lain tetap sama
  async history(userId: number) {
    return this.prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async monthlySummary(userId: number, year: number, month: number) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    const rows = await this.prisma.attendance.findMany({
      where: { userId, date: { gte: start, lte: end } },
    });
    const totalDays = end.getUTCDate();
    const hadir = rows.filter(r => r.status === 'hadir').length;
    const izin = rows.filter(r => r.status === 'izin').length;
    const sakit = rows.filter(r => r.status === 'sakit').length;
    return { totalDays, hadir, izin, sakit, data: rows };
  }

  async analyzeAttendance({ startDate, endDate, groupBy }) {
    // bisa tetap sama seperti sebelumnya
  }
}
