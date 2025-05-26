import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export enum UserRole {
  PASSENGER = 'passenger',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  fullName: string
  phone?: string
  email: string
  password?: string
  role: UserRole
  birthDate?: Date
  refreshToken?: string
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword: () => Omit<IUser, 'password'>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    fullName: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    birthDate: { type: Date, required: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.PASSENGER,
    },
    refreshToken: { type: String },
  },
  { timestamps: true }
)

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (this.password) {
    this.password = await hashValue(this.password);
  }
  return next();
});

UserSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

UserSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
