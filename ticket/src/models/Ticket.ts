import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ITicket {
  title: string;
  price: number;
  userId: string;
  orderId: string;
  version: number;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

ticketsSchema.set('versionKey', 'version');
ticketsSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<ITicket>('Ticket', ticketsSchema);

export { Ticket };
