/* €20 — AI Assistant Widget (Rule-based, No API) */
(function() {
    const knowledgeBase = [
        {
            keywords: ['buy', 'purchase', 'how to buy', 'купить', 'где купить'],
            answer: `You can buy **€20** in 3 ways:<br><br>
            💳 <b>Card / OpenSea:</b> <a href="https://opensea.io/token/solana/EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg" target="_blank">Buy on OpenSea</a><br>
            🔄 <b>Jupiter Swap:</b> <a href="https://jup.ag/swap/SOL-EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg" target="_blank">Swap on Jupiter</a><br>
            🦄 <b>Uniswap:</b> <a href="https://app.uniswap.org/explore/tokens/solana/EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg" target="_blank">Buy on Uniswap</a>`
        },
        {
            keywords: ['price', 'cost', 'цена', 'стоимость', 'how much', 'target'],
            answer: `The launch price is **€0.02**. The target is **×100 to €2.00**.<br><br>Check live data on <a href="https://app.uniswap.org/explore/tokens/solana/EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg" target="_blank">Uniswap</a>.`
        },
        {
            keywords: ['contract', 'address', 'контракт', 'адрес', 'ca'],
            answer: `The official contract address for €20 is:<br><br><code style="background:#1A1E41; padding:4px 8px; border-radius:4px; font-size:11px; word-break:break-all; color:#FFD700;">EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg</code><br><br><a href="https://solscan.io/token/EVr3k6rruveLtQiLadvNiKhK8e4WecnLHZxhcJwRDuTg" target="_blank">🔍 Verify on Solscan</a>`
        },
        {
            keywords: ['pool', 'liquidity', 'meteora', 'uniswap', 'пул', 'ликвидность'],
            answer: `€20 liquidity is available on Uniswap (via Wormhole).<br><br>Check all routing options on the <a href="ecosystem.html">Ecosystem Map</a>.`
        },
        {
            keywords: ['ecosystem', 'what is', 'about', 'экосистема', 'что это'],
            answer: `**€20** is the 20-euro token of the One•Two•Three ecosystem on Solana. Built on **Token-2022** for institutional-grade finance, SEPA-ready, with 20B fixed supply.<br><br><a href="index.html">Read more on Home</a>`
        },
        {
            keywords: ['taxi', 'hub'],
            answer: `**$TAXI** is the secondary routing hub in the ecosystem. Routing through $ONE and $TAXI ensures the best liquidity path. See the <a href="ecosystem.html">Ecosystem Map</a>.`
        },
        {
            keywords: ['standard', 'token-2022', '2022'],
            answer: `€20 uses the **Token-2022** standard on Solana. This enables transfer fees, confidential transfers, and compliance hooks for institutional-grade DeFi.`
        }
    ];

    const widgetHTML = `
        <style>
            #ai-agent-btn {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                width: 60px; height: 60px; border-radius: 50%;
                background: #003399; color: #fff; border: 2px solid #4A8CFF;
                font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 51, 153, 0.6);
                transition: 0.3s; display: flex; align-items: center; justify-content: center;
            }
            #ai-agent-btn:hover { transform: scale(1.1); background: #4A8CFF; color: #0A0E27; }
            
            #ai-agent-window {
                position: fixed; bottom: 90px; right: 20px; z-index: 9999;
                width: 350px; max-width: calc(100vw - 40px);
                background: #0A0E27; border: 1px solid #1E2350; border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.8);
                display: none; flex-direction: column; overflow: hidden;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            #ai-agent-window.open { display: flex; }
            
            #ai-header {
                background: #1A1E41; padding: 12px 16px; border-bottom: 1px solid #1E2350;
                display: flex; justify-content: space-between; align-items: center;
            }
            #ai-header h3 { margin: 0; font-size: 15px; color: #fff; display: flex; align-items: center; gap: 8px; }
            #ai-header h3 span { color: #4A8CFF; }
            #ai-close { background: transparent; border: none; color: #8A94C8; font-size: 20px; cursor: pointer; }
            #ai-close:hover { color: #fff; }
            
            #ai-messages {
                padding: 16px; height: 300px; overflow-y: auto;
                display: flex; flex-direction: column; gap: 10px;
            }
            .ai-msg {
                padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5;
                max-width: 90%; word-wrap: break-word;
            }
            .ai-msg.bot { background: #1A1E41; color: #E0E6FF; align-self: flex-start; border-bottom-left-radius: 4px; }
            .ai-msg.user { background: #003399; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
            .ai-msg a { color: #4A8CFF; text-decoration: underline; }
            .ai-msg a:hover { color: #fff; }
            
            #ai-input-area {
                display: flex; padding: 12px; border-top: 1px solid #1E2350; background: #060920;
            }
            #ai-input {
                flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #1E2350;
                background: #0A0E27; color: #fff; outline: none; font-size: 13px;
            }
            #ai-input:focus { border-color: #4A8CFF; }
            #ai-send {
                margin-left: 8px; padding: 0 16px; background: #4A8CFF; color: #0A0E27;
                border: none; border-radius: 8px; font-weight: bold; cursor: pointer;
            }
            #ai-send:hover { background: #fff; }

            #ai-suggestions {
                padding: 0 16px 12px; display: flex; gap: 6px; flex-wrap: wrap; background: #060920;
            }
            .ai-chip {
                background: rgba(74,140,255,0.1); color: #4A8CFF; border: 1px solid rgba(74,140,255,0.3);
                padding: 4px 10px; border-radius: 12px; font-size: 11px; cursor: pointer; transition: 0.2s;
            }
            .ai-chip:hover { background: #4A8CFF; color: #0A0E27; }

            @media (max-width: 480px) {
                #ai-agent-window { width: calc(100vw - 40px); bottom: 80px; }
                #ai-messages { height: 250px; }
            }
        </style>

        <button id="ai-agent-btn" title="Ask AI about €20">🤖</button>

        <div id="ai-agent-window">
            <div id="ai-header">
                <h3>🤖 <span>€20</span> AI Assistant</h3>
                <button id="ai-close">×</button>
            </div>
            <div id="ai-messages">
                <div class="ai-msg bot">Hello! I'm the <b>€20</b> AI Assistant. Ask me about how to buy, the contract address, or the ecosystem.</div>
            </div>
            <div id="ai-suggestions">
                <span class="ai-chip" data-q="How to buy?">How to buy?</span>
                <span class="ai-chip" data-q="What is the price?">Price</span>
                <span class="ai-chip" data-q="Contract address">Contract</span>
                <span class="ai-chip" data-q="What is €20?">About</span>
            </div>
            <div id="ai-input-area">
                <input type="text" id="ai-input" placeholder="Ask me anything..." autocomplete="off" />
                <button id="ai-send">➤</button>
            </div>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container);

        const btn = document.getElementById('ai-agent-btn');
        const win = document.getElementById('ai-agent-window');
        const closeBtn = document.getElementById('ai-close');
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const messages = document.getElementById('ai-messages');
        const chips = document.querySelectorAll('.ai-chip');

        btn.addEventListener('click', () => {
            win.classList.toggle('open');
            if (win.classList.contains('open')) input.focus();
        });
        closeBtn.addEventListener('click', () => win.classList.remove('open'));

        function sendMessage(text) {
            if (!text.trim()) return;

            const userMsg = document.createElement('div');
            userMsg.className = 'ai-msg user';
            userMsg.textContent = text;
            messages.appendChild(userMsg);
            messages.scrollTop = messages.scrollHeight;
            input.value = '';

            const typing = document.createElement('div');
            typing.className = 'ai-msg bot';
            typing.textContent = '...';
            messages.appendChild(typing);
            messages.scrollTop = messages.scrollHeight;

            setTimeout(() => {
                typing.remove();
                const query = text.toLowerCase();
                let bestMatch = null;

                for (let item of knowledgeBase) {
                    if (item.keywords.some(k => query.includes(k))) {
                        bestMatch = item.answer;
                        break;
                    }
                }

                const botMsg = document.createElement('div');
                botMsg.className = 'ai-msg bot';
                
                if (bestMatch) {
                    botMsg.innerHTML = bestMatch;
                } else {
                    botMsg.innerHTML = `I'm not sure. Try asking: <br>• "How to buy?"<br>• "Price"<br>• "Contract"<br>• Or check the <a href="ecosystem.html">Ecosystem Map</a>.`;
                }
                
                messages.appendChild(botMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 500);
        }

        sendBtn.addEventListener('click', () => sendMessage(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage(input.value);
        });

        chips.forEach(chip => {
            chip.addEventListener('click', () => sendMessage(chip.dataset.q));
        });
    });
})();
