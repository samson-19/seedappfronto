'use client'

import { userResetPassword } from "@/redux/actions/userAuthAction";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";


export default function ResetPassword() {
    const params = useParams()
    const usertoken = params.token
    const mssg = useSelector((state) => state.userRdcr.mssg)

  const [loading, setLoading] = useState(false);
const[formData, setFormData] = useState({
  password: ""
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
          
          await dispatch(userResetPassword(formData, usertoken))

        } finally {
          setLoading(false);
        }
    
    

  }
  return (
    <Container style={{marginTop: "2rem"}}>
    <Row className="justify-content-md-center">

    <Col xs={12} md={6}>
  <h3 className='text-center'>new password!</h3>

  <div className="text-center text-danger">

  {mssg && ( <h4>{mssg}</h4>)}

  </div>
  

  <Form onSubmit={handleSubmit}>
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
                  "Submit"
                )}
              </Button>


  </Form>
  
</Col>
</Row>   
</Container>

  );
}
