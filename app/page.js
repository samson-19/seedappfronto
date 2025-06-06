// import { ShieldCheck } from 'lucide-react';

// export default function Home() {
//   return (
//     <div
//       className="min-vh-100 d-flex align-items-center justify-content-center text-white text-center"
//       style={{
//         backgroundImage: "url('https://www.fao.org/media/images/seedslibraries/default-album/uf132sn-00142391.jpg?sfvrsn=314c77f9_12')",
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         position: 'relative',
//       }}
//     >
//       {/* Dark overlay */}
//       <div
//         className="position-absolute top-0 start-0 w-100 h-100"
//         style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1 }}
//       />

//       {/* Content */}
//       <div className="container position-relative z-2">
//         <ShieldCheck size={64} className="mb-3" />
//         <h1 className="display-4 fw-bold">Web Seed Verification</h1>
//         <p className="lead">
//           Ensure your seed data is authentic, tamper-proof, and securely validated.
//         </p>
//         <a href="/verify" className="btn btn-primary btn-lg mt-3">
//           Verify Now
//         </a>
//       </div>
//     </div>
//   );
// }

'use client'

import { useState } from 'react';
import { Search, Crop,  CheckCircle, Upload, Shield, Info } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="position-relative min-vh-100">
  
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{
          backgroundImage: 'url("https://www.fao.org/media/images/seedslibraries/default-album/uf132sn-00142391.jpg?sfvrsn=314c77f9_12")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }}
      />
      
      {/* Overlay with opacity */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
        style={{ opacity: 0.75, zIndex: -1 }}
      />
      
      {/* Content */}
      <div className="container text-center py-5 text-light">
        <header className="mb-5 pt-4">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <Crop size={40} className="text-success me-2" />
            <h1 className="display-4 fw-bold m-0">SeedVerify</h1>
          </div>
          <p className="lead text-white">Verify the authenticity and quality of your seeds with confidence</p>
        </header>
        
        <main>
        
          <section className="mb-5">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control form-control-lg py-3" 
                    placeholder="Enter seed batch number or certificate ID" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-success px-4" type="button">
                    <Search className="me-2" />
                    Verify
                  </button>
                </div>
                <div className="text-start text-light-emphasis small text-white">
                  Example: SV-2025-0429-1234 or CERT-XYZ789
                </div>
              </div>
            </div>
          </section>
          
        
          <section className="py-4">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                  <div className="card-body">
                    <CheckCircle size={48} className="text-success mb-3" />
                    <h3 className="card-title h4">Verify Authenticity</h3>
                    <p className="card-text text-white">Check if your seeds are genuine and from authorized suppliers with our blockchain-based verification system.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                  <div className="card-body">
                    <Upload size={48} className="text-success mb-3" />
                    <h3 className="card-title h4">Upload Certificate</h3>
                    <p className="card-text text-white">Register your seed certificates in our system for easy verification by customers and partners.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                  <div className="card-body">
                    <Shield size={48} className="text-success mb-3" />
                    <h3 className="card-title h4">Quality Assurance</h3>
                    <p className="card-text text-white">Access detailed information about seed quality, germination rates, and testing certificates.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="mt-5 pt-3">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="p-4 bg-success bg-opacity-25 rounded-3">
                  <h2 className="h3 mb-3">Are you a seed provider?</h2>
                  <p className='text-white'>Join our network to get your seeds certified and increase trust with your customers.</p>
                  <button className="btn btn-success btn-lg px-4 me-2" onClick={() => window.location.href = "/auth/register"}>Register Now</button>
                  <button className="btn btn-outline-light px-4">Learn More</button>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <footer className="mt-5 pt-5 text-light-emphasis">
          <div className="d-flex justify-content-center align-items-center small mb-3">
            <a href="#" className="text-decoration-none text-light me-3">About</a>
            <a href="#" className="text-decoration-none text-light me-3">How It Works</a>
            <a href="#" className="text-decoration-none text-light me-3">For Suppliers</a>
            <a href="#" className="text-decoration-none text-light me-3">Contact</a>
          </div>
          <p className="small mb-0 text-white">&copy; 2025 SeedVerify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}