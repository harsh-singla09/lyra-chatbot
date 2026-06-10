const USER_NAME = "Harsh";
const BOT_NAME = "Lyra";

window.onload = () => {
    addMessage(
        BOT_NAME,
        `Hey ${USER_NAME}! 👋 I'm Lyra. Welcome to my portfolio demo.`,
        "ai"
    );
};

function addMessage(sender, text, type) {
    const chatbox = document.getElementById("chatbox");

    const msg = document.createElement("div");
    msg.classList.add("msg", type);

    msg.innerHTML = `
        <strong>${sender}</strong><br>
        ${text}
    `;

    chatbox.appendChild(msg);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function handleKey(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();

    if (!message) return;

    addMessage(USER_NAME, message, "user");
    input.value = "";

    addMessage(BOT_NAME, "Typing...", "ai");

    setTimeout(() => {
        const typing =
            document.querySelectorAll(".ai")[
                document.querySelectorAll(".ai").length - 1
            ];

        if (typing) typing.remove();

        const reply = generateReply(message);

        addMessage(BOT_NAME, reply, "ai");
        speak(reply);

    }, 1000);
}

function generateReply(message) {
    const msg = message.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) {
        return "Hello Harsh! 👋 Nice to meet you.";
    }

    if (msg.includes("hii") || msg.includes("hi")) {
        return "Hello Harsh! 👋 Nice to meet you.";
    }

    if (msg.includes("hey") || msg.includes("hi")) {
        return "Hello Harsh! 👋 Nice to meet you.";
    }

    if (msg.includes("who are you")) {
        return "I'm Lyra 🤖, an AI assistant built by Harsh Singla.";
    }

    if (msg.includes("project")) {
        return "Lyra is an AI assistant powered by Ollama in the full version.";
    }

    if (msg.includes("tech")) {
        return "Tech Stack: JavaScript, Node.js, Express, Ollama, HTML, CSS.";
    }

    if (msg.includes("ollama")) {
        return "The complete version runs locally using Ollama for private AI inference.";
    }

    if (msg.includes("harsh")) {
        return "Harsh is the developer who built Lyra as an AI portfolio project.";
    }

    return "🚀 This is the portfolio demo version of Lyra. The complete AI assistant runs locally using Ollama.";
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function startVoice() {
    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;

        document.getElementById("userInput").value = text;

        sendMessage();
    };

    recognition.start();
}