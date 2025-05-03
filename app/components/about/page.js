'use client'

import { Users, Shield, Sprout, BarChart, Award, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <div className="position-relative min-vh-100">
      {/* Background Image with Overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{
          backgroundImage: 'url("/api/placeholder/1920/1080")',
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
      <div className="container text-light py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <header className="text-center mb-5">
              <h1 className="display-4 fw-bold">About SeedVerify</h1>
              <p className="lead">Empowering Malawian farmers with verified seed authenticity</p>
            </header>
            
            <section className="mb-5">
              <div className="bg-dark bg-opacity-75 p-4 rounded-3">
                <h2 className="h3 mb-4">Our Mission</h2>
                <div className="d-flex align-items-start mb-4">
                  <Shield size={28} className="text-success mt-1 me-3 flex-shrink-0" />
                  <p className='text-white'>
                    At SeedVerify, we are committed to transforming Malawi agricultural sector by ensuring farmers 
                    have access to genuine, high-quality seeds. Based in Blantyre, we combine local agricultural expertise 
                    with innovative blockchain technology to create a transparent and reliable seed verification system 
                    that protects farmers from counterfeit products and strengthens food security across the nation.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-5">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="bg-dark bg-opacity-75 p-4 rounded-3 h-100">
                    <h2 className="h4 mb-3">Our Story</h2>
                    <p className='text-white'>
                      Founded in 2023 by a team of agricultural specialists and technology innovators from Malawi leading 
                      institutions, SeedVerify emerged in response to the growing challenge of counterfeit seeds in the market. 
                      What began as a local initiative in Blantyre has expanded to serve farmers across Malawi agricultural regions.
                    </p>
                    <p className='text-white'>
                      Through partnerships with the Ministry of Agriculture, local farming cooperatives, and international 
                      organizations, we have developed a comprehensive system that verifies seed authenticity from production 
                      to planting.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-dark bg-opacity-75 p-4 rounded-3 h-100">
                    <h2 className="h4 mb-3">Why SeedVerify Matters</h2>
                    <p className='text-white'>
                      In Malawi, where agriculture supports over 80% of the population, seed quality directly impacts 
                      food security and economic stability. Counterfeit or low-quality seeds can lead to crop failures, 
                      financial losses, and increased vulnerability to climate challenges.
                    </p>
                    <p className='text-white'>
                      Our verification system empowers farmers to make informed decisions, protects their investments, 
                      and contributes to sustainable agricultural practices across the country.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-5">
              <h2 className="h3 text-center mb-4">How We Operate</h2>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                    <div className="card-body text-center">
                      <Award size={48} className="text-success mb-3" />
                      <h3 className="card-title h5">Certification</h3>
                      <p className="card-text small text-white">
                        We certify seed producers through rigorous quality testing in our Blantyre laboratory, ensuring 
                        their products meet national and international standards.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                    <div className="card-body text-center">
                      <BarChart size={48} className="text-success mb-3" />
                      <h3 className="card-title h5">Tracking</h3>
                      <p className="card-text small text-white">
                        Using blockchain technology, we create immutable records for each batch of certified seeds, 
                        tracking them from production through distribution.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card h-100 bg-dark bg-opacity-75 border-0 text-light">
                    <div className="card-body text-center">
                      <Sprout size={48} className="text-success mb-3" />
                      <h3 className="card-title h5">Verification</h3>
                      <p className="card-text small text-white">
                        Farmers can easily verify seed authenticity through our mobile-friendly platform, accessing 
                        detailed information about their purchases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-5">
              <div className="bg-dark bg-opacity-75 p-4 rounded-3">
                <h2 className="h3 mb-4">Our Impact</h2>
                <div className="row g-4 text-center">
                  <div className="col-6 col-md-3">
                    <div className="p-3">
                      <p className="display-6 fw-bold text-success mb-1">12,000+</p>
                      <p className="small text-white">Farmers Protected</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3">
                      <p className="display-6 fw-bold text-success mb-1">45</p>
                      <p className="small text-white">Certified Suppliers</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3">
                      <p className="display-6 fw-bold text-success mb-1">85%</p>
                      <p className="small text-white">Reduction in Fake Seeds</p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-3">
                      <p className="display-6 fw-bold text-success mb-1">23</p>
                      <p className="small text-white">Districts Served</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="mb-5">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="bg-dark bg-opacity-75 p-4 rounded-3 h-100">
                    <h2 className="h4 mb-3">Our Team</h2>
                    <div className="d-flex align-items-start mb-3">
                      <Users size={28} className="text-success mt-1 me-3 flex-shrink-0" />
                      <div>
                        <p className='text-white'>
                          Our diverse team brings together expertise in agronomy, seed science, blockchain technology, 
                          and rural development. Based in our Blantyre headquarters, our specialists combine scientific 
                          knowledge with deep understanding of local agricultural challenges.
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-outline-success btn-sm">Meet Our Team</button>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-dark bg-opacity-75 p-4 rounded-3 h-100">
                    <h2 className="h4 mb-3">Partners & Collaborators</h2>
                    <div className="d-flex align-items-start mb-3">
                      <Globe size={28} className="text-success mt-1 me-3 flex-shrink-0" />
                      <div>
                        <p className='text-white'>
                          SeedVerify works closely with the Ministry of Agriculture, Malawi Seed Alliance, 
                          Lilongwe University of Agriculture, and international organizations including FAO and AGRA. 
                          These partnerships strengthen our capacity to serve Malawian farmers.
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-outline-success btn-sm">Our Partners</button>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="text-center">
              <div className="bg-success bg-opacity-25 p-4 rounded-3">
                <h2 className="h3 mb-3">Join Our Mission</h2>
                <p className='text-white'>
                  Whether you are a farmer seeking verified seeds, a supplier looking to certify your products, 
                  or an organization interested in partnership, we invite you to join us in building a more 
                  secure agricultural future for Malawi.
                </p>
                <button className="btn btn-success px-4 me-2" onClick={() => window.location.href = "/components/contact"}>Contact Us</button>
                <button className="btn btn-outline-light px-4">Learn More</button>
              </div>
            </section>
          </div>
        </div>
        
        <footer className="mt-5 pt-3 text-center text-light-emphasis">
          <div className="d-flex justify-content-center align-items-center small mb-3">
            <Link href="/" className="text-decoration-none text-light me-3">Home</Link>
            <Link href="#" className="text-decoration-none text-light me-3">About</Link>
            <Link href="/components/contact" className="text-decoration-none text-light me-3">Contact</Link>
            <Link href="#" className="text-decoration-none text-light me-3">For Suppliers</Link>
          </div>
          <p className="small mb-0">&copy; 2025 SeedVerify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}