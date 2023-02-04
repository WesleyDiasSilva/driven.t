import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";

import { createUser } from "./factories";
import { createSession } from "./factories/sessions-factory";
import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function cleanDb() {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.hotel.deleteMany({});
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export async function createHotelsDB() {
  await createHotels();
  await createRooms();
}

export async function createHotels() {
  await prisma.hotel.createMany({
    data: [{
      name: faker.name.firstName(),
      image: faker.image.city(),
    },
    {
      name: faker.name.firstName(),
      image: faker.image.city(),
    }],
  });
}

export async function createRooms() {
  const hotels = await prisma.hotel.findMany();
  await prisma.room.createMany({ data: [
    {
      hotelId: hotels[0].id,
      name: faker.name.firstName(),
      capacity: 2,
    },
    {
      hotelId: hotels[1].id,
      name: faker.name.firstName(),
      capacity: 1,
    },
  ]
  });
}
