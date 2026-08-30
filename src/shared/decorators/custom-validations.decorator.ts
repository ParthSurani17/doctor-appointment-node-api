/* eslint-disable @typescript-eslint/no-unused-vars */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsDisplayNameValid(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDisplayNameValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Check if the value is a string
          if (typeof value !== 'string') return false;

          // Check length
          if (value.length < 5 || value.length > 20) return false;

          // Check for valid characters
          const regex = /^[a-zA-Z0-9]+([-_\.]?[a-zA-Z0-9]+)*$/;
          if (!regex.test(value)) return false;

          // Check for special characters at start or end and multiple special characters in a row
          const specialCharRegex = /^([a-zA-Z0-9])([a-zA-Z0-9]*[._-][a-zA-Z0-9]+)*$/;
          return specialCharRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'The display name is invalid. It should be 5-20 characters long and only contain alphanumeric characters, underscores (_), hyphens (-), and periods (.), without starting or ending with special characters and no multiple special characters in a row.';
        },
      },
    });
  };
}
export function IsEndDateAfterStartDate(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isEndDateAfterStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return new Date(value) >= new Date(relatedValue);
        },
      },
    });
  };
}


export function IsStartDateInFuture(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isStartDateInFuture',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return new Date(value) >= new Date();
        },
      },
    });
  };
}




