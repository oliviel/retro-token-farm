export const NoWalletDetected = () => {
  return (
    <div className="max-w-screen-md mx-auto mt-20 p-5">
      <section className="nes-container is-dark">
        <section className="message-list">
          <section className="message -left">
            <div className="nes-balloon from-left is-dark">
              <p>No Ethereum wallet was detected</p>
            </div>
          </section>
          <section className="message text-center sm:text-right -right">
            <div className="nes-balloon from-right is-dark">
              Please install <a className="is-primary" href="http://metamask.io" target="_blank" rel="noopener noreferrer"> <button type="button" class="nes-btn is-primary">
                MetaMask
              </button>
              </a>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}