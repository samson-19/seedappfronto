"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getSupertoken } from "./AccessToken"; 
import { userGet } from "@/redux/actions/userAuthAction";

export function UserCheck() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userRdcr.user);
  const [usertoken, setUsertoken] = useState(null);

  useEffect(() => {
    const token = getSupertoken(); 
    setUsertoken(token);

    if (token) {
      dispatch(userGet()); 
    }
  }, [dispatch]);


  

  const AuthInfo = useMemo(() => {
    switch (user?.role) {
      case "admin":
        return <Link className="nav-link" href="/components/adminboard">ADMIN</Link>;
      case "inspector":
        return <Link className="nav-link" href="/components/inspectorboard">INSPECTOR</Link>;
      case "supplier":
        return <Link className="nav-link" href="/components/supplierboard">SUPPLIER</Link>;
      case "farmer":
        return <Link className="nav-link" href="/components/farmerboard">FARMER</Link>;

      case "dealer":
        return <Link className="nav-link" href="/components/dealerboard">DEALER</Link>;  
      default:
        return null;
    }
  }, [user]);

  return <>{usertoken && AuthInfo}</>;
}
