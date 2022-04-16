import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersService } from './users.service';
import { Injectable } from '@nestjs/common';
import { Role } from './enums/role';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersService: UsersService) {}

  validate(username: string, args: ValidationArguments) {
    return this.usersService.findByUsername(username).then((user) => {
      if (user) {
        return false;
      }
      return true;
    });
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersService: UsersService) {}

  validate(email: string, args: ValidationArguments) {
    return this.usersService.findByEmail(email).then((user) => {
      if (user) {
        return false;
      }
      return true;
    });
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
  validate(role: number, args: ValidationArguments) {
    return Role[role] !== undefined;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}

export function IsValidRole(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRoleConstraint,
    });
  };
}