"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { Camera, QrCode, RefreshCcw, Smartphone, ShoppingCart } from 'lucide-react'
import { ApiUrl } from '@/helpers/ApiUrl'
import { getSupertoken } from '@/helpers/AccessToken'
import { addItem } from '@/helpers/CartHelpers'


import QrScanner from 'qr-scanner'

export default function ScanQRCodes() {
  const [redirect, setRedirect] = useState(false);
  const [hasPermission, setHasPermission] = useState(null)
  const [scannedData, setScannedData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [productData, setProductData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scannerStatus, setScannerStatus] = useState("idle")
  const [facingMode, setFacingMode] = useState("environment")

  const usertoken = getSupertoken()
  const videoRef = useRef(null)
  const qrScannerRef = useRef(null)

  useEffect(() => {
    checkCameraPermission()

    return () => {
      if (qrScannerRef.current) {
        try {
          qrScannerRef.current.stop()
          qrScannerRef.current.destroy()
        } catch (err) {
          console.error("Error stopping QR scanner:", err)
        }
      }
    }
  }, [])

  const checkCameraPermission = async () => {
    // Check if page is served over HTTPS (or localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setHasPermission(false)
      setError("Camera access requires HTTPS. Please use HTTPS or access via localhost for development.")
      return
    }

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false)
      setError("Camera API not supported in this browser. Please use a modern browser.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      setHasPermission(true)
      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      console.error("Camera permission error:", err)
      setHasPermission(false)
      
      // More specific error messages
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please grant permission to use the scanner.")
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device.")
      } else if (err.name === 'NotSupportedError') {
        setError("Camera not supported on this device.")
      } else {
        setError(`Camera error: ${err.message}. Make sure you're using HTTPS.`)
      }
    }
  }

  const fetchProductDetails = async (qrData) => {
    setIsLoading(true)
    setProductData(null)
    setError(null)

    try {
      const response = await fetch(`${ApiUrl}/scan_qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`
        },
        body: JSON.stringify({ qrData })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || 'Product not found')
      }

      const data = await response.json()
      setProductData(data)
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err.message || 'Failed to fetch product details')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCamera = () => {
    const newFacingMode = facingMode === "environment" ? "user" : "environment"
    setFacingMode(newFacingMode)
    
    if (isScanning) {
      stopScanning(false)
      setTimeout(() => startScanning(), 300)
    }
  }

  const startScanning = async () => {
    if (!hasPermission) return setError("Camera permission not granted")

    stopScanning(false)
    setIsScanning(true)
    setError(null)
    setScannerStatus("starting")

    try {
      // Initialize QR Scanner with optimized settings
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR Code detected:", result.data)
          stopScanning()
          setScannedData(result.data)
          fetchProductDetails(result.data)
        },
        {
          onDecodeError: (err) => {
            // Don't log every decode error as it's normal during scanning
          },
          preferredCamera: facingMode,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 10, // Increased scan rate
          calculateScanRegion: (video) => {
            // Create a smaller scan region in the center for better performance
            const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
            const scanSize = Math.round(0.6 * smallerDimension);
            return {
              x: Math.round((video.videoWidth - scanSize) / 2),
              y: Math.round((video.videoHeight - scanSize) / 2),
              width: scanSize,
              height: scanSize,
            };
          },
          // More aggressive scanning options
          returnDetailedScanResult: true,
        }
      )

      await qrScannerRef.current.start()
      setScannerStatus("running")
      
      // Add a status message to help users
      setTimeout(() => {
        if (isScanning && !scannedData) {
          console.log("Still scanning... Make sure QR code is clearly visible and well-lit")
        }
      }, 5000)
      
    } catch (err) {
      console.error("QR Scanner error:", err)
      setError("Scanner error: " + (err.message || err))
      setScannerStatus("error")
      setIsScanning(false)
    }
  }

  const stopScanning = (resetUI = true) => {
    if (qrScannerRef.current) {
      try {
        qrScannerRef.current.stop()
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
    }
    
    if (resetUI) {
      setIsScanning(false)
      setScannerStatus("idle")
    }
  }

  const resetScan = () => {
    setScannedData(null)
    setProductData(null)
    setError(null)
    setScannerStatus("idle")
  }

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return (window.location.href = "/components/farmerboard/cart");
    }
  };

  return (
    <Container className="py-4">
      {shouldRedirect(redirect)}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center mb-4">
            <QrCode size={24} className="text-primary me-2" />
            <h5 className="mb-0">Scan QR Code (Rotate Your Phone For Better Scanning)</h5>
          </div>

          {error && (
            <Alert variant="danger">
              <div>{error}</div>
              {(location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') && (
                <div className="mt-2">
                  <strong>Solutions:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Deploy your app with HTTPS</li>
                    <li>For development: Use <code>localhost</code> instead of your IP address</li>
                    <li>For development: Use <code>next dev --experimental-https</code></li>
                  </ul>
                </div>
              )}
            </Alert>
          )}
          
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              {!isScanning && (
                <Button onClick={startScanning} variant="primary">
                  <Camera className="me-2" size={18} /> Start Scanning
                </Button>
              )}

              {isScanning && (
                <Button onClick={stopScanning} variant="secondary">
                  <RefreshCcw className="me-2" size={18} /> Stop Scanning
                </Button>
              )}
            </div>
            
            <Button 
              onClick={toggleCamera} 
              variant="outline-secondary" 
              title={facingMode === "environment" ? "Using back camera (tap to switch)" : "Using front camera (tap to switch)"}
            >
              <Smartphone size={18} className="me-1" />
              {facingMode === "environment" ? "Back" : "Front"}
            </Button>
          </div>

          <div style={{ position: 'relative' }}>
            <video 
              ref={videoRef}
              style={{ 
                width: '100%', 
                height: '400px', 
                marginTop: '1rem',
                borderRadius: '8px',
                backgroundColor: '#000',
                objectFit: 'cover'
              }}
            />
            
            {scannerStatus === "running" && !scannedData && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid #007bff',
                borderRadius: '8px',
                width: '200px',
                height: '200px',
                pointerEvents: 'none',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap'
                }}>
                  Align QR code here
                </div>
              </div>
            )}
          </div>

          {scannerStatus === "starting" && (
            <div className="text-center py-2">
              <Spinner animation="border" size="sm" />
              <small className="ms-2">Starting scanner...</small>
            </div>
          )}

          {scannerStatus === "running" && !scannedData && (
            <div className="text-center py-2">
              <div className="alert alert-info">
                <strong>📱 Scanning Tips:</strong>
                <ul className="list-unstyled mb-0 mt-2">
                  <li>• Hold phone steady, 6-12 inches from QR code</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep QR code flat and fully visible</li>
                  <li>• Try different angles if not detecting</li>
                </ul>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Fetching product details...</p>
            </div>
          )}

          {productData && (
            <div className="mt-4">
              <h5>Seed Details</h5>
              <p><strong>Seed Name:</strong> {productData.seedName}</p>
              <p><strong>Manufacturer:</strong> {productData.seedManufacturer}</p>
              <p><strong>Type:</strong> {productData.seedType}</p>
              <p><strong>Description:</strong> {productData.seedDescription}</p>
              
              <h6 className="mt-3">Batch Info</h6>
              <p><strong>Batch Name:</strong> {productData.batchDetail.batchName}</p>
              <p><strong>Made At:</strong> {productData.batchDetail.batchMadeAt}</p>
              <p><strong>Manufactured:</strong> {new Date(productData.batchDetail.batchManufactured).toLocaleDateString()}</p>
              <p><strong>Expires:</strong> {new Date(productData.batchDetail.batchExpireDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`badge ${productData.batchDetail.batchStatus === 'approved' ? 'bg-success' : 'bg-secondary'}`}>{productData.batchDetail.batchStatus}</span></p>
              <p><strong>Verification:</strong> <span className="badge bg-success">{productData.verificationStatus}</span></p>
              <p><strong>Scanned At:</strong> {new Date(productData.scannedAt).toLocaleString()}</p>
           
              <div style={{marginTop: "15px"}}>
                <button 
                  className='btn btn-warning' 
                  onClick={() => {
                    addItem(productData.batchDetail, () => {
                      setRedirect(true);
                    })
                  }}
                >
                  <ShoppingCart size={18} className="me-1" /> Add To Cart 
                </button>
              </div>
            </div>
          )}

          {scannedData && !productData && !isLoading && (
            <div className="mt-4 alert alert-warning">
              No product data found for scanned QR code: {scannedData}
            </div>
          )}

          {scannedData && (
            <Button onClick={resetScan} className="mt-3" variant="outline-primary">
              Scan Another
            </Button>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}