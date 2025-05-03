'use client'

import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Users() {
  const [farmers, setFarmers] = useState([])
  const[enums, setEnums] = useState([])
  const [currentFarmer, setCurrentFarmer] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const usertoken = getSupertoken()
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${ApiUrl}/admin_see_all_users`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        
        const getEnums = await axios.get(`${ApiUrl}/admin_user_enums`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        } )

        setFarmers(response.data.users)
        setEnums(getEnums.data.userEnums)
        setIsLoading(false)
      } catch (error) {
        console.log('There was a problem fetching suppliers')
        setIsLoading(false)
        setMessage({ text: 'Failed to load suppliers', type: 'danger' })
      }
    }
    
    fetchData()
  }, [usertoken])
  
  const openModal = (farmer) => {
    setCurrentFarmer(farmer)
    setNewRole(farmer.role)
  }
  
  const updateUserRole = async () => {
    if (!currentFarmer || !newRole) return

    
    
    try {
      setIsLoading(true)
       await axios.put(
        `${ApiUrl}/admin_manage_user_account/${currentFarmer._id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        }
      )
      
      
      const updatedFarmers = farmers.map(farmer => 
        farmer._id === currentFarmer._id ? { ...farmer, role: newRole } : farmer
      )
      
      setFarmers(updatedFarmers)
      setMessage({ text: 'User role updated successfully', type: 'success' })
      
    
      window.bootstrap?.Modal.getInstance(document.getElementById('editRoleModal'))?.hide()

      window.location.reload()
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error updating farmer role:', error)
      setMessage({ text: 'Failed to update farmer role', type: 'danger' })
      setIsLoading(false)
    }
  }
  

  

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4">Farmers or Users</h2>
        
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ text: '', type: '' })}></button>
          </div>
        )}
        
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : farmers?.length > 0 ? (
          <div className="card">
            <ul className="list-group list-group-flush">
  {farmers.map((farmer) => (
    <li key={farmer._id} className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        
        <div className="me-3">
          <img 
            src={farmer.userPhoto || "https://placehold.co/600x400"} 
            alt="Farmer avatar" 
            className="rounded-circle" 
            width="48" 
            height="48"
          />
          
        </div>
        
        <div>
          <h5 className="mb-1">{farmer.fullname}</h5>
          <p className="mb-1 text-muted">{farmer.email}</p>
          <span className="badge bg-primary rounded-pill">{farmer.role}</span>
        </div>
      </div>
      
      <button 
        className="btn btn-outline-primary btn-sm" 
        data-bs-toggle="modal" 
        data-bs-target="#editRoleModal"
        onClick={() => openModal(farmer)}
      >
        Edit Role
      </button>
    </li>
  ))}
</ul>
            
          </div>
        ) : (
          <div className="alert alert-info">No User found.</div>
        )}
      </div>
      
      {/* Modal for editing user role */}
      <div className="modal fade" id="editRoleModal" tabIndex="-1" aria-labelledby="editRoleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editRoleModalLabel">Update User Role</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {currentFarmer && (
                <div>
                  <p><strong>Name:</strong> {currentFarmer.fullname}</p>
                  <p><strong>Email:</strong> {currentFarmer.email}</p>
                  <p><strong>Current Role:</strong> {currentFarmer.role}</p>
                  
                  <div className="mb-3">
                    <label htmlFor="newRole" className="form-label">New Role</label>
                    <select 
                      className="form-select" 
                      id="newRole" 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="">Select Role</option>
                          {enums?.map((element, index) => (
    <option key={index} value={element}>
      {element}
                      </option>
                    ))}

                      
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={updateUserRole}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : 'Update Role'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}