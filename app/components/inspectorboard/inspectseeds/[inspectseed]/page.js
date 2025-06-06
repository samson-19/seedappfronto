
'use client'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Form, Button, Container, Row, Col, Alert, Card, Badge, Modal } from 'react-bootstrap'
import { useParams, useRouter } from 'next/navigation'

export default function SingleSeedInspector() {
  const { inspectseed } = useParams()
  const router = useRouter()
  const [seedData, setSeedData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })
  const usertoken = getSupertoken()
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [modalType, setModalType] = useState('') // 'seed' or 'batch'
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItemType, setDeleteItemType] = useState('') // 'seed' or 'batch'
  const [selectedBatchId, setSelectedBatchId] = useState(null)

  useEffect(() => {

    const fetchSeedData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${ApiUrl}/seed_batch_single_inspector/${inspectseed}`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        setSeedData(response.data.seedWithBatches)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching seed data:", error)
        setMessage({ text: response?.data?.msg || "Failed to load seed data", type: "danger" })
        setLoading(false)
      }
    }
  


    fetchSeedData()
  }, [inspectseed, usertoken ])

 
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    let variant;
    switch(status.toLowerCase()) {
      case 'approved':
        variant = 'success';
        break;
      case 'quarantine':
        variant = 'danger';
        break;
      case 'pending':
        variant = 'warning';
      case 'expired':
        variant = 'primary';   
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  }

  // Open status update modal
  const openStatusModal = (type, item, batchId = null) => {
    setModalType(type)
    setSelectedItem(item)
    setSelectedStatus(item.seedStatus || item.batchStatus)
    setSelectedBatchId(batchId)
    setShowStatusModal(true)
  }

  // Open delete confirmation modal
  const openDeleteModal = (type, item, batchId = null) => {
    setDeleteItemType(type)
    setSelectedItem(item)
    setSelectedBatchId(batchId)
    setShowDeleteModal(true)
  }

  
  const handleStatusUpdate = async () => {
    try {
      let endpoint, payload;
      
      if (modalType === 'seed') {
        endpoint = `${ApiUrl}/update_seed_status/${selectedItem._id}`
        payload = { seedStatus: selectedStatus }
      } else {
        
        endpoint = `${ApiUrl}/update_batch_status/${selectedBatchId}`
        payload = { 
          batchDetailId: selectedItem._id,
          batchStatus: selectedStatus 
        }
      }
      
      await axios.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${usertoken}`
        }
      })
      
      setShowStatusModal(false)
      setMessage({ text: `${modalType} status updated successfully`, type: "success" })
    
      window.location.reload()
    } catch (error) {
      console.log(`Error updating ${modalType} status:`, error)
    
    }
  }

  // Delete seed or batch
  const handleDeleteItem = async () => {
    try {
      let endpoint;
      
      if (deleteItemType === 'seed') {
        endpoint = `${ApiUrl}/delete_seed/${selectedItem._id}`
        await axios.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        })
        
        setShowDeleteModal(false)
        setMessage({ text: "Seed deleted successfully", type: "success" })
    
        router.push('/inspector/seeds')
      } else {
      
        endpoint = `${ApiUrl}/delete_batch_detail/${selectedBatchId}`
        await axios.delete(endpoint, {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
          data: { batchDetailId: selectedItem._id }
        })
        
        setShowDeleteModal(false)
        setMessage({ text: "Batch deleted successfully", type: "success" })
      
      }
    } catch (error) {
      console.log(`Error deleting ${deleteItemType}:`, error)
      
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    )
  }

  if (!seedData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Seed not found or you do not have permission to view it.</Alert>
        <Button variant="primary" onClick={() => router.push('/components/inspectorboard')}>
          Back to Seeds List
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Seed Inspector:</h2>
        </Col>
        <Col xs="auto">
          <Button 
            variant="outline-primary" 
            onClick={() => router.push('/components/inspectorboard')}
            className="me-2"
          >
            Back to Seeds
          </Button>
        </Col>
      </Row>
      
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
          {message.text}
        </Alert>
      )}
      
      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Seed Details</h5>
            </Col>
            <Col xs="auto">
              <Button 
                variant="warning" 
                size="sm"
                className="me-2"
                onClick={() => openStatusModal('seed', seedData.seed)}
              >
                Update Status
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => openDeleteModal('seed', seedData.seed)}
              >
                Delete Seed
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <strong>Seed Name:</strong> {seedData.seed.seedName}
            </Col>
            <Col md={4}>
              <strong>Manufacturer:</strong> {seedData.seed.seedManufacturer}
            </Col>
            <Col md={4}>
              <strong>Type:</strong> {seedData.seed.seedType}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={4}>
              <strong>Status:</strong> <StatusBadge status={seedData.seed.seedStatus} />
            </Col>
            <Col md={4}>
              <strong>Created:</strong> {formatDate(seedData.seed.createdAt)}
            </Col>
            <Col md={4}>
              <strong>Last Updated:</strong> {formatDate(seedData.seed.updatedAt)}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <h4 className="mt-4 mb-3">Batches ({seedData.batches.length > 0 ? seedData.batches.reduce((count, batch) => count + batch.batchDetails.length, 0) : 0})</h4>
      
      {seedData.batches.length > 0 ? (
        seedData.batches.map((batch) => (
          <div key={batch._id}>
            {batch.batchDetails.map((batchDetail) => (
              <Card key={batchDetail._id} className="mb-3">
                <Card.Header>
                  <Row className="align-items-center">
                    <Col>
                      <h6 className="mb-0">Batch: {batchDetail.batchName}</h6>
                    </Col>
                    <Col xs="auto">
                      <Button 
                        variant="warning" 
                        size="sm"
                        className="me-2"
                        onClick={() => openStatusModal('batch', batchDetail, batch._id)}
                      >
                        Update Status
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => openDeleteModal('batch', batchDetail, batch._id)}
                      >
                        Delete Batch
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <strong>Made At:</strong> {batchDetail.batchMadeAt}
                    </Col>
                    <Col md={4}>
                      <strong>Manufactured:</strong> {formatDate(batchDetail.batchManufactured)}
                    </Col>
                    <Col md={4}>
                      <strong>Expires:</strong> {formatDate(batchDetail.batchExpireDate)}
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={4}>
                      <strong>Status:</strong> <StatusBadge status={batchDetail.batchStatus} />
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
        ))
      ) : (
        <Alert variant="info">No batches available for this seed.</Alert>
      )}
      
      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update {modalType === 'seed' ? 'Seed' : 'Batch'} Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="quarantine">quarantine</option>
              <option value="expired">expired</option>
              
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusUpdate}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this {deleteItemType}?
          {deleteItemType === 'seed' && (
            <div className="mt-2">
              <Alert variant="warning">
                This will also delete all associated batches!
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteItem}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}