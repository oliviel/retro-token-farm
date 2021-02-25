import { useEffect, useState } from 'react';
import { NoWalletDetected, ConnectWallet, Header, Loading } from './components';
import { ethers } from 'ethers';
import RetroTokenContract from "./abis/RetroToken.json";
import retroTokenAddress from "./abis/retrotoken-address.json";
import DaiTokenContract from "./abis/DaiToken.json";
import daiTokenAddress from "./abis/daitoken-address.json";
import TokenFarmContract from "./abis/TokenFarm.json";
import tokenFarmAddress from "./abis/tokenfarm-address.json";

const HARDHAT_NETWORK_ID = '31337';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [isLoading, setIsloading] = useState(true);

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

      setUserAddress(accountAddress);    
      setRetroTokenContract(retroToken);
      setDaiTokenContract(daiToken);
      setTokenFarmContract(tokenFarm);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.log(error)
    }
  }

  function checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545'
    });

    return false;
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
            <p>100 <span className="nes-text is-warning">mDAI</span></p>
          </div>
        </div>
        <div className="text-center nes-container is-rounded is-dark ">
          <p>Reward Balance</p>
          <div className="flex mt-8 ml-3 content-center">
            <i className="nes-icon coin transform scale-150 mr-3	"></i>
            <p  >100 <span className="nes-text is-warning">Retro Token</span></p>
          </div>
        </div>
      </div>
    </section>

    <section className="max-w-screen-md mx-auto mt-2 text-white p-5">
      <div className="text-center nes-container is-rounded ">
        <div className="flex justify-between">
          <p className="text-black">Stake Tokens</p>
          <p className="text-black">Walllet Balance: 0</p>
        </div>
        <div className="nes-field text-black mt-5">
          <input 
            type="number"
            min={1} 
            id="name_field" 
            className="nes-input" 
            placeholder="0" 
            required
          />
        </div>
        <button 
          type="button" 
          className="nes-btn is-primary w-full mt-5"
        > 
          <div className="flex justify-center pt-2">
            <i className="nes-icon trophy transform scale-150"></i>
            <p>Stake</p>
          </div>
        </button>
        
      </div>
    </section>
    </>
  )
}
export default App;
