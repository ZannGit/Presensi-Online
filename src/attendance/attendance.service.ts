import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfDay } from 'date-fns';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAttendanceDto) {
    const now = new Date();
    const dateKey = startOfDay(now);

    // check duplicate
    const existing = await this.prisma.attendance.findUnique({
      where: { userId_date: { userId: dto.userId, date: dateKey as any } },
    });
    if (existing) throw new BadRequestException('Attendance already recorded for today');

    return this.prisma.attendance.create({
      data: {
        userId: dto.userId,
        date: dateKey,
        status: dto.status ?? 'present',
        note: dto.note,
      },
    });
  }

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
    const present = rows.filter(r => r.status === 'present').length;
    const percent = (present / totalDays) * 100;
    return { totalDays, present, percent, rows };
  }

  async analyzeAttendance({ startDate, endDate, groupBy }: { startDate: any; endDate: any; groupBy?: any }) {
  const data = await this.prisma.attendance.findMany({
    where: {
      date: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: { user: true },
  });

  const total = data.length;
  const present = data.filter(d => d.status === 'present').length;
  const late = data.filter(d => d.status === 'late').length;
  const absent = data.filter(d => d.status === 'absent').length;

  const summary = {
    total,
    present,
    late,
    absent,
    presentPercentage: ((present / total) * 100).toFixed(2) + '%',
  };

  if (groupBy) {
    const grouped = {};
    for (const d of data) {
      const key = d.user[groupBy] || 'Tidak Diketahui';
      grouped[key] = grouped[key] || { total: 0, present: 0 };
      grouped[key].total++;
      if (d.status === 'present') grouped[key].present++;
    }
    for (const key in grouped) {
      grouped[key].percentage = ((grouped[key].present / grouped[key].total) * 100).toFixed(2) + '%';
    }
    summary['grouped'] = grouped;
  }

  return summary;
}

}
