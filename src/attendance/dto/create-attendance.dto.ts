import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  userId: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
