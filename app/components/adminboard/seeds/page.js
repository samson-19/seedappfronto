'use client'

import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function SeedsAndBatches() {
  const [seedsWithBatches, setSeedsWithBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [seedTypeFilter, setSeedTypeFilter] = useState('all')
  const [expandedSeeds, setExpandedSeeds] = useState({})
  
  const usertoken = getSupertoken()
  
  useEffect(() => {
    fetchSeedsWithBatches()
  }, [seedTypeFilter])
  
  const fetchSeedsWithBatches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      let url = `${ApiUrl}/seeds-with-batches`
      if (seedTypeFilter !== 'all') {
        url = `${ApiUrl}/seeds/type/${seedTypeFilter}`
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${usertoken}`
        }
      })
      
      setSeedsWithBatches(response.data.seedsWithBatches)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching seeds with batches:', error)
      setError('Failed to load seeds and batches. Please try again later.')
      setIsLoading(false)
    }
  }
  
  const toggleSeedExpansion = (seedId) => {
    setExpandedSeeds(prev => ({
      ...prev,
      [seedId]: !prev[seedId]
    }))
  }
  
  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success'
      case 'pending':
        return 'bg-warning text-dark'
      case 'quarantine':
        return 'bg-danger'
      case 'expired':
        return 'bg-secondary'
      default:
        return 'bg-info'
    }
  }
  
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Seeds and Batches</h2>
      
      {/* Filter controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="seedTypeFilter">Filter by Seed Type:</label>
            <select 
              id="seedTypeFilter" 
              className="form-select" 
              value={seedTypeFilter}
              onChange={(e) => setSeedTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="vegetable">Vegetable</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
            </select>
          </div>
        </div>
        <div className="col-md-8 d-flex align-items-end justify-content-end">
          <button 
            className="btn btn-primary" 
            onClick={fetchSeedsWithBatches}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      {/* Loading indicator */}
      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : seedsWithBatches.length === 0 ? (
        <div className="alert alert-info">
          No seeds found for the selected filter.
        </div>
      ) : (
        <div className="row">
          {seedsWithBatches.map((seed) => (
            <div key={seed._id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">
                      <span className="fw-bold">{seed.seedName}</span>
                      <span className={`badge ms-2 ${getStatusBadgeClass(seed.seedStatus)}`}>
                        {seed.seedStatus}
                      </span>
                    </h5>
                    <small className="text-muted">
                      Type: <span className="badge bg-info">{seed.seedType}</span> • 
                      Manufacturer: {seed.seedManufacturer} •
                      Added: {formatDate(seed.createdAt)}
                    </small>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => toggleSeedExpansion(seed._id)}
                  >
                    {expandedSeeds[seed._id] ? 'Hide Batches' : 'Show Batches'}
                  </button>
                </div>
                
                {expandedSeeds[seed._id] && (
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3">Batches ({seed.batches?.length || 0})</h6>
                    
                    {seed.batches?.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Batch Name</th>
                              <th>Manufactured</th>
                              <th>Made At</th>
                              <th>Expires On</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {seed.batches.flatMap((batch) => 
                              batch.batchDetails.map((detail, idx) => (
                                <tr key={`${batch._id}-${idx}`}>
                                  <td>{detail.batchName}</td>
                                  <td>{formatDate(detail.batchManufactured)}</td>
                                  <td>{detail.batchMadeAt}</td>
                                  <td>
                                    {formatDate(detail.batchExpireDate)}
                                    {new Date(detail.batchExpireDate) < new Date() && 
                                      <span className="badge bg-danger ms-2">Expired</span>
                                    }
                                  </td>
                                  <td>
                                    <span className={`badge ${getStatusBadgeClass(detail.batchStatus)}`}>
                                      {detail.batchStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="card-text text-muted">No batches found for this seed.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}