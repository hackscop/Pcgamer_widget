(function() {
    // 1. Dynamically Load Markdown Parser
    var markedScript = document.createElement('script');
    markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
    document.head.appendChild(markedScript);

    // 2. Inject CSS
    var style = document.createElement('style');
    style.innerHTML = '#ai-chat-widget-btn { position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #111; color: #FFF; border: none; border-radius: 40px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 12px; transition: all 0.5s ease; overflow: hidden; } #ai-chat-widget-btn:hover { transform: scale(1.05); } #ai-btn-text { font-family: sans-serif; font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; transition: all 0.5s ease; max-width: 100px; opacity: 1; margin-left: 10px; margin-right: 5px; background: -webkit-linear-gradient(45deg, #8E2DE2, #00C9FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } .shrink-text { max-width: 0 !important; opacity: 0 !important; margin: 0 !important; } #ai-chat-window { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #FFF; z-index: 10000; flex-direction: column; font-family: sans-serif; } #ai-chat-header { background: #111; color: #FFF; padding: 15px 20px 25px 20px; display: flex; align-items: center; border-bottom-left-radius: 40px; border-bottom-right-radius: 40px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); } #ai-chat-close { background: none; border: none; color: #FFF; font-size: 24px; cursor: pointer; padding-right: 15px; font-weight: bold; } #ai-chat-logo { width: 40px; height: 40px; border-radius: 50%; background: #FFF; margin-right: 15px; object-fit: cover; } #ai-chat-title { font-size: 18px; font-weight: bold; } #ai-chat-messages { flex-grow: 1; padding: 20px; overflow-y: auto; background: #FFF; display: flex; flex-direction: column; gap: 15px; } .msg-wrapper { display: flex; flex-direction: column; max-width: 85%; } .msg-label { font-size: 11px; color: #888; margin-bottom: 5px; } .user-wrapper { align-self: flex-end; align-items: flex-end; } .user-msg { background: #E60000; color: #FFF; padding: 12px 18px; border-radius: 20px 20px 0 20px; font-size: 15px; line-height: 1.4; } .ai-wrapper { align-self: flex-start; align-items: flex-start; } .ai-msg { background: #F4F4F4; color: #111; padding: 12px 18px; border-radius: 20px 20px 20px 0; font-size: 15px; line-height: 1.4; min-height: 20px; } .ai-msg p { margin: 0 0 10px 0; } .ai-msg p:last-child { margin: 0; } .ai-msg ul { margin: 0; padding-left: 20px; } .ai-msg strong { font-weight: bold; color: #000; } #ai-chat-input-area { display: flex; padding: 15px; background: #FFF; border-top: 1px solid #EEE; padding-bottom: 20px; align-items: center; gap: 10px; } #ai-chat-input { flex-grow: 1; background: #F4F4F4; border: none; padding: 15px 20px; border-radius: 30px; outline: none; font-size: 15px; } #ai-chat-send { background: #E60000; color: #FFF; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; } #ai-chat-send svg { width: 20px; height: 20px; fill: #FFF; } .typing-indicator { display: flex; gap: 5px; padding: 5px 10px; } .dot { width: 8px; height: 8px; background: #888; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; } .dot:nth-child(1) { animation-delay: -0.32s; } .dot:nth-child(2) { animation-delay: -0.16s; } @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }';
    document.head.appendChild(style);

    // 3. Inject HTML
    var widgetContainer = document.createElement('div');
    widgetContainer.innerHTML = '<button id="ai-chat-widget-btn"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8E2DE2" /><stop offset="50%" stop-color="#4A00E0" /><stop offset="100%" stop-color="#00C9FF" /></linearGradient></defs><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="url(#metaGrad)"/><circle cx="12" cy="12" r="3.5" fill="url(#metaGrad)"/></svg><div id="ai-btn-text">Ask AI</div></button><div id="ai-chat-window"><div id="ai-chat-header"><button id="ai-chat-close">&#10094;</button><img id="ai-chat-logo" src="YOUR_LOGO_URL_HERE" alt="Logo"><div id="ai-chat-title">PC Gamer 254</div></div><div id="ai-chat-messages"><div class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg">Hello! How can I help you build your PC today?</div></div></div><div id="ai-chat-input-area"><input type="text" id="ai-chat-input" placeholder="Type a message..."><button id="ai-chat-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg></button></div></div>';
    document.body.appendChild(widgetContainer);

    // 4. Shrink "Ask AI" after 3 seconds
    setTimeout(function() {
        var textBtn = document.getElementById('ai-btn-text');
        if (textBtn) textBtn.className = 'shrink-text';
    }, 3000);
    // 5. Logic
    var chatBtn = document.getElementById('ai-chat-widget-btn');
    var chatWindow = document.getElementById('ai-chat-window');
    var closeBtn = document.getElementById('ai-chat-close');
    var chatInput = document.getElementById('ai-chat-input');
    var chatSend = document.getElementById('ai-chat-send');
    var chatMessages = document.getElementById('ai-chat-messages');

    chatBtn.addEventListener('click', function() { chatWindow.style.display = 'flex'; chatBtn.style.display = 'none'; });
    closeBtn.addEventListener('click', function() { chatWindow.style.display = 'none'; chatBtn.style.display = 'flex'; });

    var BACKEND_URL = "https://pcgamer-api.onrender.com/api/chat";


    // 6. The UPGRADED Typewriter Function
    function typeHTML(element, htmlString, speed) {
        element.innerHTML = '';
        var i = 0;
        var isTag = false;
        var text = '';
        var startTime = Date.now();

        function typeWriter() {
            var isAtBottom = (chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight) < 50;

            if (Date.now() - startTime > 5000) {
                element.innerHTML = htmlString;
                if (isAtBottom) chatMessages.scrollTop = chatMessages.scrollHeight;
                return;
            }

            if (i < htmlString.length) {
                text += htmlString.charAt(i);
                element.innerHTML = text;
                if (htmlString.charAt(i) === '<') isTag = true;
                if (htmlString.charAt(i) === '>') isTag = false;
                i++;
                
                if (isTag) {
                    typeWriter(); 
                } else {
                    setTimeout(typeWriter, speed);
                    if (isAtBottom) {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }
            }
        }
        typeWriter();
    }

    async function sendMessage() {
        var text = chatInput.value.trim();
        if (!text) return;

        chatMessages.innerHTML += '<div class="msg-wrapper user-wrapper"><div class="msg-label">Customer</div><div class="user-msg">' + text + '</div></div>';
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        var loadingId = 'loading-' + Date.now();
        chatMessages.innerHTML += '<div id="' + loadingId + '" class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg"><div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div></div>';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            var response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text })
            });
            var data = await response.json();
            var formattedReply = (typeof marked !== 'undefined') ? marked.parse(data.reply) : data.reply;
            
            var loadEl = document.getElementById(loadingId);
            if (loadEl) loadEl.remove();

            var typeId = 'type-' + Date.now();
            chatMessages.innerHTML += '<div class="msg-wrapper ai-wrapper"><div class="msg-label">PC Gamer 254</div><div class="ai-msg" id="' + typeId + '"></div></div>';
            
            var typeTarget = document.getElementById(typeId);
            typeHTML(typeTarget, formattedReply, 10); 

        } catch (e) {
            var loadElErr = document.getElementById(loadingId);
            if (loadElErr) loadElErr.remove();
            chatMessages.innerHTML += '<div class="msg-wrapper ai-wrapper"><div class="msg-label">System</div><div class="ai-msg" style="color: #E60000;">Server offline.</div></div>';
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMessage(); });
})();
