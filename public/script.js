

const socket = io();

let username;
const textarea = document.getElementById('textarea'); // Fixed ID name
const chatContainer = document.querySelector('.chat_container');
const sendBtn = document.getElementById('sendBtn');
// Ask user for name
do {
    username = prompt('Please enter your name:');
} while (!username);

// Send message on Enter key
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        sendMessage(e.target.value);
        e.preventDefault(); // Prevent newline
    }
});

// Send message on button click
sendBtn.addEventListener('click', () => {
    sendMessage(textarea.value);
});

// Send message function
function sendMessage(message) {
    message = message.trim();
    if (!message) return;

    const msg = {
        user: username,
        message: message
    };

    appendMessage(msg, 'outgoing-message');
    socket.emit('message', msg);
    textarea.value = '';
    scrollToBottom();
}

// Append message to DOM
function appendMessage(msg, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(type);

    const markup = `
        <div class="message-content">${msg.message}</div>
        <div class="message-time">${msg.user}</div>
    `;

    messageDiv.innerHTML = markup;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Receive message
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming-message');
});

// Auto-scroll to latest message
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
