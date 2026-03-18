const Footer = () => {
    const style = {
        marginTop: 20,
        padding: 10,
        borderTop: '1px solid #ccc',
        fontSize: '0.9em',
        color: '#666'
    }

    return (
        <div style={style}>
            <p>
                Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
                See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>source code</a> on GitHub.
            </p>
        </div>
    )
}

export default Footer
