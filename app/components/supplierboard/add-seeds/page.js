'use client'
import { getSupertoken } from '@/helpers/AccessToken';
import { ApiUrl } from '@/helpers/ApiUrl';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Row, Col, Button, Spinner, Alert } from "react-bootstrap";



export default function AddSeeds() {

    const [formData, setFormData] = useState({
            seedName: "",
            seedManufacturer: "",
            seedType: ""
        });


            const [loading, setLoading] = useState(false); 
            const [result, setResult] = useState(null);

            const [error, setError] = useState(null);

            const[seedTypeEnums, setSeedTypeEnums] = useState([])
        
            const usertoken = getSupertoken();



            useEffect(() => {

                const fetchEnums = async() => {

                   
                    try {
                        const response = await axios.get(`${ApiUrl}/get_seed_enums`)

                        setSeedTypeEnums(response.data.seedEnums)
    
                        
                    } catch (error) {
                    
                        setError(err.response?.data?.message || "An error occurred while fetching data");
                        
                    }

                }


                fetchEnums()


            },  [])




        
            const handleInputChange = (e) => {
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                });
            };



            const handleSubmit = async(event) => {
                event.preventDefault();
                setLoading(true);
                setError(null);
                setResult(null);
        
            
                if (!formData.seedManufacturer) {
                    setError("Seed manufacturer name is required ");
                    setLoading(false);
                    return;
                }


                if (!formData.seedName) {
                    setError("Seed Name is required ");
                    setLoading(false);
                    return;
                }
        
        
                if (!formData.seedType) {
                    setError("Seed Type  is required ");
                    setLoading(false);
                    return;
                }
        
                
                try {
                    const response = await axios.post(`${ApiUrl}/add_new_seed`, formData, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`,
                    
                        }
                    });
        
                    setResult(response.data.msg);
                    
                
                    setTimeout(() => {
                        window.location.href = "/components/supplierboard";
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
                    Upload Seed Details
                </h4>
                
                {result && <Alert variant="success">{result}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Row className="justify-content-md-center">
                    <Col xs={12} md={6}>
                        <Form onSubmit={handleSubmit} encType="multipart/form-data">
                            <Form.Group className="mb-3" controlId="formBasicManucturerName">
                                <Form.Label>Seed Manufacturer Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="seedManufacturer"
                                    value={formData.seedManufacturer}
                                    onChange={handleInputChange}
                                    placeholder="Write seed manufacturer name"
                                    required
                                />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formBasicSeedName">
                                <Form.Label>Seed Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="seedName"
                                    value={formData.seedName}
                                    onChange={handleInputChange}
                                    placeholder="Write seed  name"
                                    required
                                />
                            </Form.Group>
    

                            <Form.Group className="mb-3" controlId="formBasicSeedType">
                            <Form.Label>Seed Type</Form.Label>

                            <Form.Select
                    name="seedType"
                    value={formData.seedType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Seed Type</option>
                    
                    {seedTypeEnums?.map((element, index) => (
    <option key={index} value={element}>
      {element}
                      </option>
                    ))}
                  </Form.Select>



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
                                        "Submit Data"
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
  )
}
