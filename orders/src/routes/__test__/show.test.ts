import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Product } from "../../models/product";

it("returns an error if the productId is not valid", async () => {
  await request(app)
    .get("/api/orders/123")
    .set("Cookie", global.signin())
    .expect(400);
});


it("returns an error if the product does not exist", async () => {
  const productId = new mongoose.Types.ObjectId();

  await request(app)
    .get(`/api/orders/${productId}`)
    .set("Cookie", global.signin())
    .expect(404);
});

it("returns an error if the product is already reserved", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  const order = Order.build({
    product,
    userId: "asdf",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(400);
});

it("returns an error if the order does not belong to the user", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .expect(401);
});

it("returns the order if the order belongs to the user", async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await product.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});