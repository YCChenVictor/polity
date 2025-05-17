import { ethers, upgrades } from 'hardhat';
import { expect } from 'chai';
import { Signer, Contract } from 'ethers';
import { TimocracyNew } from '../typechain-types';

describe('MyToken Upgrade', function () {
    let proxy: Contract;
    let proxyAddress: string;
    let owner: Signer;
    let addr1: Signer;
    let addr2: Signer;

    before(async function () {
        const initialSupply = 1000n * 10n ** 18n;
        const TimocracyOld = await ethers.getContractFactory('TimocracyOld');
        const proxyInstance = await upgrades.deployProxy(
            TimocracyOld,
            ['MyToken', 'MTK', initialSupply],
            {
                initializer: 'initialize',
            },
        );

        proxy = proxyInstance;
        proxyAddress = await proxy.getAddress();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it('upgrades to V2', async function () {
        const TimocracyNew = await ethers.getContractFactory('TimocracyNew');
        const upgraded = await upgrades.upgradeProxy(proxyAddress, TimocracyNew);

        const newImplAddress = await upgraded.getAddress();
        expect(newImplAddress).to.equal(proxyAddress);
    });

    describe('join', function () {
        it('should mint 1 token to the joiner', async function () {
            const timocracyProxy = proxy as unknown as TimocracyNew;
            const initialBalance = await timocracyProxy.balanceOf(await addr1.getAddress());
            await timocracyProxy.connect(addr1).join();
            const finalBalance = await timocracyProxy.balanceOf(await addr1.getAddress());
            expect(finalBalance).to.equal(initialBalance + 1n);
        });
    });
});
