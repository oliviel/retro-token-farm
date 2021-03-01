import { ethers } from 'ethers';

export const parseEther = (number) => {
  return ethers.utils.parseEther(number).toString();
}

export const formatEther = (number = '0') => {
  return ethers.utils.formatEther(number);
}