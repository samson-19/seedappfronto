'use client'

import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Inspector() {
  const [inspectors, setInspectors] = useState([])
  const[enums, setEnums] = useState([])
  const [currentInspector, setCurrentInspector] = useState(null)
  const [newRole, setNewRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  
  const usertoken = getSupertoken()
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${ApiUrl}/admin_users_by_role?role=inspector`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        
        const getEnums = await axios.get(`${ApiUrl}/admin_user_enums`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        } )

        setInspectors(response.data.byRole)
        setEnums(getEnums.data.userEnums)
        setIsLoading(false)
      } catch (error) {
        console.log('There was a problem fetching inspectors')
        setIsLoading(false)
        setMessage({ text: 'Failed to load inspectors', type: 'danger' })
      }
    }
    
    fetchData()
  }, [usertoken])
  
  const openModal = (inspector) => {
    setCurrentInspector(inspector)
    setNewRole(inspector.role)
  }
  
  const updateUserRole = async () => {
    if (!currentInspector || !newRole) return

    
    
    try {
      setIsLoading(true)
       await axios.put(
        `${ApiUrl}/admin_manage_user_account/${currentInspector._id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        }
      )
      
      
      const updatedInspectors = inspectors.map(inspector => 
        inspector._id === currentInspector._id ? { ...inspector, role: newRole } : inspector
      )
      
      setInspectors(updatedInspectors)
      setMessage({ text: 'User role updated successfully', type: 'success' })
      
    
      window.bootstrap?.Modal.getInstance(document.getElementById('editRoleModal'))?.hide()

      window.location.reload()
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error updating user role:', error)
      setMessage({ text: 'Failed to update user role', type: 'danger' })
      setIsLoading(false)
    }
  }
  

  

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-4">Inspectors</h2>
        
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
        ) : inspectors.length > 0 ? (
          <div className="card">
            <ul className="list-group list-group-flush">
              {inspectors.map((inspector) => (
                <li key={inspector._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{inspector.fullname}</h5>
                    <p className="mb-1 text-muted">{inspector.email}</p>
                    <span className="badge bg-primary rounded-pill">{inspector.role}</span>
                  </div>
                  <div>
                  <span className="badge bg-primary rounded-pill" style={{cursor: "pointer"}}
                    title="Click to update inspector type"
                  ><InspectorType inspectorId={inspector._id} /></span>

                  </div>
                  <button 
                    className="btn btn-outline-primary btn-sm" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editRoleModal"
                    onClick={() => openModal(inspector)}
                  >
                    Edit Role
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="alert alert-info">No inspectors found.</div>
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
              {currentInspector && (
                <div>
                  <p><strong>Name:</strong> {currentInspector.fullname}</p>
                  <p><strong>Email:</strong> {currentInspector.email}</p>
                  <p><strong>Current Role:</strong> {currentInspector.role}</p>
                  
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


const InspectorType = ({ inspectorId }) => {
  const [inspector, setInspector] = useState({})
  const[enums, setEnums] = useState([])
  const [newType, setNewType] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const usertoken = getSupertoken()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${ApiUrl}/admin_get_inspector/${inspectorId}`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })

        const getEnums = await axios.get(`${ApiUrl}/admin_inspector_type_enums`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })

        

        setInspector(response.data.inspector)
        setEnums(getEnums.data.inspectorEnums)
        setNewType(response.data.inspector.inspectorType || '')
      } catch (error) {
        console.log('There was a problem')
      }
    }

    fetchData()
  }, [inspectorId, usertoken])

console.log(newType)
  const handleUpdateType = async () => {
    try {
      setIsLoading(true)

      await axios.put(`${ApiUrl}/admin_update_inspector_type/${inspector._id}`, {
        inspectorType: newType
      }, {
        headers: {
          Authorization: `Bearer ${usertoken}`
        }
      })

      setInspector(prev => ({ ...prev, inspectorType: newType }))
      setMessage('Inspector type updated')
      setIsLoading(false)

      // Close the modal
      window.bootstrap?.Modal.getInstance(document.getElementById(`inspectorTypeModal-${inspectorId}`))?.hide()

      window.location.reload()
    } catch (error) {
      console.log('Failed to update inspector type')
      setMessage('Failed to update inspector type')
      setIsLoading(false)
    }
  }

  return (
    <>
      <span
        className="badge bg-primary rounded-pill"
        style={{ cursor: "pointer" }}
        title="Click to update inspector type"
        data-bs-toggle="modal"
        data-bs-target={`#inspectorTypeModal-${inspectorId}`}
      >
        {inspector?.inspectorType || 'N/A'}
      </span>

      <div
        className="modal fade"
        id={`inspectorTypeModal-${inspectorId}`}
        tabIndex="-1"
        aria-labelledby={`inspectorTypeModalLabel-${inspectorId}`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`inspectorTypeModalLabel-${inspectorId}`}>
                Update Inspector Type
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {message && (
                <div className="alert alert-info">{message}</div>
              )}
              <div className="mb-3">
                <label htmlFor={`newType-${inspectorId}`} className="form-label">Inspector Type</label>
                <select 
                      className="form-select"
                id="newType"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >

<option value="">Select Type </option>
                          {enums?.map((element, index) => (
    <option key={index} value={element}>
      {element}
                      </option>
                    ))}


                  </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateType}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Updating...
                  </>
                ) : 'Update Type'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
