'use client'
import { getSupertoken } from '@/helpers/AccessToken';
import { ApiUrl } from '@/helpers/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

export default function UploadInspectorInfo() {
    
    const [inspectorIdentification, setInspectorImage] = useState(null);
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
    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setInspectorImage(file);
    };
    
    const handleSubmit = async(event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

    
        if (!inspectorIdentification) {
            setError("Please select a certification image");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('inspectorIdentification', inspectorIdentification);
        
        try {
            const response = await axios.post(`${ApiUrl}/inspector_id_photograph`, formData, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });

            setResult(response.data.msg);
            
        
            setTimeout(() => {
                window.location.href = "/components/inspectorboard";
            }, 2000);
            
        } catch (err) {
            console.error("Error uploading supplier info:", err);
            setError(err.response?.data?.message || "An error occurred while uploading your information");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ fontFamily: "sans-serif", marginTop: "2rem" }}>
            <h4
                style={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    color: "#3a7bd5", 
                    fontWeight: "bold",
                }}
            >
                Upload Your Inspector Details
            </h4>
            
            {result && <Alert variant="success">{result}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        <Form.Group className="mb-4" controlId="formBasicSupplierLicence">
                            <Form.Label>Certification/License Document</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageUpload}
                                required
                                accept=".png, .jpg, .jpeg, .webp"
                                className="form-control"
                            />
                            <Form.Text className="text-muted">
                                Upload a clear image of your inspector certification or license
                            </Form.Text>
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
                                        <span className="ms-2">Uploading...</span>
                                    </>
                                ) : (
                                    "Submit Information"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}