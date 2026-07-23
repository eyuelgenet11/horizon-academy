'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import './mock-checkout.css';

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txRef = searchParams.get('tx_ref') || 'mock-tx-default-12345';
  const amount = searchParams.get('amount') || '0';
  const courseTitle = searchParams.get('title') || 'Course Enrollment';

  const [selectedMethod, setSelectedMethod] = useState('telebirr');
  const [loading, setLoading] = useState(false);

  const handleSimulateSuccess = () => {
    setLoading(true);
    // Simulate short gateway delay
    setTimeout(() => {
      router.push(`/api/payments/verify?tx_ref=${txRef}`);
    }, 1500);
  };

  const handleSimulateFailure = () => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/courses?error=payment_failed`);
    }, 1000);
  };

  return (
    <div className="checkout-container">
      {/* Left: Invoice summary */}
      <div className="checkout-order-summary">
        <div>
          <div className="chapa-brand">
            chapa <span className="tag">Sandbox</span>
          </div>
          <div className="order-details" style={{ marginTop: '2.5rem' }}>
            <h3>Payment Invoice</h3>
            <p className="course-title">{courseTitle}</p>
            <div className="order-meta">
              <div>Ref: <code>{txRef}</code></div>
              <div>Merchant: <strong>Horizon Academy</strong></div>
              <div>Currency: <strong>ETB</strong></div>
            </div>
          </div>
        </div>

        <div className="order-price">
          <div className="label">Total Amount</div>
          <div className="amount">{parseFloat(amount).toLocaleString()} ETB</div>
        </div>
      </div>

      {/* Right: Payment Simulator Controls */}
      <div className="checkout-payment-methods">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
            <div className="spinner" style={{ width: '3rem', height: '3rem', borderLeftColor: '#f26522', borderWidth: '3px' }}></div>
            <p className="text-muted" style={{ fontWeight: '600' }}>Contacting gateway simulator...</p>
          </div>
        ) : (
          <>
            <h2>Choose Payment Channel</h2>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
              Select a simulated local payment provider to simulate payment.
            </p>

            <div className="payment-options-grid">
              <div
                className={`payment-option-card ${selectedMethod === 'telebirr' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('telebirr')}
              >
                <div className="logo-box">📱</div>
                <div className="info">
                  <span className="name">telebirr</span>
                  <span className="desc">Simulate Safaricom/Ethio Telecom mobile wallet payment</span>
                </div>
              </div>

              <div
                className={`payment-option-card ${selectedMethod === 'cbe' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('cbe')}
              >
                <div className="logo-box">🏦</div>
                <div className="info">
                  <span className="name">CBE Birr</span>
                  <span className="desc">Simulate Commercial Bank of Ethiopia mobile banking</span>
                </div>
              </div>

              <div
                className={`payment-option-card ${selectedMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="logo-box">💳</div>
                <div className="info">
                  <span className="name">Debit / Credit Card</span>
                  <span className="desc">Simulate Visa, Mastercard or local banking card transaction</span>
                </div>
              </div>
            </div>

            <div className="simulation-controls">
              <button onClick={handleSimulateSuccess} className="btn-success-sim">
                Simulate Successful Payment 💸
              </button>
              <button onClick={handleSimulateFailure} className="btn-fail-sim">
                Simulate Payment Failure ✕
              </button>
              <div className="back-to-merchant" onClick={() => router.push('/courses')}>
                Cancel and return to Horizon Academy
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <div className="checkout-wrapper">
      <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div className="spinner" style={{ width: '2rem', height: '2rem', borderLeftColor: '#f26522' }}></div>
          <span>Loading Sandbox Portal...</span>
        </div>
      }>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
