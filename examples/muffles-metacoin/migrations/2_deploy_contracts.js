module.exports = async (deployer, network, accounts, web3) => {
  await deployer.deploy('ConvertLib')
  deployer.link('MetaCoin', 'ConvertLib')
  await deployer.deploy('MetaCoin')
}
