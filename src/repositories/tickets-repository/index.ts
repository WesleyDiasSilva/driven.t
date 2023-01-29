import { prisma } from "@/config";
import { newTicket } from "@/protocols";

async function getTicketsTypes() {
  const types = await prisma.ticketType.findMany();
  return types;
}

async function getTicketUser(id: number) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      Enrollment: { userId: id },
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true
        },
      },
      createdAt: true,
      updatedAt: true
    },
  });
  return ticket;
}

async function createTicket(newTicket: newTicket) {
  await prisma.ticket.create({
    data: {
      status: newTicket.status,
      enrollmentId: newTicket.enrollmentId,
      ticketTypeId: newTicket.ticketTypeId
    }
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getTicketUser,
  createTicket
};

export default ticketsRepository;
