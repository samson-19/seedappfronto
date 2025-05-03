'use client'
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import {Activity, Pen,  User, Scan, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function FarmerBoard() {
 
  return (
    <Container className="py-4">
      <Row>
        <Col xs={12}>
          <h2 className="mb-4">Menu</h2>
        </Col>
      </Row>
      
<div className="d-flex justify-content-center">
      <Row className="w-100">
        <Col xs={12} lg={10} className="mx-auto">
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <Activity size={24} className="text-success me-2" />
                <Card.Title className="mb-0">User Account Management</Card.Title>
              </div>
              <Row>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/farmerboard/mydetails" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <User size={24} className="text-primary mb-2" />
                      <div>My Details</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/farmerboard/scanseeds" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Scan size={24} className="text-primary mb-2" />
                      <div>Scan Seeds</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/farmerboard/report" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Pen size={24} className="text-primary mb-2" />
                      <div>Report Seeds</div>
                    </div>
                  </Link>
                </Col>
                 <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/farmerboard/cart" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <ShoppingBag size={24} className="text-primary mb-2" />
                      <div>My Cart</div>
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