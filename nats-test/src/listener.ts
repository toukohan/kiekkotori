import nats from 'node-nats-streaming';
import { ProductCreatedListener } from './events/product-created-listener';
import { randomBytes } from 'crypto';
console.clear();

const stan = nats.connect('kiekkotori', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  })

  new ProductCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



