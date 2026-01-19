import { useState } from 'react';
import { Switch } from '@mui/material';
import { db } from './db/supabase-client.jsx';
import { useNavigate } from 'react-router-dom';
import * as gsheets from './gsheets/sheets-api-client.js';

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

    const feb = async () => {
        await gsheets.ensureSheetExists('2026', '1'); 
        
        alert("System initialized! (Sheet created if it was missing)");
    };
    const addEvent = async () => {
        await gsheets.addEvent({ date: "2026-02-06", eventName: "test event", location: "location", details: "details", startTime: "8am", endTime: "8pm", max: "5", quota: "7" }); 
    };
    const addV = async () => {
        await gsheets.addVolunteer('2026-02-06', 'test event', 'volunteer'); 
    };
    const addP = async () => {
        await gsheets.addParticipant('2026-02-06', 'test event', 'participant'); 
    };
    const removeP = async () => {
        await gsheets.removeParticipant('2026-02-06', 'test event', 'participant'); 
    };
    const removeE = async () => {
        await gsheets.removeEvent('2026-02-06', 'test event'); 
    };

    return (
    <>
        <div>
            <button onClick={feb}>create feb</button>
            <button onClick={addEvent}>add test event</button>
            <button onClick={addP}>add test participant</button>
            <button onClick={addV}>add test volunteer</button>
            <button onClick={removeP}>del test participant</button>
            <button onClick={removeE}>del test event</button>
            <br />
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
