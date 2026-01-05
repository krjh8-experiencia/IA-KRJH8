let chats = JSON.parse(localStorage.getItem("chats")) || {};
let currentChat = null;

const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");

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
  chats[id].messages.forEach(m => {
    const div = document.createElement("div");
    div.className = "msg " + m.role;
    div.textContent = `${m.role}: ${m.content}`;
    messages.appendChild(div);
  });
}

document.getElementById("newChat").onclick = () => {
  const id = Date.now();
  chats[id] = { title: "Nuevo chat", messages: [] };
  save();
  renderChats();
  openChat(id);
};

document.getElementById("send").onclick = () => {
  if (!currentChat) return;

  const input = document.getElementById("prompt");
  const text = input.value;
  input.value = "";

  chats[currentChat].messages.push({ role: "user", content: text });

  // Mock IA
  chats[currentChat].messages.push({ role: "ai", content: "Respuesta de Grok..." });

  save();
  openChat(currentChat);
};

renderChats();
