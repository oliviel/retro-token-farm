import { useEffect, useState } from 'react';
import { NoWalletDetected, ConnectWallet, Header, Loading } from './components';
import { ethers } from 'ethers';
import { parseEther, formatEther } from './utils';
import RetroTokenContract from "./abis/RetroToken.json";
import retroTokenAddress from "./abis/retrotoken-address.json";
import DaiTokenContract from "./abis/DaiToken.json";
import daiTokenAddress from "./abis/daitoken-address.json";
import TokenFarmContract from "./abis/TokenFarm.json";
import tokenFarmAddress from "./abis/tokenfarm-address.json";

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [isLoading, setIsloading] = useState(true);
  const [amount, setAmount] = useState('');

  const [retroTokenContract, setRetroTokenContract] = useState({});
  const [daiTokenContract, setDaiTokenContract] = useState({});
  const [tokenFarmContract, setTokenFarmContract] = useState({});

  const [balance, setBalance] = useState({
    retroToken: '0',
    daiToken: '0',
    staking: '0',
  });  

  useEffect(() => {
    (async () => {
      await loadBlockchainData();
    })();
  }, []);

  async function loadBlockchainData() {    
    try {
      setIsloading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const accountAddress = await signer.getAddress();

      const retroToken = new ethers.Contract(
        retroTokenAddress.RetroToken, 
        RetroTokenContract.abi, 
        signer
      );

      const daiToken = new ethers.Contract(
        daiTokenAddress.DaiToken,
        DaiTokenContract.abi,
        signer
      )

      const tokenFarm = new ethers.Contract(
        tokenFarmAddress.TokenFarm,
        TokenFarmContract.abi,
        signer
      )

      const daiBalance = await daiToken.balanceOf(accountAddress);

      const retroBalance = await retroToken.balanceOf(accountAddress);

      const tokenFarmBalance = await tokenFarm.stakingBalance(accountAddress);

      setUserAddress(accountAddress);    
      setRetroTokenContract(retroToken);
      setDaiTokenContract(daiToken);
      setTokenFarmContract(tokenFarm);
      setBalance({
        retroToken: retroBalance.toString(),
        daiToken: daiBalance.toString(),
        staking: tokenFarmBalance.toString(),
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false);
    }
  }

  async function stakeTokens(event) {
    try {
      event.preventDefault();
      setIsloading(true);
      const approve = await daiTokenContract.approve(tokenFarmContract.address, parseEther(amount));

      const response = await approve.wait();

      const tx = await tokenFarmContract.stakeTokens(parseEther(amount));

      const receipt = await tx.wait();

       if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      if (response.status === 0) {
        throw new Error("Transaction failed");
      }
      
      const daiBalance = await daiTokenContract.balanceOf(userAddress);
      const tokenFarmBalance = await tokenFarmContract.stakingBalance(userAddress);

      setBalance({ 
        daiToken: daiBalance.toString(),
        staking: tokenFarmBalance.toString(),
      })
    } catch (error) {
      console.log('EROROR', error);
    } finally {
      setAmount('');
      setIsloading(false);
    }
  }
  
  async function unstakeTokens(event) {
    try {
      event.preventDefault();
      setIsloading(true);
      const tx = await tokenFarmContract.unstakeTokens();
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      const daiBalance = await daiTokenContract.balanceOf(userAddress);
      const tokenFarmBalance = await tokenFarmContract.stakingBalance(userAddress);

      setBalance({ 
        daiToken: daiBalance.toString(),
        staking: tokenFarmBalance.toString(),
      })

    } catch (error) {
      console.log('ERROR', error);
    } finally {
      setIsloading(false);
    }
  }

  async function triggerWallte() {
    await window.ethereum.enable();
  }

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  if (isLoading) {
    return <Loading loadingPercent={getRandomNumber(1, 100)} />;
  }

  if (!userAddress) {
    return <ConnectWallet connectWallet={triggerWallte} />;
  }
 
  return (
    <>
      <Header />
      <section className="max-w-screen-md mx-auto mt-5 text-white p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center nes-container is-rounded is-dark">
            <p>Staking Balance</p>
            <div className="flex mt-8 content-center ml-16">
              <i className="nes-icon coin transform scale-150 mr-5"></i>
              <p>
              <span>{formatEther(balance.staking)}</span>
              <span className="ml-2 nes-text is-warning">mDAI</span>
              </p>
            </div>
          </div>
          <div className="text-center nes-container is-rounded is-dark ">
            <p>Reward Balance</p>
            <div className="flex mt-8 ml-3 content-center">
              <i className="nes-icon coin transform scale-150 mr-3	"></i>
              <p> 
                <span>{formatEther(balance.retroToken)}</span>
                <span className="ml-2 nes-text is-warning">Retro Token</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-screen-md mx-auto mt-2 text-white p-5">
        <div className="text-center nes-container is-rounded">
          <div className="flex justify-between">
            <p className="text-black text-sm md:text-base">Stake Tokens</p>
            <p className="text-black text-sm md:text-base">
              Walllet Balance: 
              <span>{formatEther(balance.daiToken)}</span>
            </p>
          </div>
          <form onSubmit={stakeTokens}>
            <div className="nes-field text-black mt-5">
              <input 
                type="number"
                min={1}
                className="nes-input" 
                placeholder="0" 
                value={amount}
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <button className="nes-btn is-primary w-full mt-5"> 
              <div className="flex justify-center pt-2">
                <i className="nes-icon trophy transform scale-150"></i>
                <p>Stake</p>
              </div>
            </button>
            <button onClick={unstakeTokens} className="nes-btn is-error w-full mt-5"> 
              <div className="flex justify-center pt-2">
                <i className="nes-icon trophy transform scale-150"></i>
                <p>Unstake</p>
              </div>
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
export default App;
