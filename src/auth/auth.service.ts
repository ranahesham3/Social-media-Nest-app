import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-user.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login-user.dto';

const SALT = 12;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * create a new user
   * @param dto data used to create a new user
   * @returns access token
   */
  async register(dto: RegisterDto) {
    const { name, email, password } = dto;

    if (await this.userRepository.findOneBy({ email }))
      throw new BadRequestException('This user already exist');

    const hashedPassword = await bcrypt.hash(password, SALT);

    let user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    user = await this.userRepository.save(user);

    //generate the jwt
    const payload = {
      id: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  /**
   * login a user
   * @param dto data used to login a user
   * @returns access token
   */
  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new BadRequestException('Invalid Email or Password');

    if (!user.isActive) {
      throw new BadRequestException('Yor account is no longer active');
    }

    //generate the jwt
    const payload = {
      id: user.id,
      role: user.role,
      isActive: user.isActive,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
