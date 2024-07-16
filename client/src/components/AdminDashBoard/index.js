import { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import Cookies from 'js-cookie'
import NavBar from "../NavBar";
import './index.css';
import HistoryItem from "../HistoryItem";
import RemarkItem from "../RemarkItem";

const AdminDashBoard = () => {
    const [error, setError] = useState('');
    const [historyList, setHistoryList] = useState([])
    const [trackerList, setTrackerList] = useState([])
    const [username, setUsername] = useState('');
    const history = useHistory();
    const [toggleHistoryTracker, setToggleHistoryTracker] = useState(false);
    const jwtToken = Cookies.get('jwt_token')

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onClickLogout = async () => {
        Cookies.remove('jwt_token')
        Cookies.remove('username')
        history.push('/auth/user')
    }

    useEffect(() => {

        const getHistoryList = async () => {
            const url = `https://employee-tracker-backend.onrender.com/history/all/`
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                }
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if(response.ok === true) {
                setHistoryList(data)
                console.log(data)
            }
        }
        getHistoryList()
    }, [jwtToken, history])

    const getTrackerDetails = async (e) => {
        e.preventDefault()
        if(username === "") {
            return
        }
        setToggleHistoryTracker(true)
        const url = `https://employee-tracker-backend.onrender.com/tracker/${username}/`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
        if(response.ok === true) {
            setTrackerList(data)
            console.log(data)
        }
    }

    const admin = Cookies.get('admin')
    if( admin === '0') {
        return <Redirect to="/dashboard/user" />
    }


    return (
        <div className='admin-dashboard-container'>
            <NavBar onClickLogout={onClickLogout} />
            <div className='admin-dashboard'>
                <h1 className='admin-dashboard-heading'>Admin Dashboard</h1>
                <form className='admin-dashboard-form' onSubmit={getTrackerDetails}>
                    <input type='text' className='admin-dashboard-input' onChange={onChangeUsername} value={username} placeholder='Enter username to track' />
                    <button type='submit' className='admin-dashboard-button'>Search</button>
                    <button type='button' className='admin-dashboard-button' onClick={() => setToggleHistoryTracker(false)}>Reset</button>
                    <Link to='/dashboard/admin/signup-requests'>
                        <button type='button' className='admin-dashboard-button'>Signup Requests</button>
                    </Link>
                </form>

                {
                    toggleHistoryTracker === false ? 
                    (<>
                        <h1 className='admin-dashboard-list-heading'>Login History</h1>
                        <ul className="admin-dashboard-list">
                            <li className="admin-dashboard-item-head">
                                <p className="admin-dashboard-item-p">Username</p>
                                <p className="admin-dashboard-item-p">Date</p>
                                <p className="admin-dashboard-item-p">Login Time</p>
                                <p className="admin-dashboard-item-p">Logout Time</p>
                            </li>
                            {
                                historyList.length === 0 ? 
                                (<li className="admin-dashboard-item-not-found">No records found!</li>) 
                                : 
                                (historyList.map(each => (
                                    <HistoryItem key={each.id} item={each} />
                                )))
                            }
                        </ul>
                    </>) 
                        : 
                    (<>
                        <h1 className='admin-dashboard-list-heading'>Tracker History</h1>
                        <ul className="admin-dashboard-list">
                            <li className="admin-dashboard-item-head">
                                <p className="admin-dashboard-item-p">Username</p>
                                <p className="admin-dashboard-item-p">Date</p>
                                <p className="admin-dashboard-item-p">Time</p>
                                <p className="admin-dashboard-item-p">Remarks</p>
                            </li>
                            {
                                trackerList.length === 0 ? 
                                (<li className="admin-dashboard-item-not-found">No records found!</li>) 
                                : 
                                (trackerList.map(each => (
                                    <RemarkItem key={each.id} item={each} />
                                )))
                            }

                            
                        </ul>
                    </>)
                }
            </div>
        </div>
    );
}

export default AdminDashBoard;