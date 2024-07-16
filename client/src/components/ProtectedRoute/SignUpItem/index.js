import './index.css'

const SignUpItem = (props) => {
    const {item, acceptSignUp, rejectSignUp} = props
    const {name, username, email, mobile} = item
    return (
        <li className="admin-dashboard-item-body">
            <p className="admin-dashboard-item">{name}</p>
            <p className="admin-dashboard-item">{username}</p>
            <p className="admin-dashboard-item">{email}</p>
            <p className="admin-dashboard-item">{mobile}</p>
            <button type='button' className='admin-dashboard-button-sign' onClick={() => acceptSignUp(username)}>Accept</button>
            <button type='button' className='admin-dashboard-button-sign' onClick={() => rejectSignUp(username)}>Reject</button>
        </li>
    )
}

export default SignUpItem