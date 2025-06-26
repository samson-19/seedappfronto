'use client'

import { Edit, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userGet } from '@/redux/actions/userAuthAction'
import Link from 'next/link'

export default function UserDetails() {
  const user = useSelector((state) => state.userRdcr.user)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        await dispatch(userGet())
      } catch (error) {
        console.log("Server Error")
      }
    }
    fetchData()
  }, [dispatch])

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">User Profile</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                {user?.userPhoto ? (
                  <img 
                    src={user.userPhoto} 
                    alt={`${user.fullname}'s profile`}
                    className="rounded-circle img-fluid border border-primary p-1"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center border border-primary p-1" style={{ width: '150px', height: '150px' }}>
                    <User size={80} color="#0d6efd" />
                  </div>
                )}
                <Link href={`/components/farmerboard/mydetails/${user?._id}`} className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-1">
                  <Edit size={16} />
                </Link>
              </div>
              <h4 className="mt-3">{user?.first_name} {user?.last_name}</h4>
              <span className="badge bg-success text-capitalize">{user?.role || 'Farmer'}</span>
            </div>
            <div className="col-md-8">
              <div className="list-group">
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">Full Name</h5>
                  </div>
                  <p className="mb-1">{user?.first_name} {user?.last_name}</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">Email</h5>
                  </div>
                  <p className="mb-1">{user?.email || 'Not Available'}</p>
                </div>
                <div className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">Role</h5>
                  </div>
                  <p className="mb-1 text-capitalize">{user?.role || 'Farmer'}</p>
                </div>
              </div>
              {/* <div className="mt-4">
                <button className="btn btn-primary me-2">Edit Profile</button>
          
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}