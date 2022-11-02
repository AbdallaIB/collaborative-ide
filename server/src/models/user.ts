import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { compare } from 'bcryptjs';

@modelOptions({
  schemaOptions: {
    // Add createdAt and updatedAt fields
    timestamps: true,
  },
})

// Export the User class to be used as TypeScript type
export class User {
  // @ts-expect-error
  @prop({
    unique: [true, 'Username is already taken.'],
    required: [true, 'Username is required.'],
    minLength: [5, 'Username must be at least 5 characters'],
    maxLength: [20, 'Username must be at most 20 characters'],
  })
  username: string;

  // @ts-expect-error
  @prop({ unique: [true, 'Email is already taken.'], required: [true, 'Email is required.'] })
  email: string;

  @prop({
    required: [true, 'Password is already taken.'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  })
  password: string;

  // Instance method to check if passwords match
  async comparePasswords(hashedPassword: string, candidatePassword: string) {
    return compare(candidatePassword, hashedPassword);
  }
}

// Create the user model from the User class
const userModel = getModelForClass(User);
userModel.createIndexes();
export default userModel;
