import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createUser } from '../factories';
import app, { init } from '@/app';
import { getTicket, getTicketTypes } from '@/services/tickets-service';

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

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

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
    const token = await generateValidToken(user);
    const en = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType({ includesHotel: true, isRemote: false });
    await createTicket(en.id, ticketType.id, 'PAID');
    await getTicket(user.id);
    await getTicketTypes();
    await createHotel();
    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toHaveLength(1);
  });
});

describe('GET /hotels/:id', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/2').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/5').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if there is no enrollment for given user', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const response = await server.get('/hotels/2').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if there is no ticket for the users enrollment', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);

    const response = await server.get('/hotels/a').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 402 when the ticket has not been paid', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType();
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels/x').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticket does not include accomodation', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType({ includesHotel: false, isRemote: false });
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 402 when the ticket is for a remote event', async () => {
    const user = await createUser();
    await createEnrollmentWithAddress(user);
    const token = await generateValidToken(user);
    const ticketType = await createTicketType({ includesHotel: false, isRemote: true });
    await server.post('/tickets').send({ ticketTypeId: ticketType.id }).set('Authorization', `Bearer ${token}`);
    await createHotel();
    const response = await server.get('/hotels/3').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('should respond with status 404 when id does not exist', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const en = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType({ includesHotel: true, isRemote: false });
    await createTicket(en.id, ticketType.id, 'PAID');
    await getTicket(user.id);
    await getTicketTypes();
    const hotel = await createHotel();
    const response = await server.get(`/hotels/${hotel.id + 1}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 200 and hotels data', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const en = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketType({ includesHotel: true, isRemote: false });
    await createTicket(en.id, ticketType.id, 'PAID');
    await getTicket(user.id);
    await getTicketTypes();
    const hotel = await createHotel();
    const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toMatchObject({ name: hotel.name, image: hotel.image });
  });
});
