import { prisma } from "@/config";

async function findRoomById(roomId: number) {
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
