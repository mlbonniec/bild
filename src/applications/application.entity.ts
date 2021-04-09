import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { Exclude, Expose, Transform } from 'class-transformer';
import { nanoid } from 'nanoid';
import { User } from '../users/user.entity';

@Entity()
@Unique({ properties: ['name', 'owner'] })
export class Application {
  @PrimaryKey()
  applicationId: string = nanoid(10);

  @Property()
  @Expose({ groups: ['TokenIncluded'] })
  token = `${nanoid(64)}.${this.applicationId}`;

  @Property()
  @Transform(value => new Date(value.value).getTime())
  @Exclude()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @Transform(value => new Date(value.value).getTime())
  @Exclude()
  updatedAt: Date = new Date();

  @Property()
  name!: string;

  @Property()
  displayName!: string;

  @Property()
  website: string;

  @Property()
  description: string;

  @ManyToOne()
  @Transform(({ value }) => value.userId)
  owner!: User;

  constructor(owner: User, name: string, website = '', description = '') {
    this.owner = owner;
    this.name = name;
    this.displayName = name;
    this.website = website;
    this.description = description;
  }
}
