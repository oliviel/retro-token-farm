import { formatEther } from '../utils';

export const Balances = ({ stakingBalance = '0', retroTokenBalance = '0' }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="text-center nes-container is-rounded is-dark">
        <p>Staking Balance</p>
        <div className="flex mt-8 content-center ml-16">
          <i className="nes-icon coin transform scale-150 mr-5"></i>
        <p>
          <span>{formatEther(stakingBalance)}</span>
          <span className="ml-2 nes-text is-warning">mDAI</span>
        </p>
      </div>
      </div>
        <div className="text-center nes-container is-rounded is-dark ">
          <p>Reward Balance</p>
          <div className="flex mt-8 ml-3 content-center">
          <i className="nes-icon coin transform scale-150 mr-3	"></i>
          <p> 
            <span>{formatEther(retroTokenBalance)}</span>
            <span className="ml-2 nes-text is-warning">Retro Token</span>
          </p>
        </div>
      </div>
    </div>
  );
}