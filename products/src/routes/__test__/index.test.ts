import request from 'supertest';
import { app } from '../../app';

export const createProduct = () => {
  return request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      price: 20
    })
  }

it('returns a list of products', async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app)
    .get('/api/products')
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});