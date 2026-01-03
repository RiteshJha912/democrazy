export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0xYourContractAddressHere";

export const VOTING_ABI = [
  "function createPoll(string _question, string[] _options) public",
  "function vote(uint256 _pollId, uint256 _optionIndex) public",
  "function getPoll(uint256 _pollId) public view returns (uint256, string, string[], uint256[])",
  "function pollCount() public view returns (uint256)",
  "event PollCreated(uint256 indexed pollId, string question, string[] options)",
  "event VoteCasted(uint256 indexed pollId, uint256 optionIndex, address voter)"
];
