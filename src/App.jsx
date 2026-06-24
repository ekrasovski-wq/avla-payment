import AvlaPayment from './AvlaPayment'
import AvlaMenu from './AvlaMenu'
import { GamePage } from './AvlaGame'

export default function App() {
  // QR service tiers:  ?qr=menu (menu+order+pay) · ?qr=game (direct game) · default = payment
  const qr = new URLSearchParams(window.location.search).get('qr')
  if (qr === 'game') return <GamePage />
  return qr === 'menu' ? <AvlaMenu /> : <AvlaPayment />
}
