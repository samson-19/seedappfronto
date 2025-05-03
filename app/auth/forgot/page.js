'use client'

import { userForgotPassword } from "@/redux/actions/userAuthAction";
import Link from "next/link";
import { useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";


export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
const[formData, setFormData] = useState({
  email: ""
})

const dispatch = useDispatch()


const handleInputChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};



  const handleSubmit = async(event) => {

    event.preventDefault()
        setLoading(true);
        try {
          
          await dispatch(userForgotPassword(formData))

        } finally {
          setLoading(false);
        }
    
    

  }
  return (
    <Container style={{marginTop: "2rem"}}>
    <Row className="justify-content-md-center">

    <Col xs={12} md={6}>
  <h3 className='text-center'>Write your email to reset your password!</h3>

  <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3" controlId="formBasicEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="text"
        name="email"
            value={formData.email}
            onChange={handleInputChange}
            
        
        placeholder="write email"
      />
    </Form.Group>

    
    <Button variant="danger" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>


  </Form>
  
</Col>
</Row>   
</Container>

  );
}
