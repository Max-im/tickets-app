import mongoose from 'mongoose';
import { OrderStatus } from '@mpozhydaiev-tickets/common';

interface IOrder {
  status: OrderStatus;
  userId: string;
  price: number;
  version: number;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order, OrderStatus };
