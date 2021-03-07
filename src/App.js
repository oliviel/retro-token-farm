import {
  NoWalletDetected, 
  ConnectWallet, 
  Header, 
  Loading, 
  Container,
  Form,
  Balances
} from './components';

function App() {
  return (
    <>
      <Header />
      <Container className="mt-5">
        <Balances
        />
      </Container>
      <Container>
        <Form />
      </Container>
    </>
  )
}
export default App;
