// DynamicStudentForm.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import schema from '../data/student_form_schema.json';
import TextInput from './TextInput';
import SelectBox from './SelectBox';
import TextArea from './TextArea';
import SelfieCapture from './SelfieCapture';
import { submitForm, setFormData } from '../features/form/formSlice';
import QuitModal from './QuitModal';
import RadioGroup from './RadioGroup';

const stages = ['studentDetails', 'personalDetails', 'selfie', 'taxInformation', 'review'];

const generateStudentId = () => {
  return 'SID-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

const DynamicStudentForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = useSelector(state => state.form.fields);
  const [errors, setErrors] = useState({});
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const currentStage = stages[currentStageIndex];
  const stageFields = schema.filter(field => field.stageId === currentStage);

  
const [showModal, setShowModal] = useState(false);

  const handleQuit = () => {
    setShowModal(true);
  };

  const handleConfirmQuit = () => {
    setShowModal(false);
    // Logic to quit application (e.g., redirect or clear data)
    console.log('Application quit confirmed');
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let studentId = params.get('studentId');
    const stageId = params.get('stageId');

    if (!studentId) {
      studentId = generateStudentId();
      params.set('studentId', studentId);
      navigate({ search: params.toString() }, { replace: true });
    }

    const savedData = localStorage.getItem(`formData-${studentId}`);
    const savedStage = stageId || localStorage.getItem(`formStage-${studentId}`);

    if (savedData) {
      dispatch(setFormData(JSON.parse(savedData)));
    } else {
      dispatch(setFormData({ studentId }));
    }

    if (savedStage) {
      const index = stages.indexOf(savedStage);
      if (index !== -1) {
        setCurrentStageIndex(index);
      }
    }
  }, [location.search, dispatch, navigate]);

  useEffect(() => {
    if (formData.studentId) {
      localStorage.setItem(`formData-${formData.studentId}`, JSON.stringify(formData));
      localStorage.setItem(`formStage-${formData.studentId}`, currentStage);

      const params = new URLSearchParams();
      params.set('studentId', formData.studentId);
      params.set('stageId', currentStage);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [formData, currentStage, navigate]);

  const validateField = (field, value) => {
    const { required, minLength, maxLength, validation } = field;
    if (required && !value) return `${field.label} is required`;
    if (minLength && value.length < minLength) return `${field.label} must be at least ${minLength} characters`;
    if (maxLength && value.length > maxLength) return `${field.label} must be at most ${maxLength} characters`;
    if (validation?.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) return validation.message;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentStage === 'review') {
      dispatch(submitForm());
      onSubmit?.(formData);
      localStorage.removeItem(`formData-${formData.studentId}`);
      localStorage.removeItem(`formStage-${formData.studentId}`);
      return;
    }

    const newErrors = {};
    stageFields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      if (error) newErrors[field.id] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    if (field.id === 'studentId') {
      return (
        <div key={field.id} style={{ marginBottom: '16px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>{field.label}</label>
          <div style={{
            backgroundColor: '#f1f1f1',
            padding: '8px 12px',
            borderRadius: '6px',
            color: '#333',
            marginTop: '4px'
          }}>{value}</div>
        </div>
      );
    }

    switch (field.componentType) {
      case 'select':
        return <SelectBox key={field.id} field={field} value={value} error={error} />;
      case 'textarea':
        return <TextArea key={field.id} field={field} value={value} error={error} />;
      case 'selfie':
        return <SelfieCapture key={field.id} field={field} value={value} error={error} />;
      case 'radio':
         return <RadioGroup key={field.id} field={field} value={value} error={error} />;  
      default:
        return <TextInput key={field.id} field={field} value={value} error={error} />;
    }
  };

  const renderReview = () => {
    const groupedFields = stages.slice(0, 4).map(stageId => ({
      stageId,
      fields: schema.filter(field => field.stageId === stageId),
    }));

    const getStageTitle = (id) => {
      switch (id) {
        case 'studentDetails': return '👩‍🎓 Student Details';
        case 'personalDetails': return '🏠 Personal Details';
        case 'selfie': return '📸 Selfie';
        case 'taxInformation' :return '💰 Tax Information';
        default: return '';
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Review Your Information</h2>

        <div style={{
          backgroundColor: '#e9f5ff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontWeight: 'bold',
          color: '#004085',
          border: '1px solid #b8daff',
          textAlign: 'center'
        }}>
          Student ID: {formData.studentId || '-'}
        </div>

        {groupedFields.map(group => (
          <div
            key={group.stageId}
            style={{
              border: '1px solid #ddd',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <h3 style={{
              marginBottom: '16px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px',
              color: '#333'
            }}>
              {getStageTitle(group.stageId)}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {group.fields.map(field => {
                const value = formData[field.id];
                return (
                  <div key={field.id}>
                    <label style={{ fontWeight: '600', color: '#555' }}>{field.label}</label>
                    <div style={{ marginTop: '4px' }}>
                      {typeof value === 'string' && value.startsWith('data:image') ? (
                        <img
                          src={value}
                          alt={field.label}
                          style={{
                            width: '100%',
                            maxWidth: '200px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid #ccc'
                          }}
                        />
                      ) : (
                        <div style={{
                          backgroundColor: '#f1f1f1',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          color: '#333'
                        }}>
                          {value || '-'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
    
      
{currentStage === 'taxInformation' && (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2>Share with us your tax information.</h2>
    <span onClick={handleQuit} style={{ fontSize: '20px', border: 'none', background: 'transparent', cursor: 'pointer' }}>X</span>
  </div>
)}


    <form onSubmit={handleSubmit}>
      {currentStage === 'review' ? (
    renderReview()
  ) : (
    <>
      {currentStage === 'studentDetails' ? (
    <>
    {/* Group all four fields in one line */}
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {/* First Name */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {renderField(stageFields.find(f => f.id === 'firstname'))}
      </div>

      {/* Last Name */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {renderField(stageFields.find(f => f.id === 'lastname'))}
      </div>

      {/* Email */}
      <div style={{ flex: 1, minWidth: '200px' }}>
        {renderField(stageFields.find(f => f.id === 'email'))}
      </div>

      {/* Country Code + Phone Number */}
      <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
        <div style={{ flex: 1 }}>
          {renderField(stageFields.find(f => f.id === 'phoneCountry'))}
        </div>
        <div style={{ flex: 2 }}>
          {renderField(stageFields.find(f => f.id === 'number'))}
        </div>
      </div>
    </div>

    {/* Render remaining studentDetails fields */}
    {stageFields
      .filter(f =>
        !['firstname', 'lastname', 'email', 'phoneCountry', 'number'].includes(f.id)
      )
      .map(renderField)}
  </>
) : (
  stageFields.map(renderField)
)}
 </>

    
  )}


      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        {currentStageIndex > 0 && (
          <button
            type="button"
            onClick={() => setCurrentStageIndex(currentStageIndex - 1)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f800ff',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
        )}
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {currentStageIndex < stages.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
      
      {/* <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={handleQuit}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Quit
          </button>
        </div> */}

    </form>
    
   
<QuitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmQuit}
      />
</>
  );
};

export default DynamicStudentForm;


import React from 'react';
import DynamicStudentForm from './Components/DynamicStudentForm';
// import DynamicStudentForm_updated from './Components/DynamicStudentForm_updated';
import { Route, Routes } from 'react-router-dom';

function App() {
  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
    alert('Form submitted successfully!');
  };

  return (
    <div className="App">
      {/* <h1>Student Registration</h1> */}
      {/* <DynamicStudentForm onSubmit={handleFormSubmit} /> */}
      
      <Routes>
            <Route path="/form" element={<DynamicStudentForm  onSubmit={handleFormSubmit} />} />
            {/* <Route path="/form" element={<DynamicStudentForm_updated  onSubmit={handleFormSubmit} />} /> */}
      </Routes>
    </div>
  );
}

export default App;
