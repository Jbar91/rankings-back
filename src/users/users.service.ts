import { Injectable } from '@nestjs/common'
import { UserDto } from './dto/user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User } from './schemas/user.schemas'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: UserDto): Promise<User> {
    const data = new this.userModel(createUserDto)
    return data.save()
  }

  findAll() {
    return `This action returns all users`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
