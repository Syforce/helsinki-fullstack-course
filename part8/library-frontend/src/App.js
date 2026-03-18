import { useState } from 'react';
import { useApolloClient, useSubscription, gql } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommend from "./components/Recommend";

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const App = () => {
    const [page, setPage] = useState('authors');
    const [token, setToken] = useState(localStorage.getItem('library-user-token'));
    const client = useApolloClient();

    const logout = () => {
        setToken(null);
        localStorage.clear();
        client.resetStore();
        setPage('authors');
    };

    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            const addedBook = data.data.bookAdded;
            window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`);

            // Update cache for allBooks query (without variables)
            client.cache.updateQuery({ query: ALL_BOOKS }, (data) => {
                if (!data) return null;
                return {
                    allBooks: [...data.allBooks, addedBook]
                };
            });
        }
    });

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                {token && <button onClick={() => setPage('add')}>add book</button>}
                {token && <button onClick={() => setPage('recommend')}>recommend</button>}
                {!token ? (
                    <button onClick={() => setPage('login')}>login</button>
                ) : (
                    <button onClick={logout}>logout</button>
                )}
            </div>

            {page === 'authors' && <Authors />}
            {page === 'books' && <Books />}
            {page === 'add' && token && <NewBook />}
            {page === 'login' && <LoginForm setToken={setToken} setPage={setPage} />}
            {page === 'recommend' && token && <Recommend />}
        </div>
    );
};

export default App;
