import Link from "next/link";

const LandingPage = ({ currentUser, products }) => {
  const productList = products.map((product) => {
    return (
      <tr key={product.id}>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>
          <Link href={`/products/${product.id}`}>View</Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Products</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{productList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/products");

  return { products: data };
};

export default LandingPage;
