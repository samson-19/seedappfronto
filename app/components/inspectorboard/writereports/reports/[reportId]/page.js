'use client'
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Calendar, Tag, ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { ApiUrl } from '@/helpers/ApiUrl';
import { getSupertoken } from '@/helpers/AccessToken';
import jsPDF from 'jspdf';
import { useParams } from 'next/navigation';

const SingleReport = () => {
    const params = useParams()
    const reportId = params.reportId 
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usertoken = getSupertoken();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${ApiUrl}/report_view_own_report/${reportId}`, {
          headers: {
            Authorization: `Bearer ${usertoken}`
          }
        });
        
        setReport(response.data.myReport);
        setLoading(false);
      } catch (error) {
        console.error(`There was a problem fetching the report. Error: ${error}`);
        setError('Failed to load report. Please try again later.');
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId, usertoken]);

  const generatePDF = () => {
    if (!report) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = 20;
    
    // Add title
    doc.setFontSize(18);
    doc.text(report.reportTitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    
    // Add metadata
    doc.setFontSize(11);
    doc.text(`Type: ${report.reportType}`, margin, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Date: ${new Date(report.reportDate).toLocaleDateString()}`, margin, yPosition);
    yPosition += lineHeight * 2;
    
    // Add content
    doc.setFontSize(12);
    const contentWidth = pageWidth - (margin * 2);
    const splitContent = doc.splitTextToSize(report.reportBody, contentWidth);
    doc.text(splitContent, margin, yPosition);
    
    // Save the PDF
    doc.save(`${report.reportTitle.replace(/\s+/g, '_')}_report.pdf`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5">
          <Card.Body>
            <h3>Error</h3>
            <p className="text-danger">{error}</p>
            <Link href="/components/inspectorboard/writereports/reports/" className="btn btn-primary">Go Back to Reports</Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!report) {
    return (
      <Container className="py-5">
        <Card className="text-center p-5">
          <Card.Body>
            <h3>Report Not Found</h3>
            <p className="text-muted">The requested report could not be found.</p>
            <Link href="/components/inspectorboard/writereports/reports/" className="btn btn-primary">
              Back to Reports
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="mb-4">
        <Link href="/components/inspectorboard/writereports/reports/" className="btn btn-outline-secondary d-inline-flex align-items-center">
          <ArrowLeft size={16} className="me-2" />
          Back to Reports
        </Link>
      </div>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{report.reportTitle}</h2>
            <Button 
              variant="outline-primary" 
              className="d-flex align-items-center"
              onClick={generatePDF}
            >
              <Printer size={16} className="me-2" />
              Print PDF
            </Button>
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <Tag size={18} className="text-primary me-2" />
                <div>
                  <div className="text-muted small">Report Type</div>
                  <div className="fw-bold">{report.reportType}</div>
                </div>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="d-flex align-items-center">
                <Calendar size={18} className="text-primary me-2" />
                <div>
                  <div className="text-muted small">Report Date</div>
                  <div className="fw-bold">{new Date(report.reportDate).toLocaleDateString()}</div>
                </div>
              </div>
            </Col>
          </Row>
          
          <hr className="my-4" />
          
          <div className="report-content">
            <div className="bg-light p-4 rounded">
              {report.reportBody.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SingleReport;