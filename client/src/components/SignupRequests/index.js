import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import NavBar from "../NavBar";
import './index.css';
import SignUpItem from "../ProtectedRoute/SignUpItem";

const SignUpRequests = (props) => {

    const [signUpList, setSignUpList] = useState([])

    useEffect(() => {
        const getSignUpList = async () => {
            const url = `https://employee-tracker-backend.onrender.com/request/register/all/`
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('jwt_token')}`
                }
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if(response.ok === true) {
                setSignUpList(data)
                console.log(data)
            }
        }
        getSignUpList()
    }, [])

    const acceptSignUp = async (username) => {
        const url = `https://employee-tracker-backend.onrender.com/request/register/accept/${username}`
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true) {
            console.log(data.success)
            const updatedSignUpList = signUpList.filter(each => each.username !== username)
            setSignUpList(updatedSignUpList)
        }
    }

    const rejectSignUp = async (username) => {
        const url = `https://employee-tracker-backend.onrender.com/request/register/reject/${username}`
        console.log(url)
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true) {
            console.log(data.success)
            const updatedSignUpList = signUpList.filter(each => each.username !== username)
            setSignUpList(updatedSignUpList)
        }
    }

    const admin = Cookies.get('admin')
    if( admin === '0') {
        return <Redirect to="/dashboard/user" />
    }

    return (
        <div className='admin-dashboard-container'>
            <NavBar />
            <div className='admin-dashboard'>
                <h1 className='admin-dashboard-heading'>Admin Dashboard</h1>
            <h1 className='admin-dashboard-list-heading'>SignUp Requests</h1>
            <ul className="admin-dashboard-list">
                <li className="admin-dashboard-item-head">
                    <p className="admin-dashboard-item-s">Full Name</p>
                    <p className="admin-dashboard-item-s">Username</p>
                    <p className="admin-dashboard-item-s">Email</p>
                    <p className="admin-dashboard-item-s">Phone No.</p>
                    <div className="admin-dashboard-item-a">Accept/Reject</div>
                </li>
                {
                    signUpList.length === 0 ? 
                    (<li className="admin-dashboard-item-not-found">No records found!</li>) 
                    : 
                    (signUpList.map(each => (
                        <SignUpItem key={each.username} item={each} acceptSignUp={acceptSignUp} rejectSignUp={rejectSignUp} />
                    )))
                }
            </ul>
            </div>
        </div>
    )
}

export default SignUpRequests;