"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import SignupFrom from "./components/SignupFrom/page";
import LoginFrom from "./components/LoginForm/page";

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
interface LoginData {
  username: string;
  password: string;
}
interface LoginError {
  userError: string;
  passwordError: string;
}
interface SignupError {
  userError: string;
  emailError: string;
  confirmPasswordError: string;
  passwordError: string;
}

function Home() {
  const [login, setLogin] = useState<LoginData>({ username: "", password: "" });
  const [signup, setSignup] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<LoginError>({
    userError: "",
    passwordError: "",
  });

  const [errorSignup, setErrorSignup] = useState<SignupError>({
    userError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginSignup, setLoginSignup] = useState(false);
  const router = useRouter();

  // ---------------- CHANGE HANDLERS ----------------
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignup((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- VALIDATION ----------------
  const validate = (): boolean => {
    if (loginSignup) {
      const newErrors: SignupError = {
        userError: "",
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
      };

      if (!signup.username.trim()) newErrors.userError = "Username is required";

      if (!signup.email.trim()) {
        newErrors.emailError = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signup.email)) {
        newErrors.emailError = "Invalid email address";
      }

      if (!signup.password.trim()) {
        newErrors.passwordError = "Password is required";
      } else if (signup.password.length < 8) {
        newErrors.passwordError = "Password must be at least 8 characters";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(signup.password)
      ) {
        newErrors.passwordError =
          "Password must include uppercase, lowercase, number, special character";
      }

      if (!signup.confirmPassword.trim()) {
        newErrors.confirmPasswordError = "Confirm password is required";
      } else if (signup.password !== signup.confirmPassword) {
        newErrors.confirmPasswordError = "Passwords do not match";
      }

      setErrorSignup(newErrors);
      return !Object.values(newErrors).some((e) => e);
    } else {
      const newErrors: LoginError = { userError: "", passwordError: "" };

      if (!login.username.trim()) {
        newErrors.userError = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.username)) {
        newErrors.userError = "Invalid email";
      }

      if (!login.password.trim()) {
        newErrors.passwordError = "Password is required";
      }

      setError(newErrors);
      return !Object.values(newErrors).some((e) => e);
    }
  };

  // ---------------- SIGNUP ----------------
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // check duplicate email
      const check = await fetch(
        `http://localhost:3001/userDetail?email=${signup.email}`
      );
      const existing = await check.json();

      if (existing.length > 0) {
        setErrorSignup((prev) => ({
          ...prev,
          emailError: "Email already registered",
        }));
        setLoading(false);
        return;
      }

      // hash password
      const hashedPassword = await bcrypt.hash(signup.password, 10);

      await fetch("http://localhost:3001/userDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signup.username,
          email: signup.email,
          password: hashedPassword,
        }),
      });

      alert("Signup successful");
      setLoginSignup(false);
    } catch (err) {
      console.error("Signup error", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    console.log("Attempting login with", login);
    
    try {
      const response = await fetch(
        `http://localhost:3001/userDetail?email=${login.username}`
      );
      const users = await response.json();

      if (users.length === 0) {
        setError({ userError: "User not found", passwordError: "" });
        setLoading(false);
        return;
      }

      const user = users[0];
      console.log("login.password",login.password);
      console.log("user.password",user.password);
      
      const match = await bcrypt.compare(login.password, user.password);
      console.log("match",match);
      

      if (!match) {
        setError({ userError: "", passwordError: "Incorrect password" });
        setLoading(false);
        return;
      }

      router.push("/pages/dashboard");
    } catch (err) {
      console.error("Login error", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TOGGLE ----------------
  const toggleMode = () => {
    setLoginSignup(!loginSignup);
    setError({ userError: "", passwordError: "" });
    setErrorSignup({
      userError: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    });
  };

  // ---------------- UI ----------------
  return (
    <div className="container mx-auto px-0 py-0">
      <div className="flex flex-wrap">
        <div className="w-full lg:w-1/2">
          <Image
            src="/img/snadbox.jpg"
            alt="Sandbox"
            width={800}
            height={600}
            className="w-full h-screen object-cover"
          />
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-[400px]">
            <Image
              src="/img/logo.svg"
              alt="Logo"
              width={250}
              height={120}
              className="object-contain mx-auto"
            />

            <h2 className="text-center mt-4 font-bold">
              UAT NDC SANDBOX {loginSignup ? "SIGNUP" : "LOGIN"}
            </h2>
            
            {loginSignup ? (
              <>
              <SignupFrom  handleSignup={handleSignup} signup={signup} errorSignup={errorSignup} handleSignupChange={handleSignupChange} loading={loading}/>
              </>
            ) : (
              <>
              <LoginFrom login={login} error={error} handleLogin={handleLogin} handleLoginChange={handleLoginChange} loading={loading} />
              </>
              
            )}

            <div className="text-right mt-3">
              <button onClick={toggleMode} className="underline text-sm">
                {loginSignup ? "Back to Login" : "Go for Signup"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;