import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useState } from 'react';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

const Authors = () => {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const result = useQuery(ALL_AUTHORS);
    const [editAuthor] = useMutation(EDIT_AUTHOR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
        onError: (error) => {
            console.error(error);
        },
    });

    if (result.loading) return <div>loading...</div>;
    if (result.error) return <div>error: {result.error.message}</div>;

    const authors = result.data.allAuthors;

    const submit = (event) => {
        event.preventDefault();
        editAuthor({ variables: { name, setBornTo: parseInt(born) } });
        setName('');
        setBorn('');
    };

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>born</th>
                    <th>books</th>
                </tr>
                {authors.map((a) => (
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2>Set birth year</h2>
            <form onSubmit={submit}>
                <div>
                    name
                    <select value={name} onChange={({ target }) => setName(target.value)}>
                        <option value="">Select author</option>
                        {authors.map((a) => (
                            <option key={a.name} value={a.name}>
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    born
                    <input
                        type="number"
                        value={born}
                        onChange={({ target }) => setBorn(target.value)}
                    />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    );
};

export default Authors;
