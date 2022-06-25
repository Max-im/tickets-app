import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

interface ITicket {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number;
  version: number;
  isReserved: () => boolean;
}

const ticketsSchema = new mongoose.Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

ticketsSchema.methods.isReserved = async function () {
  const ticketReserved = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });
  return !!ticketReserved;
};

const Ticket = mongoose.model<ITicket>('Ticket', ticketsSchema);

export { Ticket, ITicket };
