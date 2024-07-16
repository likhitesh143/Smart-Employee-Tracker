const RemarkItem = (props) => {
    const {item} = props
    const {username, date, time, remarks} = item
    return (
        <li className="admin-dashboard-item-body">
            <p className="admin-dashboard-item">{username}</p>
            <p className="admin-dashboard-item">{date}</p>
            <p className="admin-dashboard-item">{time}</p>
            <p className="admin-dashboard-item">{remarks}</p>
        </li>
    )
}

export default RemarkItem