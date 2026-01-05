const GROK_API_KEY = "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";

let chats = JSON.parse(localStorage.getItem("chats")) || {};
let currentChat = null;

const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const input = document.getElementById("prompt");

function save() {
  localStorage.setItem("chats", JSON.stringify(chats));
}

function renderChats() {
  chatList.innerHTML = "";
  Object.keys(chats).forEach(id => {
    const li = document.createElement("li");
    li.textContent = chats[id].title;
    li.onclick = () => openChat(id);
    chatList.appendChild(li);
  });
}

function openChat(id) {
  currentChat = id;
  messages.innerHTML = "";
  chats[id].messages.forEach(m => addMessage(m.role, m.content));
}

function addMessage(role, content) {
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.textContent = content;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function newChat() {
  const id = Date.now();
  chats[id] = { title: "Nuevo chat", messages: [] };
  save();
  renderChats();
  openChat(id);
}

async function sendMessage() {
  if (!currentChat || !input.value.trim()) return;

  const text = input.value;
  input.value = "";

  chats[currentChat].messages.push({ role: "user", content: text });
  addMessage("user", text);
  addMessage("ai", "Pensando...");

  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2",
        messages: chats[currentChat].messages
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sin respuesta";

    chats[currentChat].messages.pop();
    chats[currentChat].messages.push({ role: "ai", content: reply });

    openChat(currentChat);
    save();
  } catch (e) {
    addMessage("ai", "❌ Error con Grok");
  }
}

document.getElementById("newChat").onclick = newChat;
document.getElementById("send").onclick = sendMessage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

if (Object.keys(chats).length === 0) newChat();
else {
  renderChats();
  openChat(Object.keys(chats)[0]);
}
