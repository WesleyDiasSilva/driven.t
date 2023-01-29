import { prisma } from "@/config";

async function getPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({ where: { ticketId } });
}

const paymentsRepository = {
  getPaymentByTicketId
};

export { paymentsRepository };
