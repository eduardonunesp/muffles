module.exports = async (deployer, network, accounts, web3) => {
  await deployer.deploy('Migrations')
}
