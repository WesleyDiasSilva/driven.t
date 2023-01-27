import ticketsRepository from "@/repositories/tickets-repository/index";

export async function serviceGetTicketsTypes() {
  const types = await ticketsRepository.getTicketsTypes();
  return types;
}
