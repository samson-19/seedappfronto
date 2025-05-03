"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logoutUser } from "./logout";
import { getSupertoken } from "./AccessToken"; 

export function AuthCheck() {
  const [usertoken, setUsertoken] = useState(null);

  useEffect(() => {
    setUsertoken(getSupertoken()); 
  }, []);


  return (
    <>
      {!usertoken ? (
        <Link className="nav-link" href="/auth">LOGIN</Link>
      ) : (
        <Link href="#c" className="nav-link" style={{ cursor: "pointer" }} onClick={logoutUser}>
          LOGOUT
        </Link>
      )}
    </>
  );
}
