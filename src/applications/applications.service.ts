import { EntityRepository, UniqueConstraintViolationException, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
 BadRequestException,
 Injectable,
 NotFoundException,
 UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { Application } from './application.entity';
import type { CreateApplicationDto } from './dto/create-application.dto';
import type { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Application) private readonly applicationRepository: EntityRepository<Application>,
  ) {}

  public async create(userId: string, dto: CreateApplicationDto): Promise<Application> {
    const user = await this.userRepository.findOne({ userId });
    if (!user)
      throw new UnauthorizedException('Invalid token');

    try {
      const app = new Application(user, dto.name, dto.website, dto.description);
      await this.applicationRepository.persistAndFlush(app);
      return app;
    } catch (error: unknown) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Name is already taken');
      throw error;
    }
  }

  public async findAll(userId: string): Promise<Application[]> {
    return await this.applicationRepository.find({ owner: { userId } });
  }

  public async findOne(applicationId: string): Promise<Application | null> {
    const app = await this.applicationRepository.findOne({ applicationId });
    if (!app)
      throw new NotFoundException('Application not found');
    return app;
  }

  public async update(applicationId: string, dto: UpdateApplicationDto): Promise<Application> {
    const app = await this.applicationRepository.findOne({ applicationId });
    if (!app)
      throw new NotFoundException('Application not found');

    wrap(app).assign({ displayName: dto.displayName, description: dto.description, website: dto.website });
    await this.applicationRepository.flush();

    return app;
  }

  public async removeOne(applicationId: string): Promise<void> {
    await this.applicationRepository.nativeDelete({ applicationId });
  }
}