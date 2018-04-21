describe('MetaCoin', () => {
  it('should put 10000 MetaCoin in the first account', async () => {
    const meta = await deployer('Metacoin')
    const balance = await meta.methods.getBalance(accounts[0]).call({ from: accounts[0]})
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account")
  })

  it("should call a function that depends on a linked library  ", async () => {
    const meta = await deployer('Metacoin')
    const from = accounts[0]

    const metaCoinBalance = await meta.methods.getBalance(accounts[0]).call({from})
    const metaCoinEthBalance = await meta.methods.getBalanceInEth(accounts[0]).call({from})
    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, "Library function returned unexpeced function, linkage may be broken")
  })

  it("should send coin correctly", async () => {
    const meta = await deployer('Metacoin')

    const account_one = accounts[0]
    const account_two = accounts[1]

    let account_one_starting_balance
    let account_two_starting_balance
    let account_one_ending_balance
    let account_two_ending_balance

    const amount = 10

    account_one_starting_balance = await meta.methods.getBalance(account_one).call({ from: account_one })
    account_two_starting_balance = await meta.methods.getBalance(account_two).call({ from: account_one })
    await meta.methods.sendCoin(account_two, amount).send({from: account_one})
    account_one_ending_balance = await meta.methods.getBalance(account_one).call({ from: account_one })
    account_two_ending_balance = await meta.methods.getBalance(account_two).call({ from: account_one })

    assert.equal(account_one_ending_balance, parseInt(account_one_starting_balance) - amount, "Amount wasn't correctly taken from the sender")
    assert.equal(account_two_ending_balance, parseInt(account_two_starting_balance) + amount, "Amount wasn't correctly sent to the receiver")
  })
})
