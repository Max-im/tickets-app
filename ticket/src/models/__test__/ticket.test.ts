import { Ticket } from '../Ticket';

it('should throw error if try to save ticket with wrong version', async () => {
  const ticket = new Ticket({ userId: 'user', title: 'title', price: 20 });

  await ticket.save();

  const instanceOne = await Ticket.findById(ticket.id);
  const instanceTwo = await Ticket.findById(ticket.id);

  instanceOne!.set({ price: 10 });
  instanceTwo!.set({ price: 15 });

  await instanceOne!.save();
  try {
    await instanceTwo!.save();
  } catch (err) {
    return;
  }

  throw new Error('Saved wrong version of the ticket');
});
