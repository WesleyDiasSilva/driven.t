import { prisma } from "@/config";

export async function findRoomById(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId
    }
  });
}

const repositoryRoom = {
  findRoomById
};

export default repositoryRoom;
