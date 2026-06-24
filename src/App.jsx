import AvlaPayment from './AvlaPayment'
import AvlaMenu from './AvlaMenu'
import { GamePage } from './AvlaGame'

export default function App() {
  // Each restaurant gets a QR that encodes its Avla service tier:
  //   ?qr=menu     → menu + ordering + payment
  //   ?qr=payment  → payment only (default)
  //   ?qr=game     → direct play of the Avla runner mini-game (also embedded in both success screens)
  const qr = new URLSearchParams(window.location.search).get('qr')
  if (qr === 'game') return <GamePage />
  return qr === 'menu' ? <AvlaMenu /> : <AvlaPayment />
}
