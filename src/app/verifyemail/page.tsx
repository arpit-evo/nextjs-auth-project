"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(error.response.data.error);
      console.log(error.response.data.error);
    }
  };

  useEffect(() => {
    //  const urlToken = window.location.search.split("=")[1];
    const urlToken = searchParams.get("token");
    setToken(urlToken || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-3">
      <h1 className="text-4xl mb-3">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "no token"}
      </h2>

      {verified && (
        <div className="text-center  flex flex-col gap-3">
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login" className="mx-auto w-fit border rounded-md px-3 py-2">Login</Link>
        </div>
      )}
      {error && (
        <div className="mt-5">
          <h2 className="text-2xl bg-red-500 text-black">{error}</h2>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
