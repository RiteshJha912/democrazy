// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Poll {
        uint256 id;
        string question;
        string[] options;
        uint256[] votes;
        bool exists;
    }

    uint256 public pollCount;
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event PollCreated(uint256 indexed pollId, string question, string[] options);
    event VoteCasted(uint256 indexed pollId, uint256 optionIndex, address voter);

    function createPoll(string memory _question, string[] memory _options) public {
        require(_options.length >= 2, "At least 2 options required");
        require(_options.length <= 5, "Max 5 options allowed");

        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.question = _question;
        newPoll.options = _options;
        newPoll.votes = new uint256[](_options.length);
        newPoll.exists = true;

        emit PollCreated(pollCount, _question, _options);
        pollCount++;
    }

    function vote(uint256 _pollId, uint256 _optionIndex) public {
        require(polls[_pollId].exists, "Poll does not exist");
        require(!hasVoted[_pollId][msg.sender], "Already voted");
        require(_optionIndex < polls[_pollId].options.length, "Invalid option");

        polls[_pollId].votes[_optionIndex]++;
        hasVoted[_pollId][msg.sender] = true;

        emit VoteCasted(_pollId, _optionIndex, msg.sender);
    }

    function getPoll(uint256 _pollId) public view returns (
        uint256 id,
        string memory question,
        string[] memory options,
        uint256[] memory votes
    ) {
        require(polls[_pollId].exists, "Poll does not exist");
        Poll storage p = polls[_pollId];
        return (p.id, p.question, p.options, p.votes);
    }

    function getPollCount() public view returns (uint256) {
        return pollCount;
    }
}
