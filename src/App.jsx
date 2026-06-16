import AvlaPayment from './AvlaPayment'
import AvlaMenu from './AvlaMenu'

export default function App() {
  // Each restaurant gets a QR that encodes its Avla service tier:
  //   ?qr=menu     → menu + ordering + payment
  //   ?qr=payment  → payment only (default)
  const qr = new URLSearchParams(window.location.search).get('qr')
  return qr === 'menu' ? <AvlaMenu /> : <AvlaPayment />
}
