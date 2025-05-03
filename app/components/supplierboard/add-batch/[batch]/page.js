"use client";

import { useParams } from "next/navigation";
import { getSupertoken } from "@/helpers/AccessToken";
import { ApiUrl } from "@/helpers/ApiUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

export default function AddBatch() {
  const params = useParams();
  const batch = params.batch;
  const [formData, setFormData] = useState({
    batchName: "",
    batchManufactured: "",
    batchMadeAt: "",
    batchExpireDate: ""
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [error, setError] = useState(null);

  const usertoken = getSupertoken();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    if (!formData.batchName) {
      setError("batch name is required ");
      setLoading(false);
      return;
    }

    if (!formData.batchManufactured) {
      setError("batch manufactured  field is required ");
      setLoading(false);
      return;
    }

    if (!formData.batchMadeAt) {
      setError("batch made at  field  is required ");
      setLoading(false);
      return;
    }

    if (!formData.batchExpireDate) {
        setError("batch expire date  is required ");
        setLoading(false);
        return;
      }

    try {
      const response = await axios.post(
        `${ApiUrl}/add_seed_details/${batch}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          },
        }
      );

      setResult(response.data.msg);

      setTimeout(() => {
        window.location.href = "/components/supplierboard";
      }, 2000);
    } catch (err) {
      console.error("Error adding batch info:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while adding batch information"
      );
    } finally {
      setLoading(false);
    }
  };

  return(
    <Container style={{ fontFamily: "sans-serif", marginTop: "2rem" }}>
                    <h4
                        style={{
                            textAlign: "center",
                            marginBottom: "1rem",
                            color: "#3a7bd5", 
                            fontWeight: "bold",
                        }}
                    >
                        Upload Seed Details
                    </h4>
                    
                    {result && <Alert variant="success">{result}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Row className="justify-content-md-center">
                        <Col xs={12} md={6}>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Form.Group className="mb-3" controlId="formBasicBatchName">
                                    <Form.Label>Batch Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="batchName"
                                        value={formData.batchName}
                                        onChange={handleInputChange}
                                        placeholder="Write batch  number"
                                        required
                                    />
                                </Form.Group>
    
    
                                <Form.Group className="mb-3" controlId="formBasicBatchMadeAt">
                                    <Form.Label>Factory Batch Was Made</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="batchMadeAt"
                                        value={formData.batchMadeAt}
                                        onChange={handleInputChange}
                                        placeholder="Write Factory Batch Was Made At"
                                        required
                                    />
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="formBasicBatchManufactured">
                                    <Form.Label>Batch Manufacturing Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="batchManufactured"
                                        value={formData.batchManufactured}
                                        onChange={handleInputChange}
                                        placeholder="Batch Manufacturing Date"
                                        required
                                    />
                                </Form.Group>


                                <Form.Group className="mb-3" controlId="formBasicBatchExpireDate">
                                    <Form.Label>Batch Expire Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="batchExpireDate"
                                        value={formData.batchExpireDate}
                                        onChange={handleInputChange}
                                        placeholder="Batch  Date"
                                        required
                                    />
                                </Form.Group>
                                
        
        
    
                               
    
    
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={loading}
                                        className="py-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                <span className="ms-2">submiting...</span>
                                            </>
                                        ) : (
                                            "Add Batch Data"
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
    




  )
}
