const socket = io();

let username;
const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const textarea = document.getElementById('textarea');
const imageInput = document.getElementById('imageInput');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalDownload = document.getElementById('modalDownload');

// Ask user for name
do {
  username = prompt('Please enter your name:');
} while (!username);

// Auto-send image on select
imageInput.addEventListener('change', () => {
  const imageFile = imageInput.files[0];
  if (!imageFile) return;

  const messageText = textarea.value.trim();

  const reader = new FileReader();
  reader.onload = () => {
    const msg = {
      user: username,
      message: messageText,
      image: reader.result // base64 image
    };
    appendMessage(msg, 'outgoing-message');
    socket.emit('message', msg);
    resetForm();
  };
  reader.readAsDataURL(imageFile);
});

// Send message on form submit (only text)
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage();
});

// Send message on Enter (without Shift)
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const messageText = textarea.value.trim();

  if (!messageText) return;

  const msg = {
    user: username,
    message: messageText,
    image: null
  };

  appendMessage(msg, 'outgoing-message');
  socket.emit('message', msg);
  resetForm();
}

function resetForm() {
  textarea.value = '';
  imageInput.value = '';
  scrollToBottom();
}

// Append message to DOM (text + image)
function appendMessage(msg, type) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(type);

  let imageHTML = '';
  if (msg.image) {
    imageHTML = `
      <img
        src="${msg.image}"
        alt="User image"
        style="max-width: 200px; max-height: 200px; display: block; margin-top: 8px; border-radius: 8px; cursor: pointer;"
        class="chat-image"
      />
    `;
  }

  const markup = `
    <div class="message-content">${msg.message || ''}</div>
    ${imageHTML}
    <div class="message-time">${msg.user}</div>
  `;

  messageDiv.innerHTML = markup;
  chatContainer.appendChild(messageDiv);

  // Scroll to bottom after appending
  scrollToBottom();

  // Add click listeners for images
  const imgs = messageDiv.querySelectorAll('.chat-image');
  imgs.forEach(img => {
    img.addEventListener('click', () => {
      modalImage.src = img.src;
      modalDownload.href = img.src;
      imageModal.style.display = 'flex';

      // Scroll to bottom in the modal (optional)
      scrollToBottom();
    });
  });
}

// Close modal on clicking the X
modalClose.addEventListener('click', () => {
  imageModal.style.display = 'none';
});

// Close modal if user clicks outside the image (optional)
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) {
    imageModal.style.display = 'none';
  }
});

// Scroll chat to the bottom
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Receive messages from server
socket.on('message', (msg) => {
  appendMessage(msg, 'incoming-message');
});
