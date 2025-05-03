'use client'

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission to your backend
    console.log('Form submitted:', formData);
    // Show success message
    setIsSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };
  
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
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold">Contact SeedVerify</h1>
          <p className="lead">We are here to answer your questions and support your agricultural success</p>
        </header>
        
        <div className="row g-4">
          {/* Contact Information */}
          <div className="col-lg-5">
            <div className="bg-dark bg-opacity-75 p-4 rounded-3 mb-4">
              <h2 className="h4 mb-4">Our Office</h2>
              
              <div className="d-flex mb-4">
                <MapPin size={24} className="text-success me-3 flex-shrink-0" />
                <div className='text-white'>
                  <h3 className="h6 mb-1">Location</h3>
                  <p className="mb-0 text-white">SeedVerify Headquarters<br />
                  121 Victoria Avenue<br />
                  Limbe, Blantyre<br />
                  Malawi</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <Phone size={24} className="text-success me-3 flex-shrink-0" />
                <div className='text-white'>
                  <h3 className="h6 mb-1">Phone</h3>
                  <p className="mb-0 text-white">+265 1 111 2222 (Main Office)<br />
                  +265 88 765 4321 (Support)</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <Mail size={24} className="text-success me-3 flex-shrink-0" />
                <div className='text-white'>
                  <h3 className="h6 mb-1">Email</h3>
                  <p className="mb-0 text-white">info@seedverify.mw<br />
                  support@seedverify.mw</p>
                </div>
              </div>
              
              <div className="d-flex">
                <Clock size={24} className="text-success me-3 flex-shrink-0" />
                <div className='text-white'>
                  <h3 className="h6 mb-1">Working Hours</h3>
                  <p className="mb-0 text-white">Monday - Friday: 8:00 AM - 5:00 PM<br />
                  Saturday: 9:00 AM - 1:00 PM<br />
                  Sunday: Closed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark bg-opacity-75 p-4 rounded-3">
              <h2 className="h4 mb-4">Regional Offices</h2>
              
              <div className="mb-4 pb-3 border-bottom border-secondary">
                <h3 className="h6 mb-1">Lilongwe Office</h3>
                <p className="small mb-2 text-white">Area 3, Plot 24, Capital City</p>
                <p className="small mb-0 text-white">Phone: +265 1 333 4444</p>
              </div>
              
              <div className="mb-4 pb-3 border-bottom border-secondary">
                <h3 className="h6 mb-1">Mzuzu Office</h3>
                <p className="small mb-2 text-white">Mzuzu Agricultural Development Division</p>
                <p className="small mb-0 text-white">Phone: +265 1 555 6666</p>
              </div>
              
              <div>
                <h3 className="h6 mb-1">Zomba Field Station</h3>
                <p className="small mb-2 text-white">Near Chancellor College</p>
                <p className="small mb-0 text-white">Phone: +265 1 777 8888</p>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="col-lg-7">
            <div className="bg-dark bg-opacity-75 p-4 rounded-3">
              <h2 className="h4 mb-4">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                  <CheckCircle size={24} className="me-2" />
                  <div className='text-white'>
                    Thank you for contacting SeedVerify! We have received your message and will respond within 24 hours.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">Your Name *</label>
                      <input 
                        type="text" 
                        className="form-control bg-dark text-light border-secondary" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control bg-dark text-light border-secondary" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        className="form-control bg-dark text-light border-secondary" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="subject" className="form-label">Subject *</label>
                      <select 
                        className="form-select bg-dark text-light border-secondary" 
                        id="subject" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="seed-verification">Seed Verification</option>
                        <option value="certification">Seed Certification</option>
                        <option value="partnership">Partnership Inquiry</option>
                        <option value="technical-support">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="col-12">
                      <label htmlFor="message" className="form-label">Your Message *</label>
                      <textarea 
                        className="form-control bg-dark text-light border-secondary" 
                        id="message" 
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="col-12">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="consent" 
                          required 
                        />
                        <label className="form-check-label small" htmlFor="consent">
                          I consent to SeedVerify collecting and storing the information I have provided for the purpose of responding to my inquiry.
                        </label>
                      </div>
                    </div>
                    
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-success px-4 py-2">
                        <Send size={18} className="me-2" />
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            <div className="bg-dark bg-opacity-75 p-4 rounded-3 mt-4">
              <h2 className="h4 mb-4">Frequently Asked Questions</h2>
              
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item bg-dark bg-opacity-75 border-secondary">
                  <h3 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                      How do I verify my seed batch?
                    </button>
                  </h3>
                  <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-light-emphasis">
                      You can verify your seed batch by entering the unique batch code found on your seed package on our homepage. The system will immediately show you the verification status and details about your seeds.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item bg-dark bg-opacity-75 border-secondary">
                  <h3 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                      How can seed producers join the certification program?
                    </button>
                  </h3>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-light-emphasis">
                      Seed producers can apply for certification by contacting our office or submitting an application through our website. Our team will guide you through the quality assessment and certification process.
                    </div>
                  </div>
                </div>
                
                <div className="accordion-item bg-dark bg-opacity-75 border-secondary">
                  <h3 className="accordion-header">
                    <button className="accordion-button collapsed bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                      Can I verify seeds without internet access?
                    </button>
                  </h3>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-light-emphasis">
                      Yes! We offer an SMS verification service for farmers without internet access. Simply send the batch code to our shortcode 1122 and receive verification details via text message.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <section className="mt-5 text-center">
          <div className="bg-success bg-opacity-25 p-4 rounded-3">
            <h2 className="h3 mb-3">Visit Our Blantyre Demonstration Farm</h2>
            <p>
              Experience firsthand the difference certified seeds make! Visit our demonstration farm located 
              10km from Blantyre city center on the Zomba road. Open to farmers every Wednesday and Saturday.
            </p>
            <button className="btn btn-success px-4">Book a Visit</button>
          </div>
        </section>
        
        <footer className="mt-5 pt-3 text-center text-light-emphasis">
          <div className="d-flex justify-content-center align-items-center small mb-3">
            <Link href="/" className="text-decoration-none text-light me-3">Home</Link>
            <Link href="/components/about" className="text-decoration-none text-light me-3">About</Link>
            <Link href="#" className="text-decoration-none text-light me-3">Contact</Link>
            <Link href="#" className="text-decoration-none text-light me-3">For Suppliers</Link>
          </div>
          <p className="small mb-0">&copy; 2025 SeedVerify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}