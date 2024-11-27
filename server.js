const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(process.env.OPENAI_API_KEY);
(async () => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "prompt" }],
  });
  console.log(completion.choices[0].message);
})();

const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));  // 静的ファイルを提供

// 解答評価用のAPIエンドポイント
app.post('/evaluate-answer', async (req, res) => {
  const userAnswer = req.body.userAnswer;

  const prompt = `あなたは教師です。以下のルールで正答判定をしてください：
1. ユーザーの解答において、正しい式「1 + 3n」への言及があれば、それが適切に説明されているかを判断してください。
2. ユーザーの解答が異なる表現であっても、正しい考え方に基づいていれば「正解です！」と伝え、誤りがあれば不足している部分や誤りを指摘してください。
3. 必要に応じて、ユーザーに簡単なヒントを与えて解答を改善させてください。

正答の例：
- 正方形が1つ増えるごとにマッチ棒は3本ずつ増えていくから、式は「1 + 3n」になる。
- 青色で囲んでいる一本が最初にあり、そのあとはコの字型の繰り返しになる。コの字型は3本のマッチ棒からなっているので、式は「1 + 3n」になる。

以下の解答に基づいて評価を行ってください：
ユーザーの解答：${userAnswer}
ユーザーの解答における「3n + 1」などの言及に対して適切な評価を行ってください。`;

  // ここでAPI呼び出しなどの処理を行う
  // 例：openai.createCompletion(...)

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
