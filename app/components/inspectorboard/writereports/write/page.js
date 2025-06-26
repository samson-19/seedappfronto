'use client'

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Table, Spinner } from 'react-bootstrap';
import { Save, FileText, Printer, Database, Download, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import { getSupertoken } from '@/helpers/AccessToken';
import axios from 'axios';
import { ApiUrl } from '@/helpers/ApiUrl';

const ReportGenerator = () => {
  const [report, setReport] = useState({
    reportBody: "",
      reportDate: new Date().toISOString().split('T')[0] ,
            reportType: "",
            reportTitle: "",

  });
  const [status, setStatus] = useState('idle'); // idle, saving, saved, error
  const [savedReports, setSavedReports] = useState([]);
  const[reportEnum, setReportEnum] = useState([])
  const usertoken = getSupertoken()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport(prev => ({ ...prev, [name]: value }));
  };


  useEffect(() => {

    const fetchData = async() => {
        
        try {

            const response = await axios.get(`${ApiUrl}/inspector_get_report_type_enum`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })

            setReportEnum(response.data.reportEnum)
            
        } catch (error) {
            console.log(`failed to get enums. Error: ${error}`)
        }

    }

    fetchData()


  }, [usertoken])

  const saveToDatabase = async () => {
    
    setStatus('saving');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await axios.post(`${ApiUrl}/inspector_create_report`, report, {
        headers: {
            Authorization: `Bearer ${usertoken}`
        }
      })
      
      
      const newReport = { ...report, id: Date.now() };
      setSavedReports(prev => [...prev, newReport]);
      
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const generatePDF = () => {
    
    const doc = new jsPDF();
    

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineHeight = 7;
    let yPosition = 20;
    
    
    doc.setFontSize(18);
    doc.text(report.reportTitle, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
    
    
    doc.setFontSize(11);
    doc.text(`Type: ${report.reportType.charAt(0).toUpperCase() + report.reportType.slice(1)}`, margin, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Date: ${new Date(report.reportDate).toLocaleDateString()}`, margin, yPosition);
    yPosition += lineHeight * 2;
    
    
    doc.setFontSize(12);
    

    const contentWidth = pageWidth - (margin * 2);
    const splitContent = doc.splitTextToSize(report.reportBody, contentWidth);
    
    
    if (yPosition + (splitContent.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(splitContent, margin, yPosition);
    
    // Save the PDF
    doc.save(`${report.reportTitle.replace(/\s+/g, '_')}_report.pdf`);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Report Generator</h1>
      
      {status === 'saved' && (
        <Alert variant="success" className="d-flex align-items-center">
          <Check size={18} className="me-2" /> Report saved successfully!
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert variant="danger">Failed to save report. Please try again.</Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Create New Report</h4>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Report Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="reportTitle"
                    value={report.reportTitle}
                    onChange={handleInputChange}
                    placeholder="Enter report title"
                  />
                </Form.Group>
                
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Report Type</Form.Label>
                      <Form.Select
                        name="reportType"
                        value={report.reportType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Report Type</option>

                        {reportEnum?.map((element, index) => (
    <option key={index} value={element}>
      {element}
                      </option>
                    ))}
                        
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="reportDate"
                        value={report.reportDate}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Report Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="reportBody"
                    value={report.reportBody}
                    onChange={handleInputChange}
                    rows={10}
                    placeholder="Enter your report content here..."
                  />
                </Form.Group>
              </Form>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-end">
              <Button 
                variant="primary" 
                className="me-2 d-flex align-items-center"
                onClick={saveToDatabase}
                disabled={status === 'saving'}
              >
                {status === 'saving' ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Database size={16} className="me-2" />
                    Save to Database
                  </>
                )}
              </Button>
              <Button 
                variant="success" 
                className="d-flex align-items-center"
                onClick={generatePDF}
                disabled={!report.reportTitle || !report.reportBody}
              >
                <Printer size={16} className="me-2" />
                Generate PDF
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header>
              <h4>Saved Reports</h4>
            </Card.Header>
            <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {savedReports.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedReports.map(savedReport => (
                      <tr key={savedReport.id}>
                        <td>{savedReport.title}</td>
                        <td>{savedReport.type}</td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            className="me-1"
                            onClick={() => setReport(savedReport)}
                          >
                            <FileText size={14} />
                          </Button>
                           <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => {
                              setReport(savedReport);
                              generatePDF();
                            }}
                          >
                            <Download size={14} />
                          </Button> 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No reports saved yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportGenerator;