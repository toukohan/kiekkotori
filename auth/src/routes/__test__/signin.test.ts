import request from 'supertest'
import { app } from '../../app'

it('returns a 200 on successful signin when there is an signed up user with those credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'test'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'test'
    })
    .expect(200)
})


it('returns a 400 when no existing user', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@example.com',
      password: 'test'
    })
    .expect(400)
})

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test',
      password: 'test'
    })
    .expect(400)
})

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 't'
    })
    .expect(400)
})

it('returns a cookie when successful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@email.com',
      password: 'test'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@email.com',
      password: 'test'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})

it('returns a 200 when there is white space in password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@mail.com',
      password: 'test'
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@mail.com',
      password: 'test '
    })
    .expect(200)
})