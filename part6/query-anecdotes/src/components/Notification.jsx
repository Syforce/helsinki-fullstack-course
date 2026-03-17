import { useNotification } from '../NotificationContext'

const Notification = () => {
    const { notification } = useNotification()

    if (!notification.message) return null

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 10,
        color: notification.type === 'error' ? 'red' : 'green',
        background: 'lightgrey'
    }

    return <div style={style}>{notification.message}</div>
}

export default Notification
