'use client'
import { getSupertoken } from '@/helpers/AccessToken'
import { ApiUrl } from '@/helpers/ApiUrl'
import { userGet } from '@/redux/actions/userAuthAction'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { Pen } from 'lucide-react'
import Link from 'next/link'


export default function MyDetails() {
    const user = useSelector((state) => state.userRdcr.user)
    const [inspectorDetails, setInspectorDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const usertoken = getSupertoken()
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true)
            try {
                await dispatch(userGet())
                
                if (user?.role === 'inspector') {
                    const response = await axios.get(`${ApiUrl}/inspector_get_info`, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`
                        }
                    })
                    setInspectorDetails(response.data.myInfo)
                }
            } catch (error) {
                console.log(`There was a problem while fetching the details:`, error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [dispatch, user?.role, usertoken])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Details</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* User photo - fixed size */}
                    <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        {user?.userPhoto ? (
                            <img 
                                src={user.userPhoto} 
                                alt="Profile Photo" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                <span className="text-gray-400 text-2xl">
                                    {user?.fullname?.charAt(0).toUpperCase() || '?'}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold">{user?.fullname || 'N/A'}</h2>
                        <p className="text-gray-600 mb-2">{user?.email || 'N/A'}</p>
                        
                    </div>
                </div>
            </div>
            
            {/* Supplier-specific details */}
            {user?.role === 'inspector' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Inspector Information</h3>
                    
                    <div className="grid grid-cols-1 gap-6">
                        
                        <div>
                            <p className="text-gray-600 mb-2">Inspector License</p>
                            <div className="border rounded-lg p-2">
                                {inspectorDetails?.inspectorIdentification ? (
                                    <div className="flex justify-center">
                                        <div>
                                        <p className="font-semibold ">     

<Link href={`/components/inspectorboard/mydetails/${inspectorDetails?._id}`}>

<Pen size={24} className="text-primary mb-2" />
update licence photo
 </Link>                

 
</p>
                                            
                                            
                                             </div>
                                        <img 
                                            src={inspectorDetails?.inspectorIdentification} 
                                            alt="Inspector License" 
                                            className="max-h-64 object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                                        <p className="text-gray-400">No license document available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}