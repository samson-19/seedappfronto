'use client'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Spinner, Form, Button, Container, Row, Col, Alert, Card, Badge, Table } from 'react-bootstrap'

export default function InspectSeeds() {
  const [seedsData, setSeedsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('seedName') // 'seedName' or 'batchName'
  const usertoken = getSupertoken()
  
  useEffect(() => {
    const fetchData = async() => {
      try {
        setLoading(true)
        const response = await axios.get(`${ApiUrl}/seeds_and_batches_inspector`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        setSeedsData(response.data.seedsWithBatches)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching seeds data:", error)
        setMessage({ text: "Failed to load seeds data", type: "danger" })
        setLoading(false)
      }
    }
    fetchData()
  }, [usertoken])

  // Filter seeds based on search term and search type
  const filteredSeeds = seedsData.filter(seedItem => {
    if (searchTerm === '') return true;
    
    if (searchType === 'seedName') {
      return seedItem.seed.seedName.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchType === 'batchName') {
      // Search within all batches for matching batch names
      return seedItem.batches.some(batch => 
        batch.batchDetails.some(detail => 
          detail.batchName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return true;
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let variant;
    switch(status.toLowerCase()) {
      case 'approved':
        variant = 'success';
        break;
      case 'rejected':
        variant = 'danger';
        break;
      case 'pending':
        variant = 'warning';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Seed Inspector</h2>
      
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
          {message.text}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label>Search by:</Form.Label>
                <Form.Select 
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="seedName">Seed Name</option>
                  <option value="batchName">Batch Name</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={7}>
              <Form.Group className="mb-3">
                <Form.Label>Search term:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder={`Search by ${searchType === 'seedName' ? 'seed name' : 'batch name'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : filteredSeeds.length > 0 ? (
        filteredSeeds.map((seedItem) => (
          <Card key={seedItem.seed._id} className="mb-4">
            <Card.Header>
            <h5 className="mb-0 text-center"> 

                <Link href={`/components/inspectorboard/inspectseeds/${seedItem.seed._id}`}>MANAGE</Link>
            </h5>

              <Row className="align-items-center">
              
                <Col md={6}>
                  <h5 className="mb-0">{seedItem.seed.seedName}</h5>
                  
                </Col>
                <Col md={3}>
                  <Badge bg="info" className="me-2">{seedItem.seed.seedType}</Badge>
                  <StatusBadge status={seedItem.seed.seedStatus} />
                </Col>
                <Col md={3} className="text-md-end">
                  <small className="text-muted">Manufacturer: {seedItem.seed.seedManufacturer}</small>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <h6 className="mb-3">Batches ({seedItem.batches.reduce((count, batch) => count + batch.batchDetails.length, 0)})</h6>
              
              {seedItem.batches.map((batch) => (
                <div key={batch._id}>
                  {batch.batchDetails.map((batchDetail) => (
                    <Card key={batchDetail._id} className="mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <strong>Batch Name:</strong> {batchDetail.batchName}
                          </Col>
                          <Col md={4}>
                            <strong>Made At:</strong> {batchDetail.batchMadeAt}
                          </Col>
                          <Col md={4}>
                            <strong>Status:</strong> <StatusBadge status={batchDetail.batchStatus} />
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col md={4}>
                            <strong>Manufactured:</strong> {formatDate(batchDetail.batchManufactured)}
                          </Col>
                          <Col md={4}>
                            <strong>Expires:</strong> {formatDate(batchDetail.batchExpireDate)}
                          </Col>
                          <Col md={4}>
                            {new Date(batchDetail.batchExpireDate) < new Date() && (
                              <Badge bg="danger">Expired</Badge>
                            )}
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ))}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">
          No seeds found matching your search criteria.
        </Alert>
      )}
    </Container>
  );
}