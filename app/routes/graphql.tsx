import { ApolloClient, ApolloProvider, gql, InMemoryCache, useQuery } from "@apollo/client";

const initGraphQl = () => {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
  });

  client
  .query({
    query: gql`
        query GetBooks {
            books {
                title
                author
            }
        }
    `,
  })
  .then((result) => console.log(result));

  return client ;
}

export default function Graphql() {
  const client = initGraphQl();

  return (
    <ApolloProvider client={client}>
      <Books />
    </ApolloProvider>
  );
}

const GET_BOOKS = gql`
    query GetLocations {
        books {
            title
            author
        }
    }
`;

type Book = {
  title: string;
  author: string;
};

function Books() {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error : {error.message}</p>;
  }

  return data.books.map(({ title, author }: Book, index: number) => (
    <div className="mb-2" key={index}>
      <div>{title}</div>
      <div>{author}</div>
    </div>
  ));
}
