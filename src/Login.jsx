import { useState } from 'react';
import { Switch } from '@mui/material';
import { db } from './db/supabase-client.jsx';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [isLogin, setIsLogin] = useState(true);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isVolunteer, setIsVolunteer] = useState(false);
    const checkPassword = (pass, retype) => {
        setPasswordsMatch(pass === retype);
    }
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            // Handle login logic
            console.log('Logging in with', { email, password });
            try {
                const { data, error } = await db.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (error) {
                    console.error('Error during login:', error.message);
                } else {
                    console.log('Login successful:', data);
                    navigate('/calendar');
                }
            } catch (err) {
                console.error('Unexpected error during login:', err);
            }

        } else {
            // Handle registration logic
            console.log('Registering with', { email, password });
            try {
                if (!passwordsMatch) {
                    console.error('Passwords do not match');
                    return;
                }
                const { data, error } = await db.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            role: isVolunteer ? 'V' : 'P',
                        }
                    }
                });
                if (error) {
                    console.error('Error during registration:', error.message);
                } else {
                    console.log('Registration successful:', data);
                }
            } catch (err) {
                console.error('Unexpected error during registration:', err);
            }
        }
    }

    return (
    <>
        <div>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleSubmit}>
                <label>Email:
                    <input type="email" name="email" onChange={e => setEmail(e.target.value)} />
                </label>
                <br />
                <label>Password:
                    <input type="password" name="password" onChange={pass => setPassword(pass.target.value)} />
                </label>
                <br />
                {!isLogin && 
                    <>
                        <label>Confirm Password:
                            <input type="password" name="retype password" onChange={pass => checkPassword(password, pass.target.value)} />
                        </label>
                        <br />
                       <Switch
                            checked={isVolunteer}
                            onChange={() => setIsVolunteer(!isVolunteer)}
                        />
                        <span>{isVolunteer ? 'Volunteer' : 'Participant'}</span>
                        <br />
                    </>
                }
                <button type="submit">{isLogin ? 'Login' : 'Register'} </button>
            </form>
            <Switch
                checked={!isLogin}
                onChange={() => setIsLogin(!isLogin)}
            />
            <span>{isLogin ? 'Switch to Register' : 'Switch to Login'}</span>
        </div>
    </>
    )
}

export default Login
