// ---------- Initialize Personality & Memory ----------
let personality = JSON.parse(localStorage.getItem("personality")) || {
    tease: 5,
    bold: 5,
    charm: 5,
    confidence: 5,
    xp: 0
};

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// ---------- UI References ----------
const chatWindow = document.getElementById("chatWindow");
const xpDisplay = document.getElementById("xpDisplay");
const resetBtn = document.getElementById("resetBtn");

xpDisplay.innerText = `XP: ${personality.xp}`;

// ---------- Event Listeners ----------
resetBtn.onclick = () => {
    if(confirm("Reset all memory and XP?")) {
        localStorage.clear();
        personality = { tease:5, bold:5, charm:5, confidence:5, xp:0 };
        chatHistory = [];
        chatWindow.innerHTML = "";
        xpDisplay.innerText = `XP: ${personality.xp}`;
    }
}

// ---------- Send Message ----------
function sendMessage() {
    let input = document.getElementById("userInput");
    let message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatHistory.push({ role: "user", content: message });
    input.value = "";

    setTimeout(() => {
        let reply = generatePlayboyReply(message);
        addMessage(reply, "bot");
        chatHistory.push({ role: "assistant", content: reply });
        analyzeChat(message, reply);
        saveMemory();
    }, 500 + Math.random() * 1000);
}

// ---------- Add Message to Chat ----------
function addMessage(text, sender) {
    let msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.innerText = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ---------- Generate Reply ----------
function generatePlayboyReply(msg) {
    msg = msg.toLowerCase();
    
    // Basic keyword triggers
    if (msg.includes("hi") || msg.includes("hello")) 
        return "Hey gorgeous… what’s stealing your smile today? 😏";
    if (msg.includes("bored"))
        return "Then let me entertain you… I’m good at that. 😌";
    if (msg.includes("miss"))
        return "Careful… I get addictive. You sure you wanna miss *me*? 😘";
    if (msg.includes("love"))
        return "Love? Slow down angel… let’s flirt first 😏🔥";

    // Personality influenced responses
    let teaseLevel = personality.tease;
    let boldLevel = personality.bold;
    let charmLevel = personality.charm;
    let confidenceLevel = personality.confidence;

    let options = [
        `So… when did you get this pretty? 👀🔥`,
        `Be honest… do you flirt this good with everyone or am I special?`,
        `I like your vibe… it feels like trouble. My favorite kind 😉`,
        `If I flirt with you, just know… I mean it 😌`,
        `Your energy? Dangerous. I like it too much 😈`,
        `Say one more cute thing and I might fall for you 😳`
    ];

    // Modify response slightly by personality
    let index = Math.floor(Math.random() * options.length);
    let response = options[index];

    if (teaseLevel > 7) response += " 😏";
    if (boldLevel > 7) response = "🔥 " + response;
    if (charmLevel > 7) response = response.replace("I like your vibe","You + me = perfect vibe");
    if (confidenceLevel > 7) response = response.toUpperCase();

    return response;
}

// ---------- Analyze Chat ----------
function analyzeChat(userMsg, botMsg) {
    // Simple heuristic: reward XP if user says flirty words
    let flirtyWords = ["cute","love","miss","bored","hi","hello"];
    let reward = flirtyWords.some(w => userMsg.toLowerCase().includes(w)) ? 2 : 1;

    personality.xp += reward;

    // Slowly evolve personality
    personality.tease = Math.min(10, personality.tease + Math.random()*0.3);
    personality.bold = Math.min(10, personality.bold + Math.random()*0.3);
    personality.charm = Math.min(10, personality.charm + Math.random()*0.3);
    personality.confidence = Math.min(10, personality.confidence + Math.random()*0.3);

    xpDisplay.innerText = `XP: ${Math.floor(personality.xp)}`;
}

// ---------- Save Memory ----------
function saveMemory() {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    localStorage.setItem("personality", JSON.stringify(personality));
}
