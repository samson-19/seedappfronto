'use client'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap'

export default function EnterSeedBatchData() {
    const [seedsData, setSeedsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSeed, setSelectedSeed] = useState("")
    const [selectedBatch, setSelectedBatch] = useState("")
    const [formData, setFormData] = useState({
        batchId: "",
        seedId: ""
    })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState({ text: "", type: "" })
    
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
    
    const handleSeedChange = (e) => {
        const seedId = e.target.value
        setSelectedSeed(seedId)
        setSelectedBatch("")
        setFormData({
            ...formData,
            seedId: seedId,
            batchId: ""
        })
    }
    
    const handleBatchChange = (e) => {
        const batchId = e.target.value
        setSelectedBatch(batchId)
        setFormData({
            ...formData,
            batchId: batchId
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.seedId || !formData.batchId) {
            setMessage({ text: "Please select both a seed and a batch", type: "danger" })
            return
        }
        
        try {
            setSubmitting(true)
            const response = await axios.post(`${ApiUrl}/add_batches`, formData, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
            
            setMessage({ text: "Data submitted successfully!", type: "success" })
            // Reset form after successful submission
            setSelectedSeed("")
            setSelectedBatch("")
            setFormData({
                batchId: "",
                seedId: ""
            })
            setSubmitting(false)
        } catch (error) {
            console.error("Error submitting data:", error)
            setMessage({ 
                text: error.response?.data?.msg || "Failed to submit data", 
                type: "danger" 
            })
            setSubmitting(false)
        }
    }
    
    // Find the selected seed's batches
    const selectedSeedBatches = seedsData.find(item => 
        item.seed._id === selectedSeed
    )?.batches[0]?.batchDetails || []
    
    return (
        <Container className="py-4">
            <h2 className="mb-4">Enter Seed Batch Data</h2>
            
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow-sm">
                    {message.text && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage({ text: "", type: "" })}>
                            {message.text}
                        </Alert>
                    )}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Select Seed</Form.Label>
                        <Form.Select
                            value={selectedSeed}
                            onChange={handleSeedChange}
                            required
                        >
                            <option value="">-- Select a Seed --</option>
                            {seedsData.map((item) => (
                                <option key={item.seed._id} value={item.seed._id}>
                                    {item.seed.seedName} - {item.seed.seedManufacturer}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                        <Form.Label>Select Batch</Form.Label>
                        <Form.Select
                            value={selectedBatch}
                            onChange={handleBatchChange}
                            disabled={!selectedSeed}
                            required
                        >
                            <option value="">-- Select a Batch --</option>
                            {selectedSeedBatches.map((batch) => (
                                <option key={batch._id} value={batch._id}>
                                    {batch.batchName} - Expires: {new Date(batch.batchExpireDate).toLocaleDateString()}
                                </option>
                            ))}
                        </Form.Select>
                        {!selectedSeed && (
                            <Form.Text className="text-muted">
                                Please select a seed first
                            </Form.Text>
                        )}
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end">
                        <Button 
                            type="submit" 
                            variant="primary"
                            disabled={submitting || !selectedSeed || !selectedBatch}
                        >
                            {submitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </Form>
            )}
        </Container>
    )
}