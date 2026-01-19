import { useState } from 'react';
import { Switch } from '@mui/material';
import { db } from './db/supabase-client.jsx';
import { useNavigate } from 'react-router-dom';
import * as gsheets from './gsheets/sheets-api-client.js';

function Login() {

    const [isLogin, setIsLogin] = useState(true);
    const [isSuccessSignup, setIsSuccessSignup] = useState(false);

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
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
            try {
                const { data, error } = await db.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (error) {
                    console.error('Error during login:', error.message);
                } else {
                    navigate('/calendar');
                }
            } catch (err) {
                console.error('Unexpected error during login:', err);
            }

        } else {
            // Handle registration logic
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
                            first_name: firstName,
                            last_name: lastName
                        }
                    }
                });
                if (error) {
                    console.error('Error during registration:', error.message);
                } else {
                    console.log('Registration successful');
                    if (data) {
                        setIsSuccessSignup(true);
                    }
                }
            } catch (err) {
                console.error('Unexpected error during registration:', err);
            }
        }
    }

    return (
    <>
        <div
            style={{
                display: 'flex',
                justifyContent: 'center', // Centers VERTICALLY (main axis) because of column direction
                alignItems: 'center',     // Centers HORIZONTALLY (cross axis) because of column direction
                height: '100vh',
                width: '100vw',           // <--- FIX: Ensures the container spans the full width of the screen
                flexDirection: 'column',
        }}>
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form 
                onSubmit={handleSubmit}
                style={{
                    display: 'flex',
                    flexDirection: 'column', // Stacks inputs vertically
                    alignItems: 'center',    // <--- THIS fixes the button alignment
                    gap: '0.5px'              // Adds nice spacing between items
                }}
            >
                {!isLogin && 
                    <>
                        <label>First Name:
                            <input type="text" name="first name" onChange={e => setFirstName(e.target.value)}/>
                        </label>
                        <br />
                        <label>Last Name:
                            <input type="text" name="last name" onChange={e => setLastName(e.target.value)}/>
                        </label>
                        <br />
                    </>
                }
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
                        <div
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                            <span>Participant</span>
                            <Switch
                            checked={isVolunteer}
                            onChange={() => setIsVolunteer(!isVolunteer)}
                            />
                            <span>Volunteer</span>
                        </div>
                        <br />
                    </>
                }
                <button type="submit">{isLogin ? 'Login' : 'Register'} </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Don't have an account? Register now!" : 'Have an account? Login instead!'}</button>
            <br />
            {!isLogin && isSuccessSignup && <div>Registration successful! Please check your email to verify your account before logging in.</div>}
        </div>
    </>
    )
}

export default Login
