import app, { init } from "@/app";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from "../factories";
import { cleanDb, createHotelsDB, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("Should respond with status 200 and list all hotels", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await prisma.ticketType.update({
      data: {
        includesHotel: true,
        isRemote: false
      },
      where: {
        id: ticketType.id
      }
    });
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotelsDB();
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);

    expect(result.statusCode).toBe(httpStatus.OK);
    expect(result.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        image: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        Rooms: expect.any(Array),
      })
    ]));
  });

  it("Should respond with status 404 when not exists enrollment", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    await createHotelsDB();
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);

    expect(result.statusCode).toBe(httpStatus.NOT_FOUND);
  });

  it("Should respond with status 404 when not exists ticket", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    await createHotelsDB();
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);

    expect(result.statusCode).toBe(httpStatus.NOT_FOUND);
  });

  it("Should respond with status 404 when not exists hotels", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await prisma.ticketType.update({
      data: {
        includesHotel: true,
        isRemote: false
      },
      where: {
        id: ticketType.id
      }
    });
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);

    expect(result.statusCode).toBe(httpStatus.NOT_FOUND);
  });

  it("Should respond with status 402 when ticket has not been paid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await prisma.ticketType.update({
      data: {
        includesHotel: true,
        isRemote: false
      },
      where: {
        id: ticketType.id
      }
    });
    await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    await createHotelsDB();
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);

    expect(result.statusCode).toBe(402);
  });

  it("Should respond with status 402 when ticket is remote", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType();
    await prisma.ticketType.update({
      data: {
        includesHotel: true,
        isRemote: true
      },
      where: {
        id: ticketType.id
      }
    });
    await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createHotelsDB();
    const result = await server.get("/hotels").set("authorization", "Bearer "+token);
    
    expect(result.statusCode).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  // it("Should respond with status 402 when ticket has not been paid, is remote or doesn't include hotel", async () => {
  //   const user = await createUser();
  //   const token = await generateValidToken(user);
  //   const result = await server.get("/hotels").set("Authorization", token);
  //   const enrollment = await createEnrollmentWithAddress(user);
  //   const ticketType = await createTicketType();
  //   ticketType.isRemote = true;
  //   await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  //   await createHotelsDB();

  //   expect(1).toBe(1);
  // });
});

