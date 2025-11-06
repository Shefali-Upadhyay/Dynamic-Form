import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateField } from '../features/form/formSlice';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const SelfieCapture = ({ field, value, error }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const [preview, setPreview] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState(null);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(streamObj => {
        setStream(streamObj);
        if (videoRef.current) {
          videoRef.current.srcObject = streamObj;
        }
      })
      .catch(err => {
        console.error("Camera access denied:", err);
        setCameraError("Unable to access camera. Please check permissions or use a supported device.");
      });
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const compressImage = (base64, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  const captureSelfie = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      // compressImage(imageData);
      const compressedImage = await compressImage(imageData);
      setPreview(compressedImage);
      dispatch(updateField({ id: field.id, value: compressedImage }));
      stopCamera(); // Stop camera after capture
    }
  };

  const retakeSelfie = () => {
    setPreview(null);
    startCamera(); // Restart camera for retake
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError('File size exceeds 2MB.');
        return;
      }
      setUploadError('');
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressedImage = await compressImage(reader.result);
        setPreview(compressedImage);
        dispatch(updateField({ id: field.id, value: compressedImage }));
        stopCamera(); // Stop camera if running
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label>{field.label}</label><br />
      {cameraError ? (
        <span style={{ color: 'red' }}>{cameraError}</span>
      ) : (
        <>
          {!preview && (
            <>
              <video ref={videoRef} autoPlay style={{ width: '250px', height: '200px' }} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button type="button" onClick={captureSelfie}>Take Selfie</button>
              <p>OR</p>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
            </>
          )}
        </>
      )}
      {preview && (
        <div>
          <p>Preview:</p>
          <img src={preview} alt="Selfie preview" style={{ width: '150px', height: '150px' }} />
          <br />
          <button type="button" onClick={retakeSelfie}>Re-take Selfie</button>
        </div>
      )}
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
};

export default SelfieCapture;
