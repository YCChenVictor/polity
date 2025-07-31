// test/PolityGovernment.test.ts
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ZeroAddress } from 'ethers';
import type { PolityGovernment } from '../typechain-types';

describe('PolityGovernment', function () {
    async function deployPolity() {
        const [owner, other]: SignerWithAddress[] = await ethers.getSigners();
        const factory = await ethers.getContractFactory('PolityGovernment', owner);
        const polity = (await factory.deploy(1)) as PolityGovernment;
        await polity.waitForDeployment();
        return { polity, owner, other };
    }

    it('deploys with correct initial state', async () => {
        const { polity, owner } = await loadFixture(deployPolity);
        expect(await polity.governors(0)).to.equal(owner.address);
        expect(await polity.isGovernor(owner.address)).to.be.true;
        expect(await polity.getRequiredSignatures()).to.equal(1);
    });
});
