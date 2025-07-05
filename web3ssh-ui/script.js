// ✅ Replace this with your actual deployed contract address
const contractAddress = "0x4c54cDF9a37f8c29fb7da1cdD5762f65DeD96A42";


// ✅ Contract ABI
const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "activity", "type": "string" }
    ],
    "name": "submitOffset",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOffsets",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "activity", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "address", "name": "from", "type": "address" }
        ],
        "internalType": "struct GreenChain.Offset[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;

// ✅ Connect MetaMask & Contract
async function connect() {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      console.log("🦊 Connected address:", address);
      alert(`✅ Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`);

      // Optional: change button text
      document.querySelector("button").textContent = "Wallet Connected";
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
    }
  } else {
    alert("🦊 Please install MetaMask to connect your wallet!");
  }
}


// ✅ Submit a new carbon offset activity
async function submitOffset() {
  try {
    if (!provider || !signer || !contract) {
      await connect();
    }

    const name = document.getElementById("name").value;
    const activity = document.getElementById("activity").value;

    if (!name || !activity) {
      alert("Please enter both name and activity.");
      return;
    }

    const tx = await contract.submitOffset(name, activity, {
      value: ethers.utils.parseEther("0.001"), // example fee
    });

    await tx.wait();
    alert("✅ Offset submitted successfully!");
    getOffsets();
  } catch (error) {
    console.error("❌ Error submitting offset:", error);
    alert("❌ Transaction failed. Check the console for details.");
  }
}

// ✅ Load and display all past offsets
async function getOffsets() {
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    contract = new ethers.Contract(contractAddress, contractABI, provider);

    const offsets = await contract.getOffsets();
    const container = document.getElementById("offsets");
    container.innerHTML = ""; // Clear previous

    if (offsets.length === 0) {
      container.innerHTML = "No offsets submitted yet.";
      return;
    }

    offsets.forEach((o) => {
      const div = document.createElement("div");
      const date = new Date(Number(o.timestamp) * 1000).toLocaleString();
      div.innerHTML = `
        <strong>${o.name}</strong> 🌿 "${o.activity}" <br/>
        ⏱ ${date} <br/>
        👛 <small>${o.from}</small>
        <hr/>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Error loading offsets:", err);
    document.getElementById("offsets").innerHTML = "Error fetching offsets.";
  }
}

// ✅ Load offsets on page load
window.onload = getOffsets;


