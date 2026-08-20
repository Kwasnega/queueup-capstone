import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Poppins, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{ 
        color: '#007bff', 
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        QUEUEUP Dashboard System
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ 
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Student Dashboard</h3>
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>
            Access the student dashboard to submit complaints and track issues with role-based routing.
          </p>
          <a 
            href="/dashboard.html" 
            style={{ 
              display: 'inline-block',
              background: '#007bff',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Open Student Dashboard
          </a>
        </div>

        <div style={{ 
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Admin Dashboard</h3>
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>
            Access the admin dashboard with role-based complaint filtering system.
          </p>
          <a 
            href="/admin_dashboard.html" 
            style={{ 
              display: 'inline-block',
              background: '#28a745',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Open Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;