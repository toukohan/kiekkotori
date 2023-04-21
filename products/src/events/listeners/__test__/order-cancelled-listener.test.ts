import { OrderCancelledEvent, OrderStatus } from "@hellofancypants/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create a product
  const product = Product.build({
    title: "pants",
    price: 20,
    userId: "asdf",
  });

  // Add an orderId to the product and save it

  const orderId = new mongoose.Types.ObjectId().toHexString();
  product.set({ orderId });
  await product.save();

  // Create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    product: {
      id: product.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('updates the product, publishes an event, and acks the message', async () => {
  const { listener, data, msg } = await setup();
  const product = await Product.findById(data.product.id);

  expect(product!.orderId).toEqual(data.id);

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(data.product.id);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(updatedProduct!.orderId).toBeUndefined();
  expect(msg.ack).toHaveBeenCalled();
});