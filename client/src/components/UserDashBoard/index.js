import { useEffect, useState, useCallback, memo } from "react";
import { useHistory, Redirect } from "react-router-dom";
import Cookies from 'js-cookie'
import { format } from 'date-fns';
import './index.css';
import NavBar from "../NavBar";

const UserDashBoard = () => {
    
    const [error, setError] = useState('');
    const history = useHistory();
    const jwtToken = Cookies.get('jwt_token')
    const username = Cookies.get('username')

    useEffect(() => {
        // if(Cookies.get('jwt_token') === undefined) {
        //     history.push('/auth/user')
        // }
        const createUserLogin = async () => {
            
            const today = new Date();
        
            const time12 = format(today, 'hh:mm:ss a');
            const parsedDate = format(today, 'yyyy-MMM-dd-EEEE');
            console.log(time12)
            console.log(parsedDate)

            const url = `https://employee-tracker-backend.onrender.com/history/login/`
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`
                },
                body: JSON.stringify({
                    username: username,
                    date: parsedDate,
                    loginTime: time12
                })
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if(response.ok === true) {
                console.log(data)
            }
            console.log(data)
        }
        
        createUserLogin()
    }, [jwtToken, username])


    // Checking location

    const validateLocation = async () => {

        async function getCurrentLocation() {
          try {
            return await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error)
              );
            });
          } catch (error) {
            console.error("Error getting location:", error.message);
          }
        }
      
        // Function to calculate the Haversine distance between two points.
        function haversineDistance(lat1, lon1, lat2, lon2) {
          const R = 6371; // Earth's radius in kilometers
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          return distance;
        }
      
        // Get the user's current location.
        const currentLocation = await getCurrentLocation();
      
        // Example usage:
        const targetLatitude = 17.9379327046787;
        const targetLongitude = 79.85001690664463;
        const radius = 0.2; // in kilometers
      
        // Check if the user is within the specified radius.
        const isWithinRadius = haversineDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          targetLatitude,
          targetLongitude
        ) <= radius;
      
        // If the user is not within the specified radius, raise a console log or function call.
        if (!isWithinRadius) {
          console.log('User is not within the specified radius.');
        } else {
          console.log('User is within the specified radius.');
        }
        return isWithinRadius;
      };

    const locationTracker = async ()  =>  {
        const username = Cookies.get('username')
        const today = new Date();
        const time12 = format(today, 'hh:mm:ss a');
        const parsedDate = format(today, 'yyyy-MMM-dd-EEEE');

        const url = `https://employee-tracker-backend.onrender.com/tracker/`
        const body = {
            username: username,
            date: parsedDate,
            time: time12,
            remarks: 'Application closed/Employee left office'
        }
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify(body)
        }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data.success)
    }

    setInterval(async () => {
        const isWithinRadius = await validateLocation();
        console.log(isWithinRadius)
        if(!isWithinRadius) {
            locationTracker();
        }
    }, 300000)

    // const onClickLogout = async () => {
    //     const username = Cookies.get('username')
    //     const today = new Date();
    //     const time12 = format(today, 'hh:mm:ss a');
    //     const url = `http://localhost:5000/history/logout/`
    //     const options = {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${jwtToken}`
    //         },
    //         body: JSON.stringify({username, logoutTime: time12})
    //     }
    //     const response = await fetch(url, options)
    //     const data = await response.json()
    //     if(response.ok === true && data.diff >= 6) {
    //         Cookies.remove('jwt_token')
    //         Cookies.remove('username')
    //         Cookies.remove('admin')
    //         history.replace('/auth/user')
    //     } else {
    //         console.log(data.diff)
    //         if(data.diff < 6) {
    //             setError(data.error)
    //             setTimeout(() => {
    //                 setError('')
    //             }, 5000)
    //             console.log('loggedout')
    //             return;
    //         }
    //     }
        
    // }

    const onClickLogout = useCallback(async () => {
        const username = Cookies.get('username')
        const today = new Date();
        const time12 = format(today, 'hh:mm:ss a');
        const url = `https://employee-tracker-backend.onrender.com/history/logout/`
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify({username, logoutTime: time12})
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true && data.diff >= 6) {
            Cookies.remove('jwt_token')
            Cookies.remove('username')
            Cookies.remove('admin')
            history.replace('/auth/user')
        } else {
            console.log(data.diff)
            if(data.diff < 6) {
                setError(data.error)
                // setTimeout(() => {
                //     setError('')
                // }, 5000)
                alert(data.error)
                console.log(data.error)
                return;
            }
        }
    }, [jwtToken, history]);

    const admin = Cookies.get('admin')

    if (admin === '1') {  
        return <Redirect to='/dashboard/admin' />
    }

    return(
        <div className="user-dashboard-con">
            <NavBar onClickLogout={onClickLogout} />
            <div className="user-dashboard">
                <h1 className="user-dashboard-heading">User Dashboard</h1>
                <h1 className="user-dashboard-welcome">Welcome {Cookies.get('username')}</h1>
                <p className="logout-error">{error}</p>
            </div>
        </div>
    )
}

export default memo(UserDashBoard);