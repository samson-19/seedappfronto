"use client";

import { AuthCheck } from "@/helpers/AuthCheck";
import { DashboardComp } from "@/helpers/DashboardComp";
import Link from "next/link";


export default function NavMenu() { 
  return (
    <header className="navigation">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light px-0">
          <Link href="/" style={{textDecoration: "none"}}>
          <h2 className="navbar-brand order-1 py-0">Seed Verify</h2>
          </Link>
          <div className="navbar-actions order-3 ml-0 ml-md-4">
            <button
              aria-label="navbar toggler"
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse text-center order-lg-2 order-4" id="navigation">
            <ul className="navbar-nav mx-auto mt-3 mt-lg-0">

            <li className="nav-item">
                <Link className="nav-link" href="/">Home</Link>

              </li>


              <li className="nav-item">
                <Link className="nav-link" href="/components/about">About</Link>

              </li>

              <li className="nav-item">
                <Link className="nav-link" href="/components/contatc">Contact</Link>

              </li>
              <li className="nav-item">
                <DashboardComp />
              </li>
              <li className="nav-item">
                <AuthCheck />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
