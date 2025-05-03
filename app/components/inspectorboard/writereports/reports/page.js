'use client'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Spinner, Container, Row, Col, Card, Badge } from 'react-bootstrap'

export default function ViewReports() {
    const [myReports, setMyReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const usertoken = getSupertoken()
    const router = useRouter()
    
    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true)
                const response = await axios.get(`${ApiUrl}/report_view_own_reports`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                })
                setMyReports(response.data.myReports)
                setLoading(false)
            } catch (error) {
                console.log(`there was a problem. Error ${error}`)
                setError("Failed to load reports. Please try again later.")
                setLoading(false)
            }
        }
        fetchData()
    }, [usertoken])

    // format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }


    const getBadgeVariant = (reportType) => {
        switch(reportType.toLowerCase()) {
            case 'inspection report':
                return 'danger'
            case 'counterfeit seeds or batches report':
                return 'info'
           
            default:
                return 'secondary'
        }
    }


    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text
        return text.substr(0, maxLength) + '...'
    }

    const getThumbnailColor = (reportType) => {
        switch(reportType.toLowerCase()) {
            case 'inspection report':
                return '#ffdddd'
            case 'counterfeit seeds or batches report':
                return '#d1ecf1'
            
            default:
                return '#e2e3e5'
        }
    }


    const handleRedirecto = async(id) => {
        router.push(`/components/inspectorboard/writereports/reports/${id}`)
    }


    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="py-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">My Reports</h2>
            
            {myReports.length === 0 ? (
                <div className="alert alert-info">
                    You have not submitted any reports yet.
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {myReports.map((report) => (
                        <Col key={report._id}>
                            <Card className="h-100 shadow-sm">
                                <div 
                                    className="text-center py-3" 
                                    style={{ 
                                        backgroundColor: getThumbnailColor(report.reportType),
                                        height: '100px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <span className="h1">{report.reportType.charAt(0).toUpperCase()}</span>
                                </div>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Badge bg={getBadgeVariant(report.reportType)}>
                                            {report.reportType}
                                        </Badge>
                                        <small className="text-muted">
                                            {formatDate(report.reportDate)}
                                        </small>
                                    </div>
                                    <Card.Title>{report.reportTitle}</Card.Title>
                                    <Card.Text>
                                        {truncateText(report.reportBody, 120)}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="bg-white">
                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleRedirecto(report._id)}>
                                        View Details
                                    </button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )
}