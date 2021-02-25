export const ConnectWallet = ({ connectWallet, networkError, dismiss }) => {
  return (
    <div className="max-w-screen-md mx-auto mt-20 text-white p-5">
      <div className="col-6 p-4 text-black text-center">
        <p className="mb-5">Please connect to your wallet.</p>
        <button onClick={connectWallet} 
          type="button" 
          className="nes-btn is-warning"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  )
}