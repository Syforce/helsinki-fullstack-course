import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UserView = () => {
  const { id } = useParams()
  const user = useSelector((state) => state.users.find((u) => u.id === id))

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs?.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserView

