(function() {
    // 1. Inject the CSS for the chat widget
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif; }
        #ai-chat-button { background: #00ff00; color: #000; border: none; padding: 15px 20px; border-radius: 50px; cursor: pointer; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
        #ai-chat-window { display: none; width: 320px; height: 450px; background: #1a1a1a; border: 1px solid #333; border-radius: 10px; flex-direction: column; box-shadow: 0 10px 15px rgba(0,0,0,0.5); overflow: hidden; margin-bottom: 10px; }
        #ai-chat-header { background: #00ff00; color: #000; padding: 15px; font-weight: bold; text-align: center; }
        #ai-chat-messages { flex-grow: 1; padding: 15px; overflow-y: auto; color: #fff; font-size: 14px; display: flex; flex-direction: column; gap: 10px; }
        .user-msg { align-self: flex-end; background: #333; padding: 10px; border-radius: 10px; }
        .ai-msg { align-self: flex-start; background: #005500; padding: 10px; border-radius: 10px; }
        #ai-chat-input-area { display: flex; border-top: 1px solid #333; }
        #ai-chat-input { flex-grow: 1; padding: 15px; border: none; background: #1a1a1a; color: #fff; outline: none; }
        #ai-chat-send { background: #00ff00; color: #000; border: none; padding: 0 20px; cursor: pointer; font-weight: bold; }
    `;
    document.head.appendChild(style);

    // 2. Inject the HTML for the chat widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'ai-chat-widget';
    widgetContainer.innerHTML = `
        <div id="ai-chat-window">
            <div id="ai-chat-header">PC Gamer 254 Assistant</div>
            <div id="ai-chat-messages">
                <div class="ai-msg">Hello! How can I help you build your PC today?</div>
            </div>
            <div id="ai-chat-input-area">
                <input type="text" id="ai-chat-input" placeholder="Type a message...">
                <button id="ai-chat-send">Send</button>
            </div>
        </div>
        <button id="ai-chat-button">Chat with AI</button>
    `;
    document.body.appendChild(widgetContainer);

    // 3. UI Logic and Single-Tenant Fetch Request
    const chatButton = document.getElementById('ai-chat-button');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    // Toggle chat window
    chatButton.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    // Send message logic
    const BACKEND_URL = "https://your-temporary-render-url.onrender.com/api/chat";

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append User Message
        chatMessages.innerHTML += `<div class="user-msg">${text}</div>`;
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Clean API Call (No clientId)
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            
            if (!response.ok) throw new Error("Network error");
            
            const data = await response.json();
            
            // Append AI Message
            chatMessages.innerHTML += `<div class="ai-msg">${data.reply}</div>`;
        } catch (error) {
            chatMessages.innerHTML += `<div class="ai-msg" style="color: #ff4444;">Server offline. Please try again.</div>`;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
