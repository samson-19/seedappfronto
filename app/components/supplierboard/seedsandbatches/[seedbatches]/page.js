"use client";
import { useParams } from "next/navigation";
import { getSupertoken } from "@/helpers/AccessToken";
import { ApiUrl } from "@/helpers/ApiUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Badge,
  Table,
  Accordion,
  Button,
  Modal,
  Form,
  Nav,
  Tab,
} from "react-bootstrap";

export default function SeedAndBatch() {
  const params = useParams();
  const seedbatches = params.seedbatches;
  const [seed, setSeed] = useState({});
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState(0);
  const [editForm, setEditForm] = useState({});

  const [deleteBatchId, setDeleteBatchId] = useState("");
  const usertoken = getSupertoken();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ApiUrl}/supplier_view_single/${seedbatches}`,
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        setSeed(response.data.seed);
        setBatches(response.data.batches);
        setLoading(false);
      } catch (error) {
        console.log(`there was a problem while fetching data. ${error}`);
        setLoading(false);
      }
    };
    fetchData();
  }, [usertoken, seedbatches]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function for status badge color
  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Function to format and display batch detail values
  const formatBatchDetailValue = (key, value) => {
    if (key === "batchManufactured" || key === "batchExpireDate") {
      return formatDate(value);
    }
    return typeof value === "object" ? JSON.stringify(value) : value;
  };

  // Open edit modal with batch details
  const openEditModal = (batch, detailIndex = 0) => {
    setSelectedBatch(batch);
    setSelectedDetailIndex(detailIndex);
    setEditForm(batch.batchDetails[detailIndex] || {});
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (key, value) => {
    setEditForm({
      ...editForm,
      [key]: value,
    });
  };

  const openDeleteModal = (id) => {
    setDeleteBatchId(id);

    setShowDeleteModal(true);
  };

  

  const handleDelete = async () => {
    try {
      console.log(deleteBatchId);
      await axios.delete(`${ApiUrl}/delete_batch/${deleteBatchId}`, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.log(`Delete failed: ${error}`);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Create a copy of the current batch details
      const updatedBatchDetails = [...selectedBatch.batchDetails];
      // Update the specific detail item
      updatedBatchDetails[selectedDetailIndex] = editForm;

      let batchDetailId = updatedBatchDetails[selectedDetailIndex];

      await axios.put(
        `${ApiUrl}/update_batch/${selectedBatch._id}/${batchDetailId._id}`,
        {
          batchDetails: updatedBatchDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      // Update local state
      const updatedBatches = batches.map((batch) => {
        if (batch._id === selectedBatch._id) {
          return {
            ...batch,
            batchDetails: updatedBatchDetails,
          };
        }
        return batch;
      });

      setBatches(updatedBatches);
      setShowEditModal(false);
    } catch (error) {
      console.log(`Failed to update batch: ${error}`);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading seed details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4 border-bottom pb-3">Seed Details</h1>

      {/* Seed Information Card */}
      <Card className="shadow-sm mb-4">
        <Card.Header
          as="h5"
          className="bg-primary text-white d-flex justify-content-between align-items-center"
        >
          <span>{seed.seedName}</span>
          <Badge bg={getStatusBadgeVariant(seed.seedStatus)}>
            {seed.seedStatus}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Manufacturer</h6>
                <p className="fw-bold">{seed.seedManufacturer}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Type</h6>
                <p className="fw-bold">{seed.seedType}</p>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Created</h6>
                <p>{formatDate(seed.createdAt)}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <h6 className="text-muted mb-1">Last Updated</h6>
                <p>{formatDate(seed.updatedAt)}</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Batches Section */}
      <h2 className="mb-3 mt-5">Seed Batches</h2>

      {batches.length > 0 ? (
        batches.map((batch, index) => (
          <Card key={batch._id} className="shadow-sm mb-4">
            <Card.Header
              as="h5"
              className="bg-light d-flex justify-content-between align-items-center"
            >
              <span>
                Batch #{index + 1}
                <div className="text-muted mt-1" style={{ fontSize: "0.8rem" }}>
                  ID: {batch._id}
                </div>
              </span>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => openDeleteModal(batch._id)}
              >
                Delete Batch
              </Button>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Created</h6>
                    <p>{formatDate(batch.createdAt)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Last Updated</h6>
                    <p>{formatDate(batch.updatedAt)}</p>
                  </div>
                </Col>
              </Row>

              {batch.batchDetails && batch.batchDetails.length > 0 && (
                <div className="mt-3">
                  <Tab.Container defaultActiveKey="0">
                    {batch.batchDetails.length > 1 && (
                      <Nav variant="tabs" className="mb-3">
                        {batch.batchDetails.map((detail, detailIndex) => (
                          <Nav.Item key={detailIndex}>
                            <Nav.Link eventKey={detailIndex.toString()}>
                              Detail #{detailIndex + 1}
                            </Nav.Link>
                          </Nav.Item>
                        ))}
                      </Nav>
                    )}

                    <Tab.Content>
                      {batch.batchDetails.map((detail, detailIndex) => (
                        <Tab.Pane
                          key={detailIndex}
                          eventKey={detailIndex.toString()}
                        >
                          <div className="d-flex justify-content-end mb-2">
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => openEditModal(batch, detailIndex)}
                            >
                              Edit this detail
                            </Button>
                          </div>
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Property</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(detail).map(
                                ([key, value], idx) => (
                                  <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>
                                      {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (str) =>
                                          str.toUpperCase()
                                        )}
                                    </td>
                                    <td>
                                      {formatBatchDetailValue(key, value)}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className="shadow-sm text-center p-5">
          <Card.Body>
            <p className="text-muted mb-0">No batches found for this seed.</p>
          </Card.Body>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Batch Detail #{selectedDetailIndex + 1}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBatch && (
            <Form>
              {Object.entries(editForm).map(([key, value]) => (
                <Form.Group key={key} className="mb-3">
                  <Form.Label>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Form.Label>

                  {key === "batchManufactured" || key === "batchExpireDate" ? (
                    <Form.Control
                      type="date"
                      value={
                        value ? new Date(value).toISOString().split("T")[0] : ""
                      }
                      onChange={(e) =>
                        handleEditFormChange(key, e.target.value)
                      }
                    />
                  ) : (
                    <Form.Control
                      type="text"
                      value={value || ""}
                      onChange={(e) =>
                        handleEditFormChange(key, e.target.value)
                      }
                    />
                  )}
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete modal */}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this batch?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* end Delete Modal */}
    </Container>
  );
}
