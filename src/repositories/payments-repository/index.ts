import { prisma } from "@/config";

async function getPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

type paymentNew = { 
  ticketId: number;
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
}
async function createPayment(newPayment: paymentNew) {
  await prisma.payment.create({ data: newPayment } );
}

const paymentsRepository = {
  getPaymentByTicketId,
  createPayment
};

export { paymentsRepository };
