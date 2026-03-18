import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
    }
  }
`;

const Books = () => {
    const result = useQuery(ALL_BOOKS);

    if (result.loading) return <div>loading...</div>;
    if (result.error) return <div>error: {result.error.message}</div>;

    const books = result.data.allBooks;

    return (
        <div>
            <h2>books</h2>
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
                        <td>{b.author}</td>
                        <td>{b.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Books;
