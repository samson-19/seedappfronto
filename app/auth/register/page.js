'use client'



import { userRegister } from "@/redux/actions/userAuthAction";
import Link from "next/link";
import { useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";


export default function Register() {
    const mssg = useSelector((state) => state.userRdcr.mssg)

const[formData, setFormData] = useState({
  email: "", password: "", first_name: "", last_name: ""
})

const [loading, setLoading] = useState(false);


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
      
      await dispatch(userRegister(formData))
    } finally {
      setLoading(false);
    }
  }
  


return (
    <Container style={{marginTop: "2rem"}}>
    <Row className="justify-content-md-center">

    <Col xs={12} md={6}>
  <h3 className='text-center'> Welcome!</h3>
  <div className="text-center text-danger">

  {mssg && ( <h3>{mssg}</h3>)}

  </div>
  
  <Form onSubmit={handleSubmit}>

  <Form.Group className="mb-3" controlId="formBasicFirstName">
      <Form.Label>First Name</Form.Label>
      <Form.Control
        type="text"
        name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            
        
        placeholder="write your first name"
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicLastName">
      <Form.Label>Last Name</Form.Label>
      <Form.Control
        type="text"
        name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            
        
        placeholder="write your last name"
      />
    </Form.Group>




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

    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>enter your password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
        
      
      />
    </Form.Group>

    <Button variant="danger" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Loading...</span>
                  </>
                ) : (
                  "Register"
                )}
              </Button>
  
    
  </Form>

  <div style={{marginTop: 12, marginBottom: 20}}>

    <p>Have an account? <Link href="/auth/login">Login</Link> </p>


  </div>
  
</Col>
</Row>   
</Container>

  );
}
