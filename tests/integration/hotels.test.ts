import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { Ticket } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createHotel,
  createTicketType,
  createUser,
  generateCreditCardData,
} from '../factories';
import app, { init } from '@/app';

const server = supertest(app);

beforeAll(async () => {
  await init();
  await cleanDb();
});
beforeEach(async () => {
  await cleanDb();
});

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/enrollments').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if there is no enrollment for given user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if there is no ticket for the users enrollment', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when the ticket has not been paid', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticket does not include accomodation', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType({ includesHotel: false, isRemote: false });
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticket is for a remote event', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType({ includesHotel: false, isRemote: true });
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 200 and hotels data', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType({ includesHotel: true, isRemote: false });
    const ticket = (
      await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`)
    ).body as Ticket;
    const card = generateCreditCardData();
    const pay = await server
      .post('/payments/process')
      .send({ ticketId: ticket.id, cardData: card })
      .set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(1);
  });
});
