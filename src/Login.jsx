import { useState } from 'react';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const test = (e) => {
        e.preventDefault();
        console.log(username, password);
    }


    return (
    <>
        <div>
            <h1>Login</h1>
            <form onSubmit={test}>
                <label>Username:
                    <input type="text" name="username" onChange={user => setUsername(user.target.value)} />
                </label>
                <br />
                <label>Password:
                    <input type="password" name="password" onChange={pass => setPassword(pass.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    </>
    )
}

export default Login
