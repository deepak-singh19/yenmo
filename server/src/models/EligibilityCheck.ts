import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IEligibilityCheck extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  eligibleAmount: number;
  createdAt: Date;
  updatedAt: Date;
}


const eligibilityCheckSchema = new Schema<IEligibilityCheck>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Index added here
    date: { type: Date, default: Date.now },
    eligibleAmount: { type: Number, required: true }
  },
  { timestamps: true }
);


export const EligibilityCheck: Model<IEligibilityCheck> = mongoose.model<IEligibilityCheck>('EligibilityCheck', eligibilityCheckSchema);
