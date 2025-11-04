import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('api/attendance')
export class AttendanceController {
  constructor(private svc: AttendanceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateAttendanceDto) {
    return this.svc.create(dto);
  }

  @UseGuards(JwtAuthGuard)
    @Post('analysis')
    async analyzeAttendance(@Body() body: { startDate: string; endDate: string; groupBy?: 'kelas' | 'jabatan' }) {
      return this.svc.analyzeAttendance(body);
    }

  @UseGuards(JwtAuthGuard)
  @Get('history/:userId')
  history(@Param('userId') userId: string) {
    return this.svc.history(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary/:userId/:year/:month')
  summary(@Param('userId') userId: string, @Param('year') year: string, @Param('month') month: string) {
    return this.svc.monthlySummary(Number(userId), Number(year), Number(month));
  }
}
