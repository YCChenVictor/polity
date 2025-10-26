contract LawRegistry {
    struct Doc {
        bytes cid;
        bytes32 sha256sum;
        string mime;
        bool exists;
    }

    mapping(bytes32 => Doc) public docs;

    event LawSeeded(bytes32 indexed key, bytes cid, bytes32 sha256sum, string mime);

    constructor(bytes32[] memory keys, bytes[] memory cids, bytes32[] memory shas, string[] memory mimes) {
        require(keys.length == cids.length && keys.length == shas.length && keys.length == mimes.length, "len");
        for (uint256 i = 0; i < keys.length; i++) {
            docs[keys[i]] = Doc({cid: cids[i], sha256sum: shas[i], mime: mimes[i], exists: true});
            emit LawSeeded(keys[i], cids[i], shas[i], mimes[i]);
        }
    }
}

