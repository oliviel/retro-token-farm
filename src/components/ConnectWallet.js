export const ConnectWallet = ({ connectWallet, networkError, dismiss }) => {
  return (
    <div className="max-w-screen-md mx-auto mt-20 text-white p-5">
      {/* <div className="text-center">
        <h1>There is an error</h1>
      </div> */}
      <div className="col-6 p-4 text-black text-center">
        <p className="mb-5">Please connect to your wallet.</p>
        <button
            className="py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-yellow-300 hover:bg-yellow-500"
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
      </div>
    </div>
  )
}