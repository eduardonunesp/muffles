module.exports = async (deployer, network, accounts, web3) => {
  await deployer('ConvertLib');
  await deployer('MetaCoin', ['ConvertLib']);
}
