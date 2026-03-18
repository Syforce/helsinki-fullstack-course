import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { initializeUsers } from '../store/usersSlice'

const UsersView = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  return (
    <div>
      <h2>users</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs?.length ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView

