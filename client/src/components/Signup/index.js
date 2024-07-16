import { useState } from "react";
import './index.css';

const Signup = ({setAuthType}) => {

    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [securityQues, setSecurityQues] = useState('')
    const [securityAns, setSecurityAns] = useState('')
    const [error, setError] = useState('');

    const onChangeFullname = (e) => {
        setFullname(e.target.value)
    }

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }

    const onChangeMobile = (e) => {
        setMobile(e.target.value)
    }

    const onChangeSecurityQues = (e) => {
        setSecurityQues(e.target.value)
        console.log(e.target.value)
    }

    const onChangeSecurityAns = (e) => {
        setSecurityAns(e.target.value)
    }

    const onClickSignUp = async (e) => {
        e.preventDefault()
        if(!username || !password || !email || !mobile || !securityQues || !securityAns || !fullname) {
            setError('Please fill all the details')
            return;
        }
        try {
            const body = {name: fullname,username, password, email, mobile, securityQues, securityAns, admin: 0, photo: 'user.png'}
            const url = 'https://employee-tracker-backend.onrender.com/register/'
            const options = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            }
            const response = await fetch(url, options)
            const data = await response.json()
            if(response.ok === true) {
                setAuthType('login')
                setError(data.success)
                setFullname('')
                setUsername('')
                setPassword('')
                setEmail('')
                setMobile('')
                setSecurityQues('')
                setSecurityAns('')
            } else {
                setError(data.error)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    return(
        <form className="auth-form" onSubmit={onClickSignUp}>
            <h1 className="auth-heading">User SignUp</h1>
            <p className="auth-error">{error}</p>
            <label htmlFor="fullname" className="label">FULLNAME</label>
            <input type="text" id="fullname" name="username" className="login-input" placeholder="fullname" value={fullname} onChange={onChangeFullname} />
            
            <label htmlFor="username" className="label">USERNAME</label>
            <input type="text" id="username" name="username" className="login-input" placeholder="username" value={username} onChange={onChangeUsername} />
            
            <label htmlFor="email" className="label">EMAIL</label>
            <input type="email" id="email" name="email" className="login-input" placeholder="email" value={email} onChange={onChangeEmail} />
            
            <label htmlFor="mobile" className="label">MOBILE</label>
            <input type="tel" id="mobile" name="mobile" className="login-input" placeholder="mobile" value={mobile} onChange={onChangeMobile} />
            
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
            
            <label htmlFor="password" className="label">PASSWORD</label>
            <input type="password" id="password" name="password" className="login-input" placeholder="password" value={password} onChange={onChangePassword} />
            <button type="submit" className="login-button">Signup</button>
            <p className="dont-have-text" onClick={() => setAuthType('login')}>Already have an account? <span className="span-text">Login</span></p>
        </form>
    )
}

export default Signup