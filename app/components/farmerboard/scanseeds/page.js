"use client"
import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap'
import { Camera, ScanBarcode, RefreshCcw, Smartphone, ShoppingCart } from 'lucide-react'
import { ApiUrl } from '@/helpers/ApiUrl'
import Quagga from '@ericblade/quagga2'
import { getSupertoken } from '@/helpers/AccessToken'
import { addItem } from '@/helpers/CartHelpers'



export default function ScanSeeds() {

  const [redirect, setRedirect] = useState(false);
  const [hasPermission, setHasPermission] = useState(null)
  const [scannedData, setScannedData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [productData, setProductData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scannerStatus, setScannerStatus] = useState("idle")
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [cameras, setCameras] = useState([])
  const [facingMode, setFacingMode] = useState("environment")

  const usertoken = getSupertoken()
  const scannerRef = useRef(null)

  useEffect(() => {
    checkCameraPermission()

    return () => {
      if (Quagga) {
        try {
          Quagga.stop()
        } catch (err) {
          console.error("Error stopping Quagga:", err)
        }
      }
    }
  }, [])

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      setHasPermission(true)

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === 'videoinput')
      setCameras(videoDevices)

      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId)
      }

      stream.getTracks().forEach((track) => track.stop())
    } catch (err) {
      console.error("Camera permission error:", err)
      setHasPermission(false)
      setError("Camera access denied. Please grant permission to use the scanner.")
    }
  }

  const fetchProductDetails = async (barcode) => {
    setIsLoading(true)
    setProductData(null)
    setError(null)

    try {
      const response = await fetch(`${ApiUrl}/get_seed_details?batchName=${encodeURIComponent(barcode)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`
        }
      })
      if (!response.ok) throw new Error('Product not found')

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
    // Toggle between front and back camera
    const newFacingMode = facingMode === "environment" ? "user" : "environment"
    setFacingMode(newFacingMode)
    
    // If already scanning, restart the scanner with the new camera
    if (isScanning) {
      stopScanning(false)
      setTimeout(() => startScanning(), 300)
    }
  }

  const startScanning = () => {
    if (!hasPermission) return setError("Camera permission not granted")

    stopScanning(false)
    setIsScanning(true)
    setError(null)
    setScannerStatus("starting")

    setTimeout(() => {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: facingMode // Use the current facingMode state
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: 2,
          frequency: 10,
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader", 
              "upc_reader",
              "upc_e_reader",
              "i2of5_reader"
            ],
          },
          locate: true
        },
        (err) => {
          if (err) {
            console.error("Quagga init error:", err)
            setError("Scanner error: " + err)
            setScannerStatus("error")
            setIsScanning(false)
            return
          }

          Quagga.start()
          setScannerStatus("running")

          Quagga.onProcessed((result) => {
            const drawingCtx = Quagga.canvas.ctx.overlay;
            const drawingCanvas = Quagga.canvas.dom.overlay;
          
            if (result) {
              if (result.boxes) {
                drawingCtx.clearRect(
                  0, 0, 
                  parseInt(drawingCanvas.getAttribute("width")), 
                  parseInt(drawingCanvas.getAttribute("height"))
                );
                result.boxes.filter(box => box !== result.box).forEach(box => {
                  Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
              }
          
              if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
              }
          
              if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
              }
            }
          });

          Quagga.onDetected((data) => {
            const code = data.codeResult.code
            console.log("Detected code:", code)
            stopScanning()
            setScannedData(code)
            fetchProductDetails(code)
          })
        }
      )
    }, 300)
  }

  const stopScanning = (resetUI = true) => {
    if (Quagga) {
      Quagga.offDetected()
      Quagga.stop()
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
      return (window.location.href="/components/farmerboard/cart"  );
    }
  };



  

  return (
    <Container className="py-4">
             {shouldRedirect(redirect)}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-center mb-4">
            <ScanBarcode size={24} className="text-primary me-2" />
            <h5 className="mb-0">Scan Seed Barcode (Rotate Your Phone For Better Scanning)</h5>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          
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

          <div 
            ref={scannerRef} 
            style={{ 
              width: '100%', 
              height: '400px', 
              marginTop: '1rem',
              position: 'relative',
              overflow: 'hidden'
            }} 
          />

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
              <h6 className="mt-3">Batch Info</h6>
              <p><strong>Batch Name:</strong> {productData.batchDetail.batchName}</p>
              <p><strong>Made At:</strong> {productData.batchDetail.batchMadeAt}</p>
              <p><strong>Manufactured:</strong> {new Date(productData.batchDetail.batchManufactured).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className={`badge ${productData.batchDetail.batchStatus === 'active' ? 'bg-success' : 'bg-secondary'}`}>{productData.batchDetail.batchStatus}</span></p>
           
           <div  style={{marginTop: "15px"}}>
              
              
              <button className='btn btn-warning' onClick={() =>
              {
                addItem(productData.batchDetail, () => {
                  setRedirect(true);

                })
              }



              }><ShoppingCart size={18} className="me-1"  /> Add To Cart </button>

           </div>
           
            </div>
          )}

          {scannedData && !productData && !isLoading && (
            <div className="mt-4 alert alert-warning">No product data found for scanned code: {scannedData}</div>
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