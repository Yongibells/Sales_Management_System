import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 font-mono" style={{ color: 'rgba(255,80,80,0.8)' }}>
          <h2 style={{ fontSize: '16px', marginBottom: '8px' }}>Something went wrong.</h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,80,80,0.5)' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '16px',
              background: 'transparent',
              border: '1px solid rgba(255,80,80,0.4)',
              color: 'rgba(255,80,80,0.7)',
              fontFamily: 'monospace',
              fontSize: '11px',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            TRY AGAIN
          </button>
        </div>
      )
    }

    return this.props.children
  }
}