const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai'); // OpenAIApiをインポート

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));  // 静的ファイルを提供

// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 環境変数からAPIキーを取得
});
const openai = new OpenAIApi(configuration); // OpenAIApiのインスタンスを作成

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

  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo', // 使用するモデル
      prompt: prompt,
      max_tokens: 150, // レスポンスのトークン制限
    });

    const response = completion.data.choices[0].text.trim();
    res.json({ evaluation: response }); // APIレスポンスを返す
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
