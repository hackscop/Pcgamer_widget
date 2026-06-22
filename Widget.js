(function() {
    // 1. Dynamically Load Markdown Parser
    const markedScript = document.createElement('script');
    markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(markedScript);

    // 2. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = '#ai-chat-widget-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #E60000; color: #FFF; border: none; width: 65px; height: 65px; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; } #ai-chat-widget-btn svg { width: 35px; height: 35px; fill: #FFF; } #ai-chat-window { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #FFF; z-index: 10000; flex-direction: column; font-family: sans-serif; } #ai-chat-header { background: #111; color: #FFF; padding: 15px 20px 25px 20px; display: flex; align-items: center; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); } #ai-chat-close { background: none; border: none; color: #FFF; font-size: 24px; cursor: pointer; padding-right: 15px; font-weight: bold; } #ai-chat-logo { width: 40px; height: 40px; border-radius: 50%; background: #FFF; margin-right: 15px; object-fit: cover; } #ai-chat-title { font-size: 18px; font-weight: bold; } #ai-chat-messages { flex-grow: 1; padding: 20px; overflow-y: auto; background: #FFF; display: flex; flex-direction: column; gap: 15px; } .msg-wrapper { display: flex; flex-direction: column; max-width: 85%; } .msg-label { font-size: 11px; color: #888; margin-bottom: 5px; } .user-wrapper { align-self: flex-end; align-items: flex-end; } .user-msg { background: #E60000; color: #FFF; padding: 12px 18px; border-radius: 20px 20px 0 20px; font-size: 15px; line-height: 1.4; } .ai-wrapper { align-self: flex-start; align-items: flex-start; } .ai-msg { background: #F4F4F4; color: #111; padding: 12px 18px; border-radius: 20px 20px 20px 0; font-size: 15px; line-height: 1.4; } #ai-chat-input-area { display: flex; padding: 15px; background: #FFF; border-top: 1px solid #EEE; padding-bottom: 20px; align-items: center; gap: 10px; } #ai-chat-input { flex-grow: 1; background: #F4F4F4; border: none; padding: 15px 20px; border-radius: 30px; outline: none; font-size: 15px; } #ai-chat-send { background: #E60000; color: #FFF; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; } #ai-chat-send svg { width: 20px; height: 20px; fill: #FFF; } .typing-indicator { display: flex; gap: 5px; padding: 5px 10px; } .dot { width: 8px; height: 8px; background: #888; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; } .dot:nth-child(1) { animation-delay: -0.32s; } .dot:nth-child(2) { animation-delay: -0.16s; } @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }';
    document.head.appendChild(style);

    // 3. Inject HTML (With the new AI Spark Icon)
    const widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = '<button id="ai-chat-widget-btn"><svg viewBox="0 0 24 24"><path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z"/></svg></button><div id="ai-chat-window"><div id="ai-chat-header"><button id="ai-chat-close">&#10094;</button><img id="ai-chat-logo" src="YOUR_LOGO_URL_HERE" alt="Logo"><div id="ai-chat-title">PC Gamer 254</div></div><div id="ai-chat-messages"><div class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg">Hello! How can I help you build your PC today?</div></div></div><div id="ai-chat-input-area"><input type="text" id="ai-chat-input" placeholder="Type a message..."><button id="ai-chat-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button></div></div>';
    document.body.appendChild(widgetContainer);

    // 4. Logic
    const chatBtn = document.getElementById('ai-chat-widget-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeBtn = document.getElementById('ai-chat-close');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    chatBtn.addEventListener('click', function() { chatWindow.style.display = 'flex'; chatBtn.style.display = 'none'; });
    closeBtn.addEventListener('click', function() { chatWindow.style.display = 'none'; chatBtn.style.display = 'flex'; });

    const BACKEND_URL = "https://pcgamer-api.onrender.com/api/chat";

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        chatMessages.innerHTML += '<div class="msg-wrapper user-wrapper"><div class="msg-label">Customer</div><div class="user-msg">' + text + '</div></div>';
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Bring back the loading indicator
        const loadingId = 'loading-' + Date.now();
        chatMessages.innerHTML += '<div id="' + loadingId + '" class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg"><div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div></div>';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();
            const formattedReply = (typeof marked !== 'undefined') ? marked.parse(data.reply) : data.reply;
            
            // Remove the loading indicator
            const loadEl = document.getElementById(loadingId);
            if (loadEl) loadEl.remove();

            chatMessages.innerHTML += '<div class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg">' + formattedReply + '</div></div>';
        } catch (e) {
            // Remove the loading indicator on error too
            const loadEl = document.getElementById(loadingId);
            if (loadEl) loadEl.remove();
            
            chatMessages.innerHTML += '<div class="msg-wrapper ai-wrapper"><div class="msg-label">System</div><div class="ai-msg" style="color: #E60000;">Server offline.</div></div>';
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });
})();
