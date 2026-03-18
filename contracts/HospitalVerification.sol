// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HospitalVerification
 * @notice Simple, gas-efficient on-chain verification registry for hospitals.
 *         - Admin registers / approves / revokes hospitals
 *         - Public can read verification status and metadata
 *         - Designed to be used as an independent trust layer on top of Web2 systems
 */
contract HospitalVerification {
    address public admin;
    uint256 public totalHospitals;
    uint256 public totalBadgesIssued;

    struct Hospital {
        string name;
        bool registered;
        bool verified;
        uint256 badgeId;
        uint256 registeredAt;
        uint256 verifiedAt;
    }

    // hospital wallet address => Hospital record
    mapping(address => Hospital) private hospitals;

    event HospitalRegistered(address indexed hospital, string name, uint256 indexed badgeId, uint256 timestamp);
    event HospitalApproved(address indexed hospital, uint256 indexed badgeId, uint256 timestamp);
    event HospitalRevoked(address indexed hospital, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor(address _admin) {
        require(_admin != address(0), "Admin required");
        admin = _admin;
    }

    /**
     * @notice Let admin update the admin address if needed (e.g. multi-sig).
     */
    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin");
        admin = _newAdmin;
    }

    /**
     * @notice Register a hospital with a name and wallet address.
     * @dev Can be called by anyone (e.g. backend relayer) but enforces no duplicates.
     */
    function registerHospital(address _hospital, string calldata _name) external {
        require(_hospital != address(0), "Invalid hospital");
        require(bytes(_name).length > 0, "Name required");

        Hospital storage h = hospitals[_hospital];
        require(!h.registered, "Already registered");

        totalHospitals += 1;
        totalBadgesIssued += 1;

        h.name = _name;
        h.registered = true;
        h.verified = false;
        h.badgeId = totalBadgesIssued;
        h.registeredAt = block.timestamp;
        h.verifiedAt = 0;

        emit HospitalRegistered(_hospital, _name, h.badgeId, block.timestamp);
    }

    /**
     * @notice Approve / verify a registered hospital. Only admin can approve.
     */
    function approveHospital(address _hospital) external onlyAdmin {
        Hospital storage h = hospitals[_hospital];
        require(h.registered, "Not registered");
        require(!h.verified, "Already verified");

        h.verified = true;
        h.verifiedAt = block.timestamp;

        emit HospitalApproved(_hospital, h.badgeId, block.timestamp);
    }

    /**
     * @notice Revoke a hospital's verification. Only admin can revoke.
     */
    function revokeHospital(address _hospital) external onlyAdmin {
        Hospital storage h = hospitals[_hospital];
        require(h.registered, "Not registered");
        require(h.verified, "Not verified");

        h.verified = false;
        h.verifiedAt = 0;

        emit HospitalRevoked(_hospital, block.timestamp);
    }

    /**
     * @notice Public read: check if a hospital is verified.
     */
    function isVerified(address _hospital) external view returns (bool) {
        return hospitals[_hospital].verified;
    }

    /**
     * @notice Public read: get hospital details.
     */
    function getHospitalDetails(address _hospital)
        external
        view
        returns (
            string memory name,
            bool registered,
            bool verified,
            uint256 badgeId,
            uint256 registeredAt,
            uint256 verifiedAt
        )
    {
        Hospital storage h = hospitals[_hospital];
        return (h.name, h.registered, h.verified, h.badgeId, h.registeredAt, h.verifiedAt);
    }
}

