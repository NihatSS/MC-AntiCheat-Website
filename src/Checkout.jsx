import { useEffect, useMemo, useRef, useState } from 'react';

const checkPath = 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z';
const lockPath = 'M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z';

const plans = {
  starter: {
    name: 'Starter Plan',
    desc: 'For small Minecraft servers',
    price: 'X',
    features: ['Core detections', 'Basic logging', 'Discord support', 'Automatic updates']
  },
  network: {
    name: 'Network Plan',
    desc: 'For serious Minecraft networks',
    price: 'X',
    features: ['Full detection suite', 'Advanced logging', 'Priority support', 'Network-wide protection', 'Automatic updates']
  }
};

const initialValues = {
  email: '',
  firstName: '',
  lastName: '',
  serverName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  country: 'us'
};

function Logo() {
  return (
    <div className="logo-icon">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L4 14l6 1-4 14 16-18-6 1 4-12z" fill="url(#checkoutLogoGrad)" stroke="url(#checkoutLogoGrad)" strokeWidth="1" strokeLinejoin="round" />
        <defs>
          <linearGradient id="checkoutLogoGrad" x1="4" y1="2" x2="22" y2="30">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d={checkPath} />
    </svg>
  );
}

function LockIcon({ size }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={size} height={size}>
      <path fillRule="evenodd" d={lockPath} />
    </svg>
  );
}

function FormGroup({ id, label, error, shake, children }) {
  return (
    <div className={`form-group${error ? ' has-error' : ''}${shake ? ' shake' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="form-error">{error}</span>}
    </div>
  );
}

export default function Checkout() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [shakeField, setShakeField] = useState('');
  const [status, setStatus] = useState('idle');
  const timeoutRef = useRef(null);

  const plan = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return plans[params.get('plan')] || plans.network;
  }, []);

  useEffect(() => {
    document.title = 'Checkout — Voltex';
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearError = (id) => {
    setErrors((current) => {
      if (!current[id]) return current;
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const handleChange = (event) => {
    const { id } = event.target;
    let { value } = event.target;

    if (id === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    if (id === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 2) value = `${value.substring(0, 2)} / ${value.substring(2)}`;
    }

    setValues((current) => ({ ...current, [id]: value }));
    clearError(id);
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!values.firstName.trim()) nextErrors.firstName = 'First name is required';
    if (!values.lastName.trim()) nextErrors.lastName = 'Last name is required';

    const cardDigits = values.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 13 || cardDigits.length > 16 || !/^\d+$/.test(cardDigits)) {
      nextErrors.cardNumber = 'Please enter a valid card number';
    }

    const expMatch = values.expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!expMatch) {
      nextErrors.expiry = 'Use MM / YY format';
    } else {
      const month = parseInt(expMatch[1], 10);
      if (month < 1 || month > 12) nextErrors.expiry = 'Invalid month';
    }

    if (!/^\d{3,4}$/.test(values.cvc.trim())) {
      nextErrors.cvc = 'Enter 3 or 4 digits';
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (status !== 'idle') return;

    const nextErrors = validateForm();
    const firstError = Object.keys(nextErrors)[0];

    if (firstError) {
      setShakeField(firstError);
      document.getElementById(firstError)?.focus();
      window.setTimeout(() => setShakeField(''), 400);
      return;
    }

    setStatus('loading');
    timeoutRef.current = window.setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <>
      <nav className="navbar scrolled">
        <div className="nav-container">
          <a href="index.html" className="nav-logo">
            <Logo />
            <span className="logo-text">Voltex</span>
          </a>
          <div className="nav-links">
            <a href="index.html">Overview</a>
            <a href="index.html#features">Features</a>
            <a href="index.html#pricing">Pricing</a>
            <a href="index.html#faq">FAQ</a>
          </div>
          <div className="nav-actions">
            <a href="index.html" className="btn-ghost">Back to Home</a>
          </div>
        </div>
      </nav>

      <section className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-form-card">
            <h2>Complete Your Purchase</h2>
            <p className="subtitle">Secure checkout for your Voltex subscription.</p>

            <form id="checkoutForm" onSubmit={handleSubmit} noValidate>
              <div className="form-section-title">Account Information</div>

              <FormGroup id="email" label="Email Address" error={errors.email} shake={shakeField === 'email'}>
                <input type="email" id="email" placeholder="you@example.com" required value={values.email} onChange={handleChange} />
              </FormGroup>

              <div className="form-row">
                <FormGroup id="firstName" label="First Name" error={errors.firstName} shake={shakeField === 'firstName'}>
                  <input type="text" id="firstName" placeholder="John" required value={values.firstName} onChange={handleChange} />
                </FormGroup>
                <FormGroup id="lastName" label="Last Name" error={errors.lastName} shake={shakeField === 'lastName'}>
                  <input type="text" id="lastName" placeholder="Doe" required value={values.lastName} onChange={handleChange} />
                </FormGroup>
              </div>

              <FormGroup id="serverName" label="Minecraft Server Name">
                <input type="text" id="serverName" placeholder="My Server" value={values.serverName} onChange={handleChange} />
              </FormGroup>

              <div className="form-divider"></div>
              <div className="form-section-title">Payment Details</div>

              <FormGroup id="cardNumber" label="Card Number" error={errors.cardNumber} shake={shakeField === 'cardNumber'}>
                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} required value={values.cardNumber} onChange={handleChange} />
              </FormGroup>

              <div className="form-row">
                <FormGroup id="expiry" label="Expiration Date" error={errors.expiry} shake={shakeField === 'expiry'}>
                  <input type="text" id="expiry" placeholder="MM / YY" maxLength={7} required value={values.expiry} onChange={handleChange} />
                </FormGroup>
                <FormGroup id="cvc" label="CVC" error={errors.cvc} shake={shakeField === 'cvc'}>
                  <input type="text" id="cvc" placeholder="123" maxLength={4} required value={values.cvc} onChange={handleChange} />
                </FormGroup>
              </div>

              <FormGroup id="country" label="Country">
                <select id="country" value={values.country} onChange={handleChange}>
                  <option value="us">United States</option>
                  <option value="gb">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="fr">France</option>
                  <option value="nl">Netherlands</option>
                  <option value="se">Sweden</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>

              <button type="submit" className={`btn-primary btn-lg checkout-submit${status === 'loading' ? ' loading' : ''}${status === 'success' ? ' success' : ''}`} disabled={status !== 'idle'}>
                {status === 'loading' && <><div className="btn-spinner"></div><span>Processing...</span></>}
                {status === 'success' && <><CheckIcon /><span>Payment Successful!</span></>}
                {status === 'idle' && <><LockIcon size={18} /><span id="submitText">Complete Purchase</span></>}
              </button>

              <div className="summary-secure">
                <LockIcon />
                <span>Secured with 256-bit SSL encryption</span>
              </div>
            </form>
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>

            <div className="summary-plan" id="summaryPlan">
              <div className="summary-plan-name" id="planName">{plan.name}</div>
              <div className="summary-plan-desc" id="planDesc">{plan.desc}</div>
              <div className="summary-plan-price">
                <span className="price-currency">$</span>
                <span className="price-amount" id="planPrice">{plan.price}</span>
                <span className="price-period">/month</span>
              </div>
            </div>

            <ul className="summary-features" id="summaryFeatures">
              {plan.features.map((feature) => (
                <li key={feature}><CheckIcon /> {feature}</li>
              ))}
            </ul>

            <div className="summary-total">
              <span>Total due today</span>
              <span id="totalPrice">${plan.price}/mo</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
