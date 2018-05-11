'use strict';

const Token = artifacts.require("Token");
const hardcodedTotalSupply = 10000000000000000000000000;

import expectThrow from '../submodules/mixbytes/solidity/test/helpers/expectThrow';

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
	it('should have zero investBalances for any user', async() => {
		assert.equal(await token.investBalances(acc.owner1), 0);
		assert.equal(await token.investBalances(acc.owner2), 0);
		assert.equal(await token.investBalances(acc.nobody), 0);
	});
});

contract('Token add_tokens', function(accounts) {
	const acc = {owner1: accounts[0], owner2: accounts[1], nobody: accounts[9], goodguy: accounts[3]};
	let token;

	it('should deploy")', async() => {
		token = await Token.new(acc.owner1, acc.owner2, {from: acc.owner1});
	});

	it('should throw when caller is not owner")', async() => {
		expectThrow(token.add_tokens(acc.nobody, 100,{from: acc.nobody}));
	});

	it('should transfer tokens from owner balance to goodguy investBalance")', async() => {
		const amount = 100;

		let o1_before = (await token.balanceOf(acc.owner1)).toNumber();
		let gg_before = (await token.investBalances(acc.goodguy)).toNumber();
		let want_o1 = o1_before - amount;
		let want_gg = gg_before + amount;

		await token.add_tokens(acc.goodguy, amount, {from: acc.owner1});
		let got_o1 = (await token.balanceOf(acc.owner1)).toNumber();
		let got_gg = (await token.investBalances(acc.goodguy)).toNumber();
		assert.equal(got_o1, want_o1);
		assert.equal(got_gg, want_gg);
	});

	it('should transfer tokens from owner balance to goodguy investBalance when called by owner2")', async() => {
		const amount = 100;

		let o1_before = (await token.balanceOf(acc.owner1)).toNumber();
		let gg_before = (await token.investBalances(acc.goodguy)).toNumber();
		let want_o1 = o1_before - amount;
		let want_gg = gg_before + amount;

		let want_o2_balance = (await token.balanceOf(acc.owner2)).toNumber();
		let want_o2_inv_balance = (await token.investBalances(acc.owner2)).toNumber();

		await token.add_tokens(acc.goodguy, amount, {from: acc.owner2});
		let got_o1 = (await token.balanceOf(acc.owner1)).toNumber();
		let got_gg = (await token.investBalances(acc.goodguy)).toNumber();
		assert.equal(got_o1, want_o1);
		assert.equal(got_gg, want_gg);

		let got_o2_balance = (await token.balanceOf(acc.owner2)).toNumber();
		let got_o2_inv_balance = (await token.investBalances(acc.owner2)).toNumber();
		assert.equal(want_o2_balance, got_o2_balance);
		assert.equal(want_o2_inv_balance, got_o2_inv_balance);
	});

	// Here goes test where any owner able to create more tokens then initial supply by calling 
	// token.add_token(acc.owner1, token.balanceOf(acc.owner1) + token.totalSupply());
});
