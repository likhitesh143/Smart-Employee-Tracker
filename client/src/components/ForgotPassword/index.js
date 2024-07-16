import { useState } from "react";
import './index.css';

const ForgotPassword = ({setAuthType}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [securityQues, setSecurityQues] = useState('');
    const [securityAns, setSecurityAns] = useState('');
    const [error, setError] = useState('');

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeSecurityQues = (e) => {
        setSecurityQues(e.target.value)
    }

    const onChangeSecurityAns = (e) => {
        setSecurityAns(e.target.value)
    }

    const onClickForgotPassword = async (e) => {
        e.preventDefault()
        if(!username || !password || !securityQues || !securityAns) {
            setError('Please fill all the details')
            return;
        }
        try {
            const body = {username, securityQues, securityAns, newPassword: password}
            const url = 'https://employee-tracker-backend.onrender.com/forgot/'
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if(response.ok === true) {
                setError(data.success)
                setTimeout(() => {
                    setAuthType('login')
                }, 3000)
                setUsername('')
                setPassword('')
                setSecurityQues('')
                setSecurityAns('')
            } else {
                setError(data.error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <form className="auth-form" onSubmit={onClickForgotPassword}>
            <h1 className="auth-heading">Forgot Password?</h1>
            <p className="auth-error">{error}</p>
            <label htmlFor="username" className="label">USERNAME</label>
            <input type="text" id="username" name="username" className="login-input" placeholder="username" value={username} onChange={onChangeUsername} />
            <label htmlFor="securityQues" className="label">SECURITY QUESTION</label>
            <select id="securityQues" name="securityQues" className="login-input" placeholder="securityQues" value={securityQues} onChange={onChangeSecurityQues}>
            <option className="option" value="">Select a security question</option>
                <option className="option" value="What is the name of your first pet?">What is the name of your first pet?</option>
                <option className="option" value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option className="option" value="What is your favourite color?">What is your favourite color?</option>
                <option className="option" value="In which city were you born?">In which city were you born?</option>
                <option className="option" value="What was your childhood nickname?">What was your childhood nickname?</option>
                <option className="option" value="What is the name of your first school?">What is the name of your first school?</option>
            </select>
            <label htmlFor="securityAns" className="label">SECURITY ANSWER</label>
            <input type="text" id="securityAns" name="securityAns" className="login-input" placeholder="securityAns" value={securityAns} onChange={onChangeSecurityAns} />
            <label htmlFor="password" className="label">NEW PASSWORD</label>
            <input type="password" id="password" name="password" className="login-input" placeholder="password" value={password} onChange={onChangePassword} />
            <button type="submit" className="login-button">Change Password</button>
            <p className="dont-have-text" onClick={() => setAuthType('login')}>Know password? <span className="span-text">Login</span></p>
        </form>
    )
}

export default ForgotPassword