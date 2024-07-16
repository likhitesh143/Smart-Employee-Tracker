import {Redirect} from 'react-router-dom';
import NavBar from '../NavBar';
import Cookies from 'js-cookie';
import './index.css';

const Home = () => {
    const jwtToken = Cookies.get('jwt_token')
    const admin = Cookies.get('admin')
    if (jwtToken !== undefined) {
        if (admin === 1) {
            return <Redirect to='/dashboard/admin' />
        } else {
            return <Redirect to='/dashboard/user' />
        }
    }
    return (
        <div className='home-container'>
            <NavBar />
            <div className='home-container-body'>
                <h1>Home</h1>
                <p>lorem ipsum</p>
            </div>
        </div>
    );
}

export default Home;