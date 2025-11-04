import { IsInt, IsOptional, IsString } from 'class-validator';

// src/attendance/dto/create-attendance.dto.ts

export class CreateAttendanceDto {
  user_id: number;
  date: string;
  time: string;
  status: string;
}
