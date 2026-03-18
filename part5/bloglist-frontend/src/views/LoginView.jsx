import LoginForm from '../components/LoginForm'
import { useDispatch } from 'react-redux'
import { loginUser } from '../store/userSlice'
import { showNotification } from '../store/notificationSlice'

const LoginView = () => {
  const dispatch = useDispatch()

  const handleLogin = async (credentials) => {
    try {
      await dispatch(loginUser(credentials))
    } catch (error) {
      dispatch(showNotification('wrong username or password', 'error'))
    }
  }

  return <LoginForm handleLogin={handleLogin} />
}

export default LoginView

