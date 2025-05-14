import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";
import { UserRole } from "./user.model";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userRole: UserRole;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  userRole: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
  },
  userAgent: { type: String },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow,
  },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);
export default SessionModel;
