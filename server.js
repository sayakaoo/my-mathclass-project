require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://vercel.live"
  );
  next();
});

// それ以外の全てのリクエストに対してindex.htmlを返す
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

module.exports = app;

app.use(bodyParser.json());
app.use(express.static('public')); // 静的ファイルを提供

// 解答評価用のAPIエンドポイント
app.post('/api/evaluate', async (req, res) => {
  const userAnswer = req.body.userAnswer;

  // プロンプトの作成
  const prompt = `あなたは教師です。以下のルールで正答判定をしてください：
1. ユーザーの回答を正答の例に基づいて「正解」または「不正解」と表示してください

  正答の例：
  - 正方形が1つ増えるごとにマッチ棒は3本ずつ増えていくから、式は「1 + 3n」になる。
  - 青色で囲んでいる一本が最初にあり、そのあとはコの字型の繰り返しになる。コの字型は3本のマッチ棒からなっているので、式は「1 + 3n」になる。

  以下の解答に基づいて評価を行ってください：
  ユーザーの解答：${userAnswer}`;

  try {
    // OpenAI APIを呼び出す
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 50,
    });

    // レスポンスを送信
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('エラーが発生しました:', error.response?.data || error.message);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

