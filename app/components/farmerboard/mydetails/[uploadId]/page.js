'use client'

import { useParams } from 'next/navigation'
import { getSupertoken } from '@/helpers/AccessToken';
import { ApiUrl } from '@/helpers/ApiUrl';
import axios from 'axios';
import React, { useState } from 'react'
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";


export default function UpdatePhoto() {
    const {uploadId} = useParams()

    const [userPhoto, setUserPhoto] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const usertoken = getSupertoken();

    
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setUserPhoto(file);
    };
    
    const handleSubmit = async(event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

    
        if (!userPhoto) {
            setError("Please select a certification image");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('userPhoto', userPhoto);
        
        try {
            const response = await axios.put(`${ApiUrl}/user_update_pic/${uploadId}`, formData, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });

            setResult(response.data.msg);
            
        
            setTimeout(() => {
                window.location.href = "/components/farmerboard";
            }, 2000);
            
        } catch (err) {
            console.error("Error uploading info:", err);
            setError(err.response?.data?.message || "An error occurred while uploading your information");
        } finally {
            setLoading(false);
        }
    };



  return (
    <>
    <Container style={{ fontFamily: "sans-serif", marginTop: "2rem" }}>
                <h4
                    style={{
                        textAlign: "center",
                        marginBottom: "1rem",
                        color: "#3a7bd5", 
                        fontWeight: "bold",
                    }}
                >
                    Upload Your Photo
                </h4>
                
                {result && <Alert variant="success">{result}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            
                            <Form.Group className="mb-4" controlId="formBasicSupplierLicence">
                                <Form.Label>Your Photo</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageUpload}
                                    required
                                    accept=".png, .jpg, .jpeg, .webp"
                                    className="form-control"
                                />
                                <Form.Text className="text-muted">
                                    Upload a clear image
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
                                        "Upload Photo"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>


    </>
  )
}
