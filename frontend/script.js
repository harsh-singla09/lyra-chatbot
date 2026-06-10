const USER_NAME = "Harsh";
const BOT_NAME = "Lyra";

window.onload = () => {
    addMessage(BOT_NAME, `Hey ${USER_NAME} 👋 I'm Lyra. Ready to help you!`, "ai");
};

function showTyping(id) {
    addMessage(BOT_NAME, "Typing...", "ai", id);
}

function removeTyping(id) {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) el.remove();
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    // 🧑 show user message first
    addMessage("Harsh", message, "user");
    input.value = "";

    // ⏳ typing indicator BEFORE API call
    const typingId = Date.now();
    showTyping(typingId);

    try {
        const res = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: `You are Lyra, a smart AI assistant developed by Harsh Singla. Always call the user Harsh. Keep responses short and helpful.\nUser: ${message}`
            })
        });

        const data = await res.json();

        // ❌ remove typing FIRST
        removeTyping(typingId);

        // 🤖 show AI response
        addMessage("Lyra", data.reply, "ai");

        // 🔊 speak response
        speak(data.reply);

    } catch (error) {
        removeTyping(typingId);
        addMessage("Lyra", "Something went wrong!", "ai");
        console.log(error);
    }
}

function addMessage(sender, text, type, id = null) {
    const chatbox = document.getElementById("chatbox");

    const msg = document.createElement("div");
    msg.classList.add("msg", type);

    if (id) msg.setAttribute("data-id", id);

    msg.innerHTML = `<b>${sender}:</b><br>${text}`;

    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice not supported in this browser. Use Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log("🎤 Listening...");
    };

    recognition.onresult = (event) => {
        const voiceText = event.results[0][0].transcript;

        console.log("You said:", voiceText);

        const input = document.getElementById("userInput");
        input.value = voiceText;

        // ⚡ IMPORTANT: delay sendMessage slightly
        setTimeout(() => {
            sendMessage();
        }, 200);
    };

    recognition.onerror = (err) => {
        console.log("Voice error:", err);
    };

    recognition.start();
}