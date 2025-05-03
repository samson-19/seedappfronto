'use client'

import Link from 'next/link'
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'



export default function ListInspection() {
  return (
    <>
    <Container className="py-4">
          <h2 className="mb-4">ALL SEEDS</h2>
          <Row className='g-4'>
          <Col md={6}>
            <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>ALL SEEDS</Card.Title>
               <Card.Text>
                 View all seeds and batches.
               </Card.Text>
               <Link href="/components/inspectorboard/inspectseeds/allseeds" className="btn btn-primary mt-auto">
                 All Seeds
               </Link>
             </Card.Body>
           </Card> 
        </Col>


        <Col md={6}>
         <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>PENDING</Card.Title>
               <Card.Text>
                 view seeds and batches that are pending for inspection
               </Card.Text>
               <Link href="/components/inspectorboard/inspectseeds/pending" className="btn btn-secondary mt-auto">
                 Pending Seeds
               </Link>
             </Card.Body>
           </Card>
         </Col>


         <Col md={6}>
         <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>QUARANTINE</Card.Title>
               <Card.Text>
                 view seeds and batches that are in quarantine
               </Card.Text>
               <Link href="/components/inspectorboard/inspectseeds/quarantine" className="btn btn-warning mt-auto">
                 Seeds In Qurantine
               </Link>
             </Card.Body>
           </Card>
         </Col>
        

         <Col md={6}>
         <Card className="h-100">
             <Card.Body className="d-flex flex-column">
               <Card.Title>APPROVED</Card.Title>
               <Card.Text>
                 view seeds and batches that have been approved
               </Card.Text>
               <Link href="/components/inspectorboard/inspectseeds/approved" className="btn btn-danger mt-auto">
                 Approved Seeds
               </Link>
             </Card.Body>
           </Card>
         </Col>
        
        


          </Row>


    </Container>
    </>
  )
}
