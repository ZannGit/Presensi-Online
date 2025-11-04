import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: any) {
    // ✅ perbaikan pemanggilan function
    return this.usersService.create(data);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: any) {
    // ✅ pastikan memanggil fungsi update yang benar
    return this.usersService.updateUser(+id, data);
  }
}
