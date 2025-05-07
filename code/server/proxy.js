const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;

// 使用 cors 中间件
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 代理接口
app.post('/api/chat', async (req, res) => {
  try {
    const response = await fetch("https://chat.hust.edu.cn/proxy-lt-671b/chat/completions", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "accept-language": "en,zh;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      body: JSON.stringify(req.body),
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text();
    res.send(data);
  } catch (error) {
    console.error('代理请求错误:', error);
    res.status(500).json({ error: '代理请求失败', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
});