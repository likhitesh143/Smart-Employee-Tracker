import './index.css'

const HistoryItem = (props) => {
    const {item} = props
    const {username, date, login_time, logout_time} = item
    return (
        <li className="admin-dashboard-item-body">
            <p className="admin-dashboard-item">{username}</p>
            <p className="admin-dashboard-item">{date}</p>
            <p className="admin-dashboard-item">{login_time}</p>
            <p className="admin-dashboard-item">{logout_time}</p>
        </li>
    )
}

export default HistoryItem