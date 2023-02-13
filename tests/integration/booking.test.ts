import app, { init } from "@/app";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createTicket, createTicketTypeRemote, createTicketTypeWithHotel, createTicketTypeWithoutHotel, createUser } from "../factories";
import { createBookings, findBookings } from "../factories/bookings-factory";
import { cleanDb, createHotels, createRooms, createRoomWithoutCapacity, findRooms, findRoomsWithoutVacancy, generateValidToken } from "../helpers";

const server = supertest(app);

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

describe("Bookings tests", () => {
  describe("GET /booking", () => {
    it("Should respond with status code 200 and booking when there is booking for user", async () => {
      const user = await createUser();
      const otherUser = await createUser();
      const token = await generateValidToken(user);
      await createBookings([user.id, otherUser.id]);
      const response = await server.get("/booking").set("authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          Room: expect.any(Object)
        })
      ]));
    });
    it("Should respond with status code 404 when not found booking for this user", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const otherUser = await createUser();
      await createBookings([otherUser.id]);
      const response = await server.get("/booking").set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });
  });
  describe("POST /booking", () => {
    it("Should respond with status code 200 when roomId exists, ticket is for face-to-face event, with accommodation and paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post("/booking").send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.OK);
    });

    it("Should respond with status code 404 when roomId no exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post("/booking").send({ roomId: rooms[0].id-1 }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });

    it("Should respond with status code 403 when ticket is online", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post("/booking").send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status code 403 when is without accommodation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithoutHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post("/booking").send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status code 403 when has not yet been paid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.post("/booking").send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });

    it("Should respond with status code 403 when there are no vacancies in the room", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRoomWithoutCapacity();
      const rooms = await findRooms();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.post("/booking").send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });
  });
  describe("PUT /booking/:bookingId", () => {
    it("Should respond with status code 200 when booking id exists, user is the owner, roomId exists and has vacancy", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      await createBookings([user.id]);
      const bookings = await findBookings();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.put(`/booking/${bookings[0].id}`).send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.OK);
    });
    it("Should respond with status code 404 when room id not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      await createBookings([user.id]);
      const bookings = await findBookings();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.put(`/booking/${bookings[0].id}`).send({ roomId: rooms[0].id-1 }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.NOT_FOUND);
    });
    it("Should respond with status code 403 when user is not the owner of the booking", async () => {
      const user = await createUser();
      const otherUser = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      await createBookings([otherUser.id]);
      const bookings = await findBookings();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.put(`/booking/${bookings[0].id}`).send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });
    it("Should respond with status code 403 when booking id not exists", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRooms();
      const rooms = await findRooms();
      await createBookings([user.id]);
      const bookings = await findBookings();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const response = await server.put(`/booking/${bookings[0].id-1}`).send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });
    it("Should respond with status code 403 when there are no vacancies in the room ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createHotels();
      await createRoomWithoutCapacity();
      const rooms = await findRoomsWithoutVacancy();
      await createBookings([user.id]);
      const bookings = await findBookings();
      const response = await server.put(`/booking/${bookings[0].id}`).send({ roomId: rooms[0].id }).set("authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.FORBIDDEN);
    });
  });
});
