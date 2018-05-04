var Token = artifacts.require("Token");

contract('Token Basics', function(accounts) {
	let acc = { owner1: accounts[0], owner2: accounts[1]};

	it('showld have name MMS', async() => {

		let token = await Token.new(acc.owner1, acc.owner2, {from: acc.owner1});
		let name = await token.name();
		assert.equal(name, 'MMS');

	});
});
