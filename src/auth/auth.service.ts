import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService
  ) {}

  // 🔹 Cari user berdasarkan email, bukan ID
  async validateUser(email: string, pass: string) {
    const user = await this.users.findByEmail(email); // ✅ ubah fungsi yang dicari
    if (!user) return null;

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) return null;

    const { password, ...result } = user as any;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwt.sign(payload) };
  }
}
