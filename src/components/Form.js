import { formatEther } from '../utils';

export const Form = ({ 
  daitokenBalance = '0', 
  stakeTokens = () => null, 
  unstakeTokens = () => null,
  amount = '',
  handleAmount = () => null
}) => {
  return (
      <div className="text-center nes-container is-rounded">
      <div className="flex justify-between">
        <p className="text-black text-sm md:text-base">Stake Tokens</p>
        <p className="text-black text-sm md:text-base">
          Walllet Balance: 
          <span>{formatEther(daitokenBalance)}</span>
        </p>
      </div>
      <form onSubmit={async (event) => {
        event.preventDefault();
        stakeTokens();
      }}>
        <div className="nes-field text-black mt-5">
          <input 
            type="number"
            min={1}
            className="nes-input" 
            placeholder="0" 
            value={amount}
            required
            onChange={(e) => handleAmount(e.target.value)}
          />
        </div>
        <button className="nes-btn is-primary w-full mt-5"> 
          <div className="flex justify-center pt-2">
            <i className="nes-icon trophy transform scale-150"></i>
            <p>Stake</p>
          </div>
        </button>
        <button onClick={async (event) => {
          event.preventDefault();
          unstakeTokens();
        }} className="nes-btn is-error w-full mt-5"> 
          <div className="flex justify-center pt-2">
            <i className="nes-icon trophy transform scale-150"></i>
            <p>Unstake</p>
          </div>
        </button>
      </form>
    </div>
  );
}