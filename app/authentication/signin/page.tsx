"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import axios from "axios";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const loginUrl = "http://localhost:3000/api/login"

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      email,
      password,
      rememberMe,
    });
  };


    async function handleSignin() {
        const requestBody = {
            email,
            password,
        };

        try {
            const response = await axios.post(
                loginUrl,
                requestBody
            );

            if (response.status === 200) {
                alert(response.data.message);
                router.push("../binger");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Login failed");
            } else {
                alert("Something went wrong");
            }
        }
    }


  return (
    <main className={styles.page}>
      <section className={styles.authContainer}>
        {/* Left panel */}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            <div className={styles.logo}>
              <span>F</span>
            </div>

            <h1>Build. Ship. Scale.</h1>

            <p>
              A modern workspace for teams that want to move faster,
              collaborate better, and build great products.
            </p>

            <div className={styles.testimonial}>
              <p>
                “Simple, fast, and beautifully designed. Exactly what our
                team needed.”
              </p>

              <div className={styles.user}>
                <div className={styles.avatar}>SD</div>

                <div>
                  <strong>Sahil Devli</strong>
                  <span>Product Engineer</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.brandFooter}>
            <span>© 2026 Your Company</span>
            <span>Privacy · Terms</span>
          </div>
        </div>

        {/* Right panel */}
        <div className={styles.formPanel}>
          <div className={styles.formWrapper}>
            <div className={styles.mobileLogo}>
              <div className={styles.logo}>
                <span>F</span>
              </div>
            </div>

            <div className={styles.heading}>
              <span className={styles.eyebrow}>Welcome back</span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to continue.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={styles.form}
            >
              <div className={styles.field}>
                <label htmlFor="email">Email address</label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className={styles.forgotPassword}
                    onClick={() =>
                      console.log("Forgot password")
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className={styles.passwordInput}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span>Remember me for 30 days</span>
              </label>

              <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSignin}
              >
                Sign in
                <span>→</span>
              </button>
            </form>

            <div className={styles.divider}>
              <span>or continue with</span>
            </div>

            <div className={styles.socialButtons}>
              <button type="button">
                <span className={styles.googleIcon}>G</span>
                Google
              </button>

              <button type="button">
                <span className={styles.githubIcon}>◉</span>
                GitHub
              </button>
            </div>

            <p className={styles.signup}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => console.log("Create account")}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}