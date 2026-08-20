import React from 'react';

const App: React.FC = () => {
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
            Access the student dashboard to submit complaints and track issues.
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
            Access the admin dashboard with role-based complaint filtering.
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

      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        background: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ color: '#1f2937', marginBottom: '15px' }}>Role-Based Complaint System</h3>
        <p style={{ color: '#6b7280', marginBottom: '10px' }}>
          ✅ <strong>Student Features:</strong> Submit complaints to specific authorities (Dean, HOD, Registrar, Exam Officer)
        </p>
        <p style={{ color: '#6b7280', marginBottom: '10px' }}>
          ✅ <strong>Admin Features:</strong> Role-based filtering - each admin only sees complaints submitted to their authority
        </p>
        <p style={{ color: '#6b7280', marginBottom: '10px' }}>
          ✅ <strong>SuperAdmin:</strong> Can view all complaints regardless of routing for oversight
        </p>
        <p style={{ color: '#6b7280' }}>
          ✅ <strong>General Complaints:</strong> Visible to all admin roles for broad issues
        </p>
      </div>
    </div>
  );
};

export default App;