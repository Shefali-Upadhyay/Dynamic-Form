import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function Selfie({ field, value, onChange, error }) {
  const webcamRef = useRef(null);
  const [usingCam, setUsingCam] = useState(true);
  const [preview, setPreview] = useState(value || null);

  const capture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);
    onChange(imageSrc);
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="field">
      <label>
        {field.label}
        {field.required ? " *" : ""}
      </label>
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setUsingCam((s) => !s)}
          className="btn secondary"
        >
          {usingCam ? "Use file upload" : "Use webcam"}
        </button>
      </div>

      {usingCam ? (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
          />
          <div style={{ marginTop: 8 }}>
            <button type="button" onClick={capture} className="btn">
              Capture
            </button>
          </div>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>
      )}

      {preview && (
        <div style={{ marginTop: 12 }}>
          <div>Preview:</div>
          <img src={preview} alt="selfie" className="preview-img" />
          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onChange("");
              }}
              className="btn secondary"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
