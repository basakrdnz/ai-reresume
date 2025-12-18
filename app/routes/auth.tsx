import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { usePuterStore } from "~/lib/puter";

export const meta = () => ([
    { title: "Resumind | Auth" },
    { name: "description", content: "Log into your account" }
]);

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = location.search.split("next=")[1];
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next]);

    return (
        <main className="relative bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative z-10 rounded-3xl bg-gray-50/5 backdrop-blur-xl shadow-2xl">
                <section className="flex flex-col gap-8 rounded-2xl p-16 shadow-2xl">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1>Welcome</h1>
                        <h2>Log In to Continue Your Job Journey</h2>
                    </div>

                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : auth.isAuthenticated ? (
                            <button className="auth-button" onClick={auth.signOut}>
                                <p>Log Out</p>
                            </button>
                        ) : (
                            <button className="auth-button" onClick={auth.signIn}>
                                <p>Log In</p>
                            </button>
                        )}
                    </div>

                </section>
            </div>
        </main>
    );
};

export default Auth;
