import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
    }
  }
`;

const Recommend = () => {
    const meResult = useQuery(ME);
    const genre = meResult.data?.me?.favoriteGenre;
    const booksResult = useQuery(ALL_BOOKS, {
        skip: !genre,
        variables: { genre },
    });

    if (meResult.loading || booksResult.loading) return <div>loading...</div>;
    if (meResult.error) return <div>error: {meResult.error.message}</div>;

    const favoriteGenre = meResult.data.me.favoriteGenre;
    const books = booksResult.data?.allBooks || [];

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {books.map((b) => (
                    <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recommend;
