import { Product } from '../product';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a product

  const product = Product.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the product to the database
  const savedProduct = await product.save();

  // Fetch the product twice

  const firstInstance = await Product.findById(savedProduct.id);
  const secondInstance = await Product.findById(savedProduct.id);

  // Make two separate changes to the products we fetched

  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first fetched product

  await firstInstance!.save();

  // Save the second fetched product and expect an error

  expect(async () => {
    await secondInstance!.save();
  }).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  const product = Product.build({
    title: 'pants',
    price: 20,
    userId: '123',
  });

  await product.save();

  expect(product.version).toEqual(0);

  await product.save();

  expect(product.version).toEqual(1);

  await product.save();

  expect(product.version).toEqual(2);

});