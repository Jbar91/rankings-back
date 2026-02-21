import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.ranking) {
      await this.shiftRankings(createUserDto.ranking, null)
    }
    const user = this.userRepository.create(createUserDto)
    return await this.userRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { ranking: 'ASC', createdAt: 'DESC' },
    })
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)

    if (updateUserDto.ranking && updateUserDto.ranking !== user.ranking) {
      await this.shiftRankings(updateUserDto.ranking, user.ranking)
    }

    const updatedUser = Object.assign(user, updateUserDto)
    return await this.userRepository.save(updatedUser)
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    const oldRank = user.ranking
    await this.userRepository.remove(user)

    // Shift everyone up after a removal
    if (oldRank !== null) {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ ranking: () => '"ranking" - 1' })
        .where('"ranking" > :oldRank', { oldRank })
        .execute()
    }
  }

  /**
   * Helper to handle ranking shifts
   */
  private async shiftRankings(newRank: number, oldRank: number | null) {
    const queryBuilder = this.userRepository.createQueryBuilder().update(User)

    if (oldRank === null || newRank < oldRank) {
      // Shifting down to make space at newRank
      const maxRank = oldRank !== null ? oldRank - 1 : 999999
      await queryBuilder
        .set({ ranking: () => '"ranking" + 1' })
        .where('"ranking" >= :newRank AND "ranking" <= :maxRank', {
          newRank,
          maxRank,
        })
        .execute()
    } else if (newRank > oldRank) {
      // Shifting up to fill the gap left at oldRank
      await queryBuilder
        .set({ ranking: () => '"ranking" - 1' })
        .where('"ranking" > :oldRank AND "ranking" <= :newRank', {
          oldRank,
          newRank,
        })
        .execute()
    }
  }
}
