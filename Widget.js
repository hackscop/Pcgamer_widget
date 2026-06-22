(function() {
    // 1. Inject the CSS for the Red/White/Black Theme
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: sans-serif; }
        #ai-chat-button { 
            background: #E60000; color: #FFFFFF; 
            border: none; width: 65px; height: 65px; border-radius: 50%; 
            cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
            display: flex; align-items: center; justify-content: center; transition: 0.2s;
        }
        #ai-chat-button:hover { transform: scale(1.05); }
        #ai-chat-button:hover svg { fill: #111; } /* Subtile hover effect */
        #ai-chat-button svg { width: 35px; height: 35px; fill: #FFFFFF; }
        #ai-chat-window { 
            display: none; width: 350px; height: 450px; 
            background: #FFFFFF; border: 1px solid #111; 
            border-radius: 10px; flex-direction: column; 
            box-shadow: 0 10px 15px rgba(0,0,0,0.5); overflow: hidden; margin-bottom: 15px; 
        }
        #ai-chat-header { 
            background: #111111; color: #FFFFFF; padding: 15px; 
            font-weight: bold; text-align: center; border-bottom: 4px solid #E60000;
        }
        #ai-chat-messages { 
            flex-grow: 1; padding: 15px; overflow-y: auto; 
            background: #F4F4F4; color: #000; font-size: 14px; 
            display: flex; flex-direction: column; gap: 10px; 
        }
        .user-msg { 
            align-self: flex-end; background: #E60000; color: #FFFFFF; 
            padding: 10px; border-radius: 10px 10px 0 10px; max-width: 80%; line-height: 1.4;
        }
        .ai-msg { 
            align-self: flex-start; background: #FFFFFF; color: #111111; 
            padding: 10px; border-radius: 10px 10px 10px 0; border: 1px solid #CCC; max-width: 80%; line-height: 1.4;
        }
        .error-msg {
            align-self: flex-start; background: #111111; color: #E60000; 
            padding: 10px; border-radius: 10px; border: 1px solid #E60000; font-weight: bold;
        }
        #ai-chat-input-area { display: flex; border-top: 1px solid #CCC; background: #FFF; }
        #ai-chat-input { 
            flex-grow: 1; padding: 15px; border: none; 
            background: #FFFFFF; color: #111111; outline: none; 
        }
        #ai-chat-send { 
            background: #111111; color: #FFFFFF; border: none; 
            padding: 0 20px; cursor: pointer; font-weight: bold; transition: 0.2s;
        }
        #ai-chat-send:hover { background: #E60000; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Structure
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
        <button id="ai-chat-button">
            <!-- Custom AI Star Icon -->
            <svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"></path></svg>
        </button>
    `;
    document.body.appendChild(widgetContainer);

    // 3. UI Logic and API Call
    const chatButton = document.getElementById('ai-chat-button');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSend = document.getElementById('ai-chat-send');
    const chatMessages = document.getElementById('ai-chat-messages');

    chatButton.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    // The corrected backend URL including /api/chat
    const BACKEND_URL = "https://pcgamer-api.onrender.com/api/chat";

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        chatMessages.innerHTML += \`<div class="user-msg">\${text}</div>\`;
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            chatMessages.innerHTML += \`<div class="ai-msg">\${data.reply}</div>\`;
        } catch (error) {
            chatMessages.innerHTML += \`<div class="error-msg">Server offline. Please try again.</div>\`;
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
})();
