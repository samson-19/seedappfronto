'use client'

import React, { useEffect, useState } from 'react'
import { Spinner, Table, Button, Modal, Form } from 'react-bootstrap'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import axios from 'axios'
import Link from 'next/link'

export default function ListSeedsToOwner() {
    const [mySeeds, setMySeeds] = useState([])
    const [loading, setLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedSeed, setSelectedSeed] = useState(null)
    const [editForm, setEditForm] = useState({
        seedName: '',
        seedManufacturer: '',
        seedType: ''
    })

    const [loadingbtn, setLoadingbtn] = useState(false);

    const usertoken = getSupertoken()

    useEffect(() => {

        const fetchSeeds = async() => {
            setLoading(true)
            try {
                const response = await axios.get(`${ApiUrl}/supplier_view_products`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                })
    
                setMySeeds(response.data.mySeeds)
                setLoading(false)
            } catch (error) {
                console.log(`There was a problem: Error ${error}`)
                setLoading(false)
            }
        }
    

        fetchSeeds()
    }, [usertoken])

   
    const handleDelete = async() => {
        try {
            await axios.delete(`${ApiUrl}/supplier_erase_seed_and_batch/${selectedSeed._id}`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
            
            
            setMySeeds(mySeeds.filter(seed => seed.id !== selectedSeed.id))
            setShowDeleteModal(false)
        } catch (error) {
            console.log(`Delete failed: ${error}`)
        }
    }

    const handleEditSubmit = async() => {
        setLoadingbtn(true);
        try {
            await axios.put(`${ApiUrl}/update_seed_data/${selectedSeed._id}`, editForm, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
            
            
            setMySeeds(mySeeds.map(seed => 
                seed.id === selectedSeed.id ? {...seed, ...editForm} : seed
            ))
        
            setShowEditModal(false)

            
        } catch (error) {
            console.log(`Update failed: ${error}`)
        } finally{
            setLoadingbtn(false);
        }
    }

    const openDeleteModal = (seed) => {
        setSelectedSeed(seed)
        setShowDeleteModal(true)
    }

    const openEditModal = (seed) => {
        setSelectedSeed(seed)
        setEditForm({
            seedName: seed.seedName,
            seedManufacturer: seed.seedManufacturer,
            seedType: seed.seedType
        })
        setShowEditModal(true)
    }

    return (
        <div className="container mt-4">
            <h2>My Seeds</h2>
            <p>Select Seed To Add New Batch</p>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Seed Name</th>
                            <th>Manufacturer</th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mySeeds.length > 0 ? (
                            mySeeds.map((seed, index) => (
                                <tr key={seed._id}>
                                    <td>{index + 1}</td>
                                    <td> <Link href={`/components/supplierboard/add-batch/${seed._id}`}>{seed.seedName}</Link> </td>
                                    <td>{seed.seedManufacturer}</td>
                                    <td>{seed.seedType}</td>
                                    <td>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => openEditModal(seed)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => openDeleteModal(seed)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No seeds found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {selectedSeed?.seedName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Seed Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Seed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Seed Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editForm.seedName}
                                onChange={(e) => setEditForm({...editForm, seedName: e.target.value})}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Seed Manufacturer</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editForm.seedManufacturer}
                                onChange={(e) => setEditForm({...editForm, seedManufacturer: e.target.value})}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Seed Type</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editForm.seedType}
                                onChange={(e) => setEditForm({...editForm, seedType: e.target.value})}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit} disabled={loadingbtn}>
                         {loadingbtn ? (
                                                                <>
                                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                                    <span className="ms-2">Updating data...</span>
                                                                </>
                                                            ) : (
                                                                "Submit Changes"
                                                            )}
                        
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}