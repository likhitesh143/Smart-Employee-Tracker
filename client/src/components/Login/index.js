import { useState } from "react";
import Cookies from 'js-cookie'
import { useHistory, Redirect } from "react-router-dom";
import './index.css';

const Login = ({setAuthType}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onClickLogin = async (e) => {
        e.preventDefault();
        if(username === '' || password === '') {
            setError('Please enter all the details')
            return;
        }

        

        const loginData = {
            username,
            password
        }
        const url = 'https://employee-tracker-backend.onrender.com/login/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        }
        const response = await fetch(url, options)
        const data = await response.json();
        if(response.ok === true) {
            const isWithinRadius = await validateLocation();
            if(!isWithinRadius && data.admin === 0) {
                setError('Please login from the office')
                return;
            }
            Cookies.set('jwt_token', data.jwtToken, { expires: 1 })
            Cookies.set('username', data.username, { expires: 1 })
            Cookies.set('admin', data.admin, { expires: 1 })
            setError('')
            console.log(data)
            if(data.admin === 1) {
                history.replace('/dashboard/admin')
                return;
            } else if(data.admin === 0) {
                history.replace('/dashboard/user')
                return;
            }
        } else {
            setError(data.error)
        }
    }

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
    
    // Call the main function
    // validateLocation();
    

    const jwtToken = Cookies.get('jwt_token')
    if(jwtToken !== undefined) {
        return <Redirect to="/dashboard/user" />
    }


    return(
        <form className="auth-form" onSubmit={onClickLogin}>
            <h1 className="auth-heading">User/Admin Login</h1>
            <p className="auth-error">{error}</p>
            <label htmlFor="username" className="label">USERNAME</label>
            <input type="text" id="username" name="username" className="login-input" placeholder="username" value={username} onChange={onChangeUsername} />
            <label htmlFor="password" className="label">PASSWORD</label>
            <input type="password" id="password" name="password" className="login-input" placeholder="password" value={password} onChange={onChangePassword} />
            <button type="submit" className="login-button">Login</button>
            <p className="dont-have-text" onClick={() => setAuthType('signup')}>Don't have an account? <span className="span-text">SignUp</span></p>
            <p className="forgot-text" onClick={() => setAuthType('forgot-password')}>Forgot Password?</p>
        </form>
    )
}

export default Login