require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ethers } = require('ethers');
const Poll = require('./models/Poll');
const pollRoutes = require('./routes/polls');

// Placeholder for ABI - User must ensure this file exists or is updated
const fs = require('fs');
let votingABI = [];
try {
    const artifact = JSON.parse(fs.readFileSync('../smart-contract/artifacts/contracts/Voting.sol/Voting.json', 'utf8'));
    votingABI = artifact.abi;
} catch (e) {
    console.log("Could not load ABI yet. Ensure contracts are compiled.");
}

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voting-dapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Democrazy API is running'));
app.use('/api/polls', pollRoutes);

// Sync past polls on startup
const syncPastPolls = async () => {
    if (!process.env.SEPOLIA_URL || !process.env.CONTRACT_ADDRESS || votingABI.length === 0) return;
    try {
        console.log("Starting historical sync...");
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, votingABI, provider);
        
        const events = await contract.queryFilter("PollCreated");
        for (const event of events) {
            const pollId = Number(event.args[0]);
            const question = event.args[1];
            const options = event.args[2];
            
            const exists = await Poll.findOne({ pollId });
            if (!exists) {
                await new Poll({
                    pollId,
                    question,
                    options,
                    votes: new Array(options.length).fill(0)
                }).save();
                console.log(`Restored missing poll #${pollId}`);
            }
        }
        console.log("History sync complete.");
    } catch (e) {
        console.error("Sync error:", e);
    }
};

// Smart Contract Listener Setup
const setupListeners = async () => {
    if (!process.env.SEPOLIA_URL || !process.env.CONTRACT_ADDRESS || votingABI.length === 0) {
        console.log("Skipping listener setup: Missing config or ABI");
        return;
    }

    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, votingABI, provider);

    console.log("Listening for contract events...");

    contract.on("PollCreated", async (pollId, question, options) => {
        console.log("Event: PollCreated", pollId, question);
        try {
             // Check if exists to avoid duplicates
            const exists = await Poll.findOne({ pollId: Number(pollId) });
            if (!exists) {
                const newPoll = new Poll({
                    pollId: Number(pollId),
                    question,
                    options,
                    votes: new Array(options.length).fill(0)
                });
                await newPoll.save();
                console.log("Poll saved to DB");
            }
        } catch(e) { console.error("Error saving poll:", e); }
    });

    contract.on("VoteCasted", async (pollId, optionIndex, voter) => {
        console.log("Event: VoteCasted", pollId, optionIndex);
        try {
            const poll = await Poll.findOne({ pollId: Number(pollId) });
            if(poll) {
                poll.votes[optionIndex]++;
                poll.markModified('votes'); // Necessary for array updates depending on Mongoose version
                await poll.save();
                console.log("Vote updated in DB");
            }
        } catch(e) { console.error("Error updating vote:", e); }
    });
};

// Verify connection then sync & listen
mongoose.connection.once('open', () => {
    syncPastPolls().then(() => setupListeners());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
