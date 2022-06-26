import mongoose, { Schema, Model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './Order';

// interface IModel extends Model<ITicket> {
//   findByEvent: (attr: { id: string; version: number }) => ITicket | null;
// }
interface ITicket {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number;
  version: number;
  isReserved: () => boolean;
}

const ticketsSchema = new Schema<ITicket>(
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

ticketsSchema.set('versionKey', 'version');

ticketsSchema.plugin(updateIfCurrentPlugin);
// ticketsSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   };

//   done();
// });

// ticketsSchema.statics.findByEvent = async function (event: { id: string; version: number }) {
//   const previousVersion = event.version - 1;
//   return Ticket.findOne({ _id: event.id, version: previousVersion });
// };

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
