import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Space, message } from 'antd';
import { CameraOutlined, CheckOutlined, RedoOutlined, StopOutlined } from '@ant-design/icons';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
  visible: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
  visible
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  
  const [streaming, setStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const width = 320;
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (visible) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setStreaming(false);
    }
    
    return () => {
      stopCamera();
    };
  }, [visible]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use rear camera if available
        }, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      message.error('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCanPlay = () => {
    if (!streaming && videoRef.current) {
      const video = videoRef.current;
      const calculatedHeight = video.videoHeight / (video.videoWidth / width);
      
      setHeight(calculatedHeight);
      
      video.setAttribute('width', width.toString());
      video.setAttribute('height', calculatedHeight.toString());
      
      if (canvasRef.current) {
        canvasRef.current.setAttribute('width', width.toString());
        canvasRef.current.setAttribute('height', calculatedHeight.toString());
      }
      
      setStreaming(true);
    }
  };

  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (width && height && context) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      
      if (photoRef.current) {
        photoRef.current.src = dataUrl;
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;
    
    // Convert canvas to blob and then to file
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleCancel = () => {
    stopCamera();
    setCapturedImage(null);
    onCancel();
  };

  return (
    <Modal
      title="Camera Capture"
      open={visible}
      onCancel={handleCancel}
      width={400}
      footer={null}
      destroyOnClose
    >
      <div style={{ textAlign: 'center' }}>
        {/* Video Preview */}
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <video
            ref={videoRef}
            onCanPlay={handleCanPlay}
            style={{
              width: '100%',
              maxWidth: width,
              height: 'auto',
              backgroundColor: '#000',
              borderRadius: 8,
              display: capturedImage ? 'none' : 'block'
            }}
            playsInline
          />
          
          {/* Captured Image Preview */}
          {capturedImage && (
            <img
              ref={photoRef}
              src={capturedImage}
              alt="Captured"
              style={{
                width: '100%',
                maxWidth: width,
                height: 'auto',
                borderRadius: 8,
                border: '2px solid #52c41a'
              }}
            />
          )}
        </div>

        {/* Hidden Canvas for Image Capture */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Controls */}
        <Space size="middle">
          {!capturedImage ? (
            <>
              <Button
                type="primary"
                size="large"
                icon={<CameraOutlined />}
                onClick={takePicture}
                disabled={!streaming}
              >
                Capture
              </Button>
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                size="large"
                icon={<CheckOutlined />}
                onClick={confirmCapture}
              >
                Use Photo
              </Button>
              <Button
                size="large"
                icon={<RedoOutlined />}
                onClick={retakePicture}
              >
                Retake
              </Button>
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Space>

        {!streaming && !capturedImage && (
          <div style={{ marginTop: 16, color: '#666' }}>
            Initializing camera...
          </div>
        )}
      </div>
    </Modal>
  );
}; 