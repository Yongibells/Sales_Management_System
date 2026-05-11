export default function AuthCallbackPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030d03 0%, #071a07 50%, #030d03 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
    }}>

      {/* Spinner */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid rgba(0,255,80,0.15)',
        borderTop: '3px solid #00ff50',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '24px',
      }} />

      {/* Text */}
      <p style={{
        color: '#00ff50',
        fontSize: '14px',
        letterSpacing: '2px',
      }}>
        AUTHENTICATING...
      </p>

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )
}