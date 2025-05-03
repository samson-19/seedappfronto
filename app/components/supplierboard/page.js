'use client'

import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import {Package, Activity, Calendar, FileText, User } from 'lucide-react'
import Link from 'next/link'

export default function SupplierBoard() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const usertoken = getSupertoken()

  useEffect(() => {
    const fetchData = async() => {
      setLoading(true)
      
      try {
        const response = await axios.get(`${ApiUrl}/supplier_get_info`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        
        setInfo(response.data.myInfo)
      } catch (err) {
        console.error("Error fetching supplier info:", err)
        setError("Failed to load your information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [usertoken])

  // Handle loading state
  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading your dashboard...</span>
      </Container>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Container className="mt-5">
        <div className="alert alert-danger">
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </Container>
    )
  }



  if (!info) {
   
    if (typeof window !== 'undefined') {
      window.location.href = "/components/supplierboard/uploadInfo"
    }
    return null
  }

  return (
    <Container className="py-4">
      <Row>
        <Col xs={12}>
          <h2 className="mb-4">Supplier Dashboard</h2>
        </Col>
      </Row>
      
<div className="d-flex justify-content-center">
      <Row className="w-100">
        <Col xs={12} lg={10} className="mx-auto">
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Activity size={24} className="text-success me-2" />
                <Card.Title className="mb-0">Seed Management</Card.Title>
              </div>
              <Row>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/supplierboard/mydetails" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <User size={24} className="text-primary mb-2" />
                      <div>My Details</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/supplierboard/seedsandbatches" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <FileText size={24} className="text-primary mb-2" />
                      <div>Seeds Batches</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/supplierboard/add-seeds" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Package size={24} className="text-primary mb-2" />
                      <div>Add Seeds</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/supplierboard/add-batch" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Calendar size={24} className="text-primary mb-2" />
                      <div>Add Batch</div>
                    </div>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </Container>
  )
}