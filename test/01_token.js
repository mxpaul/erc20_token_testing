const Token = artifacts.require("Token");
const hardcodedTotalSupply = 10000000000000000000000000;

contract('Token constructor', function(accounts) {
	const acc = { owner1: accounts[0], owner2: accounts[1], nobody: accounts[9]};
	let token;

	it('should deploy")', async() => {
		token = await Token.new(acc.owner1, acc.owner2, {from: acc.owner1});
	});

	it('should have name and symbol set to string("MMS")', async() => {
		assert.equal(await token.name(), 'MMS');
		assert.equal(await token.symbol(), 'MMS');
	});

	it('should have owner and owner2 set to what passed via constructor', async() => {
		let o1 = await token.owner();
		let o2 = await token.owner2();
		assert.equal(o1, acc.owner1);
		assert.equal(o2, acc.owner2);
		assert.equal(await token.owner3(), 0); // owner3 set to zero by default
	});

	it('should have total supply = hardcodedTotalSupply', async() => {
		assert.equal(await token.totalSupply(), hardcodedTotalSupply);
	});
	it('should have initial owner balance equal to hardcodedTotalSupply', async() => {
		assert.equal(await token.balances(acc.owner1), hardcodedTotalSupply);
		assert.equal(await token.balanceOf(acc.owner1), hardcodedTotalSupply);
	});
	it('should have balanceOf return zero for non-existing address and owner2', async() => {
		assert.equal(await token.balanceOf(acc.owner2), 0);
		assert.equal(await token.balanceOf(acc.nobody), 0);
	});
});
