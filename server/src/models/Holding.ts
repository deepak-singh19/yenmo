import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IHolding extends Document {
  userId: mongoose.Types.ObjectId;
  pan: string;
  fundName: string;
  category: string;
  currentValue: number;
  units: number;
  nav: number;
  createdAt: Date;
  updatedAt: Date;
}


const holdingSchema = new Schema<IHolding>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Index on userId
    pan: { type: String, required: true, index: true }, // Index on pan
    fundName: { type: String, required: true },
    category: { type: String, required: true },
    currentValue: { type: Number, required: true },
    units: { type: Number, required: true },
    nav: { type: Number, required: true }
  },
  { timestamps: true }
);


export const Holding: Model<IHolding> = mongoose.model<IHolding>('Holding', holdingSchema);
