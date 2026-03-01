'use client';
import React,{ memo } from 'react';
type SignupData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type SignupErrors = {
  userError: string;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}
type SignupFormProps  = {
  signup: SignupData;
  errorSignup: SignupErrors;
  handleSignupChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSignup: React.FormEventHandler<HTMLFormElement>;
  loading: boolean;
}
const SignupFrom:React.FC<SignupFormProps> = ({signup, errorSignup, handleSignupChange, handleSignup, loading}) => {
    return (
        <div>
            <form onSubmit={handleSignup} className="flex flex-col mt-4">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={signup.username}
                  onChange={handleSignupChange}
                  className="input"
                />
                <span className="error">{errorSignup.userError}</span>

                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={signup.email}
                  onChange={handleSignupChange}
                  className="input"
                />
                <span className="error">{errorSignup.emailError}</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signup.password}
                  onChange={handleSignupChange}
                  className="input"
                />
                <span className="error">{errorSignup.passwordError}</span>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={signup.confirmPassword}
                  onChange={handleSignupChange}
                  className="input"
                />
                <span className="error">
                  {errorSignup.confirmPasswordError}
                </span>

                <button className="btn" disabled={loading}>
                  {loading ? "Please wait..." : "Signup"}
                </button>
              </form>

              <style jsx>
                {`
                .input {
                  border: 1px solid #d1d5db;
                  border-radius: 6px;
                  padding: 10px;
                  margin-top: 10px;
                }
                .btn {
                  margin-top: 16px;
                  background: #2563eb;
                  color: white;
                  padding: 10px;
                  border-radius: 6px;
                }
                .error {
                  color: #dc2626;
                  font-size: 12px;
                }
              `}
              </style>
        </div>
    )
}
export default memo(SignupFrom);