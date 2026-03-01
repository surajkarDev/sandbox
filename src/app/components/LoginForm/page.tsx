'use client';
import React,{ memo } from 'react';
type LoginData = {
    username:string,
    password:string
}
type LoginErrors = {
    userError:string,
    passwordError:string
}

type LoginFormProps = {
    login:LoginData,
    error:LoginErrors,
    handleLoginChange: React.ChangeEventHandler<HTMLInputElement>,
    handleLogin: React.FormEventHandler<HTMLFormElement>,
    loading: boolean
}

const LoginFrom = (props:LoginFormProps) => {
    const { login, error, handleLoginChange, handleLogin, loading } = props;
    return (
        <>
            <form onSubmit={handleLogin} className="flex flex-col mt-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Email"
                  value={login.username}
                  onChange={handleLoginChange}
                  className="input"
                />
                <span className="error">{error.userError}</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={login.password}
                  onChange={handleLoginChange}
                  className="input"
                />
                <span className="error">{error.passwordError}</span>

                <button className="btn" disabled={loading}>
                  {loading ? "Please wait..." : "Login"}
                </button>
            </form>
        </>
    )
}

export default memo(LoginFrom);