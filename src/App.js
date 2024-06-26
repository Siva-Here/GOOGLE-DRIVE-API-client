import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [billFile, setBillFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    setBillFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!billFile) {
      setErrorMessage('Please select a file');
      return;
    }

    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(billFile.type)) {
      setErrorMessage('Invalid file type. Only PDF files are allowed.');
      return;
    }

    if (billFile.size > 30* 1024 * 1024) { // 1MB
      setErrorMessage('File is too large. Maximum size allowed is 1MB.');
      return;
    }

    const formData = new FormData();
    formData.append('file', billFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setBillFile(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading file:', error.response?.data?.error || error.message);
      setErrorMessage('Failed to upload file. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Upload Bill</h1>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Bill:</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
