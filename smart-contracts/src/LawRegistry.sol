pragma solidity ^0.8.24;

contract LawRegistry {
    struct Doc { bytes cid; bytes32 sha256sum; string mime; bool exists; }
    mapping(bytes32 => Doc) public byCid; // id = keccak256(cid)

    event DocSeeded(bytes32 indexed id, bytes cid, bytes32 sha256sum, string mime);

    constructor(bytes[] memory cids, bytes32[] memory shas, string[] memory mimes) {
        require(cids.length == shas.length && cids.length == mimes.length, "len");
        for (uint256 i; i < cids.length; i++) {
            bytes32 id = keccak256(cids[i]);
            require(!byCid[id].exists, "exists");
            byCid[id] = Doc(cids[i], shas[i], mimes[i], true);
            emit DocSeeded(id, cids[i], shas[i], mimes[i]);
        }
    }

    function get(bytes calldata cid) external view returns (Doc memory) {
        return byCid[keccak256(cid)];
    }
}
