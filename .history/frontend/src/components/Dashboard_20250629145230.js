import React, { useState } from 'react';
import History from './components/Return'; // or wherever your file path is

const Dashboard = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => setShowHistory(!showHistory)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        {showHistory ? 'Hide History' : 'View Return History'}
      </button>

      {showHistory && <History />}
    </div>
  );
};

export default Dashboard;
