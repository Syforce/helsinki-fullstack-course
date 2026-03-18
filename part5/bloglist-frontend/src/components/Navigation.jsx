import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../store/userSlice'

const Navigation = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  return (
    <div className="nav">
      <div className="nav-links">
        <Link to="/">blogs</Link>
        <Link to="/users">users</Link>
      </div>
      <div className="nav-user">
        <span>{user?.name} logged in</span>
        <button onClick={() => dispatch(logoutUser())}>logout</button>
      </div>
    </div>
  )
}

export default Navigation

