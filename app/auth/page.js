import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="text-center p-5 rounded shadow-sm" style={{ maxWidth: '500px', backgroundColor: '#f8f9fa' }}>
        <h2 className="mb-4 fw-bold">Welcome to Seed App</h2>
        
        <p className="text-muted mb-4">
          To start using Seed App and access all features, please login or create a new account.
        </p>
        
        <div className="d-flex justify-content-center gap-4 mt-4">
          <a 
            href="/auth/login" 
            className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
          >
            <LogIn size={18} />
            <span>Login</span>
          </a>
          
          <a 
            href="/auth/register" 
            className="btn btn-outline-primary px-4 py-2 d-flex align-items-center gap-2"
          >
            <UserPlus size={18} />
            <span>Register</span>
          </a>
        </div>
        
        <p className="mt-4 small text-muted">
          Start your journey to sustainable farming today
        </p>
      </div>
    </div>
  );
}