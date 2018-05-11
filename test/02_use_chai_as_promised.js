'use strict';
const Token = artifacts.require("Token");

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Token', function(accounts) {
	const acc = {owner1: accounts[0], owner2: accounts[1], nobody: accounts[9]};

  beforeEach(async function () {
		this.token = await Token.new(acc.owner1, acc.owner2, {from: acc.owner1});
  });

	it('should throw when add_tokens called by non-owner', async function() {
    await this.token.add_tokens(acc.nobody, 100, {from: acc.nobody}).should.be.rejected;
	});
});

