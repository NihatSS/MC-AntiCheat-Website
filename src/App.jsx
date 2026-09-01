import Checkout from './Checkout.jsx';
import Home from './Home.jsx';

export default function App() {
  const path = window.location.pathname.toLowerCase();
  const isCheckout = path.endsWith('/checkout') || path.endsWith('/checkout.html');

  return isCheckout ? <Checkout /> : <Home />;
}
