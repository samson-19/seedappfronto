'use client'

import React, { useEffect, useState } from 'react'
import { Save, FileText, AlertCircle } from 'lucide-react'
import { getSupertoken } from '@/helpers/AccessToken'
import axios from 'axios'
import { ApiUrl } from '@/helpers/ApiUrl'
import { Spinner } from 'react-bootstrap'


export default function Report() {
  const [reportTitle, setReportTitle] = useState('')
  const [reportContent, setReportContent] = useState('')
  const[inspectors, setInspectors] = useState([])
  const[userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState('')
  const usertoken = getSupertoken()


useEffect(() => {
const fetchData = async() => {

  const response = await axios.get(`${ApiUrl}/farmer/get_inspectors`, {
    headers: {
      Authorization: `Bearer ${usertoken}`
    }
  })

  setInspectors(response.data.inspectors)


}

fetchData()

}, [usertoken])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setLoading(true);
    
    // Form validation
    if(!userId) {
      alert("please, select inspector Type")
    }

    if (!reportTitle.trim()) {
      setError('Please enter a report title')
      return
    }
    
    if (!reportContent.trim()) {
      setError('Please enter report content')
      return
    }

    const data = {
      reportTitle,
      reportContent
    }

    const response = await axios.post(`${ApiUrl}/farmer_notify_inspector/${userId}`, data, {
      headers : {
        Authorization: `Bearer ${usertoken}`

      }
    })

    alert(response.data.msg)

    window.location.href = "/components/farmerboard"
  
    }

  

  return (
    <div className="container py-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex align-items-center">
            <FileText size={20} className="text-primary me-2" />
            <h5 className="mb-0">Create New Report</h5>
          </div>
        </div>
        
        <div className="card-body">
          {showSuccess && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <Save size={16} className="me-2" />
              <div>Report successfully saved to database!</div>
            </div>
          )}
          
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <AlertCircle size={16} className="me-2" />
              <div>{error}</div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="reportTitle" className="form-label">Report Title</label>
              <input 
                type="text" 
                className="form-control" 
                id="reportTitle"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="Enter report title"
              />
            </div>

            <div className="mb-3">
          <label htmlFor="reportInspector" className="form-label">inspectors</label>
               <select 
                name="userId"
                className="form-control"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required>

      <option value="">Select Inspector Type</option>
                {inspectors.map((inspct) => (
                  <option value={inspct.userId} key={inspct._id}>
                  Inspector Type: {inspct.inspectorType}
                  </option>
                ))}


          </select>
         
        </div>


            
            <div className="mb-4">
              <label htmlFor="reportContent" className="form-label">Report Content</label>
              <textarea 
                className="form-control" 
                id="reportContent"
                rows="10"
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="Write your report content here..."
              ></textarea>
            </div>
            
            <div className="d-flex justify-content-end">
             
              <button 
                type="submit" 
                className="btn btn-primary d-flex align-items-center"
                disabled={loading}
              
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  "Send Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}