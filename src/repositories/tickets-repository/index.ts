import { prisma } from "@/config";

async function getTicketsTypes() {
  const types = await prisma.ticketType.findMany();
  return types;
}

const ticketsRepository = {
  getTicketsTypes,
};

export default ticketsRepository;
