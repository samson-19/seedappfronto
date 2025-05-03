'use client'

import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'



export default function ReportsList() {
  return (
    <>
    <Container className="py-4">
          <h2 className="mb-4">Reports Dashboard</h2>
          <Row className='g-4'>
          <Col md={6}>
            <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>Write Reports</Card.Title>
               <Card.Text>
                 Create new reports about seed quality, counterfeit findings, or field inspections.
               </Card.Text>
               <Link href="/components/inspectorboard/writereports/write" className="btn btn-primary mt-auto">
                 Write New Report
               </Link>
             </Card.Body>
           </Card> 
        </Col>


        <Col md={6}>
         <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>View Reports</Card.Title>
               <Card.Text>
                 Access and review previously submitted reports.
               </Card.Text>
               <Link href="/components/inspectorboard/writereports/reports" className="btn btn-secondary mt-auto">
                 View Reports
               </Link>
             </Card.Body>
           </Card>
         </Col>
        


          </Row>


    </Container>
    </>
  )
}
