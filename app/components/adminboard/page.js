'use client'
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import {Activity, Pen, User, User2, Leaf } from 'lucide-react'
import Link from 'next/link'

export default function AdminBoard() {
 
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
                <Card.Title className="mb-0">Administrator</Card.Title>
              </div>
              <Row>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/adminboard/mydetails" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <User size={24} className="text-primary mb-2" />
                      <div>Details</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/adminboard/users" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <User2 size={24} className="text-primary mb-2" />
                      <div>Users</div>
                    </div>
                  </Link>
                </Col>
                <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/adminboard/reports" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Pen size={24} className="text-primary mb-2" />
                      <div>Send Reports</div>
                    </div>
                  </Link>
                </Col>
                 <Col xs={6} md={3} className="text-center mb-3">
                  <Link href="/components/adminboard/seeds" className="text-decoration-none">
                    <div className="p-3 bg-light rounded hover-effect">
                      <Leaf size={24} className="text-primary mb-2" />
                      <div>Seeds</div>
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