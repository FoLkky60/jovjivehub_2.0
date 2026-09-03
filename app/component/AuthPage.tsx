"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

export function AuthPage({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) return;
    setIsSubmitted(true);
  }

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <Link className="brand auth-brand" href="/"><span className="brand-mark">j</span><span>jovjive<span className="brand-accent">hub</span></span></Link>
        <div className="auth-quote"><span className="auth-kicker">THE LIVING ROOM OF THE INTERNET</span><h1>There&apos;s always<br /><em>room for one more.</em></h1><p>Come as you are. Find a conversation worth staying for.</p></div>
        <span className="auth-footer-note">Real voices. Open rooms. Better together.</span>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          {isSubmitted ? (
            <div className="auth-success"><span className="success-mark">✓</span><span className="section-kicker">WELCOME TO JOVJIVEHUB</span><h2>{isRegister ? "Your account is ready" : "You are signed in"}</h2><p>This is a mock authentication flow. Your session is ready to explore.</p><Link className="modal-primary auth-submit" href="/">Enter Jovjivehub ↗</Link></div>
          ) : (
            <>
              <span className="section-kicker">{isRegister ? "JOIN THE CONVERSATION" : "WELCOME BACK"}</span>
              <h2>{isRegister ? "Create your account" : "Sign in to your space"}</h2>
              <p className="auth-description">{isRegister ? "Make a home for the conversations you care about." : "Your rooms and people are waiting."}</p>
              <form className="auth-form" onSubmit={submit}>
                {isRegister && <label className="modal-label">Display name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we call you?" required /></label>}
                <label className="modal-label">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
                <label className="modal-label">Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" minLength={8} required /></label>
                <button className="modal-primary auth-submit" type="submit">{isRegister ? "Create account ↗" : "Sign in ↗"}</button>
              </form>
              <p className="auth-switch">{isRegister ? "Already have an account?" : "New to Jovjivehub?"} <Link href={isRegister ? "/loginPage" : "/registerPage"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
