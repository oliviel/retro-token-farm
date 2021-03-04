import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import {
  NoWalletDetected, 
  ConnectWallet, 
  Header, 
  Loading, 
  Container,
  Form,
  Balances
} from './components';
import { parseEther } from './utils';
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

  async function stakeTokens() {
    try {
      setIsloading(true);
      
      const approve = await daiTokenContract.approve(
        tokenFarmContract.address, 
        parseEther(amount)
      );

      const response = await approve.wait();

      const tx = await tokenFarmContract.stakeTokens(parseEther(amount));

      const receipt = await tx.wait();

      if (receipt.status === 0 || response.status === 0) {
        throw new Error("Transaction failed");
      }
      
      const daiBalance = await daiTokenContract.balanceOf(userAddress);
      const tokenFarmBalance = await tokenFarmContract.stakingBalance(userAddress);

      setBalance((prevBalance) => ({ 
        ...prevBalance,
        daiToken: daiBalance.toString(),
        staking: tokenFarmBalance.toString(),
      }));
    } catch (error) {
      console.log('EROROR', error);
    } finally {
      setAmount('');
      setIsloading(false);
    }
  }
  
  async function unstakeTokens() {
    try {
      setIsloading(true);
      const tx = await tokenFarmContract.unstakeTokens();
      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      const daiBalance = await daiTokenContract.balanceOf(userAddress);
      const tokenFarmBalance = await tokenFarmContract.stakingBalance(userAddress);

      setBalance((prevBalance) => ({ 
        ...prevBalance,
        daiToken: daiBalance.toString(),
        staking: tokenFarmBalance.toString(),
      }));
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
      <Container className="mt-5">
        <Balances
          stakingBalance={balance.staking}
          retroTokenBalance={balance.retroToken}
        />
      </Container>
      <Container>
        <Form 
          daitokenBalance={balance.daiToken} 
          amount={amount}
          handleAmount={setAmount}
          stakeTokens={stakeTokens}
          unstakeTokens={unstakeTokens}
        />
      </Container>
    </>
  )
}
export default App;
