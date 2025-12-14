const express = require('express');
const app = express();
const PORT = 3000;

// 1. Middleware для JSON (обязательно)
app.use(express.json());

// 2. Наш middleware для логирования (обязательно)
app.use((req, res, next) => {
    console.log(`[LOG] ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
});

// 3. Раздача статики (обязательно)
app.use(express.static(__dirname));

// 4. Цитаты
const quotes = [
    { id: 1, text: "Учиться, учиться и учиться", author: "Ленин" },
    { id: 2, text: "Быть или не быть", author: "Шекспир" },
    { id: 3, text: "Знание - сила", author: "Бэкон" },
    { id: 4, text: "Делай, что можешь, с тем, что имеешь, там, где ты есть", author: "Рузвельт" },
    { id: 5, text: "Стремитесь не к успеху, а к ценностям, которые он дает!", author: "Эйнштейн" },
];

// 5. API маршруты:

// GET все цитаты
app.get('/api/quotes', (req, res) => {
    console.log('API: Запрос всех цитат');
    res.json(quotes);
});

// GET случайная цитата
app.get('/api/quotes/random', (req, res) => {
    console.log('API: Запрос случайной цитаты');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
});

// GET цитата по ID (req.params)
app.get('/api/quotes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`API: Запрос цитаты ID=${id}`);
    const quote = quotes.find(q => q.id === id);
    res.json(quote || { error: "Не найдено" });
});

// POST добавить цитату (req.body)
app.post('/api/quotes', (req, res) => {
    console.log('API: Добавление цитаты', req.body);
    const { text, author } = req.body;
    
    if (!text || !author) {
        return res.status(400).json({ error: "Нужны текст и автор" });
    }
    
    const newQuote = {
        id: quotes.length + 1,
        text,
        author
    };
    
    quotes.push(newQuote);
    res.status(201).json(newQuote);
});

// 6. Главная страница
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Генератор цитат - Express App</title>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    max-width: 800px;
                    width: 100%;
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 30px;
                }
                .quote-box {
                    background: #f8f9fa;
                    padding: 30px;
                    border-radius: 15px;
                    margin: 30px 0;
                    border-left: 5px solid #667eea;
                }
                #quoteText {
                    font-size: 24px;
                    color: #2c3e50;
                    margin-bottom: 15px;
                    font-style: italic;
                }
                #quoteAuthor {
                    font-size: 20px;
                    color: #667eea;
                    font-weight: bold;
                }
                button {
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    font-size: 18px;
                    border-radius: 10px;
                    cursor: pointer;
                    margin: 20px;
                }
                button:hover {
                    background: #5a67d8;
                }
                .info {
                    background: #f1f3f9;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 30px;
                    text-align: left;
                }
                .endpoint {
                    background: white;
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px 0;
                }
                .method {
                    background: #48bb78;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                    margin-right: 10px;
                }
                code {
                    background: #2d3748;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎲 Генератор случайных цитат</h1>
                
                <div class="quote-box">
                    <div id="quoteText">Нажмите кнопку для цитаты</div>
                    <div id="quoteAuthor"></div>
                </div>
                
                <button onclick="getRandomQuote()">🎲 Случайная цитата</button>
                
                <div class="info">
                    <h3>📡 API маршруты Express:</h3>
                    <div class="endpoint">
                        <span class="method">GET</span>
                        <code>/api/quotes</code> - Все цитаты
                    </div>
                    <div class="endpoint">
                        <span class="method">GET</span>
                        <code>/api/quotes/random</code> - Случайная
                    </div>
                    <div class="endpoint">
                        <span class="method">GET</span>
                        <code>/api/quotes/1</code> - По ID
                    </div>
                    <div class="endpoint">
                        <span class="method">POST</span>
                        <code>/api/quotes</code> - Добавить
                    </div>
                </div>
            </div>
            
            <script>
                async function getRandomQuote() {
                    try {
                        const response = await fetch('/api/quotes/random');
                        const quote = await response.json();
                        
                        document.getElementById('quoteText').textContent = '"' + quote.text + '"';
                        document.getElementById('quoteAuthor').textContent = '— ' + quote.author;
                    } catch (error) {
                        document.getElementById('quoteText').textContent = 'Ошибка загрузки';
                        console.error(error);
                    }
                }
                
                // Первая цитата
                getRandomQuote();
            </script>
        </body>
        </html>
    `);
});

// 7. Запуск
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('='.repeat(50));
});