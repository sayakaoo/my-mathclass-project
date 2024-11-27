// 文字入力送信の処理
const form = document.getElementById('answer-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // ページリロードを防止
  const userAnswer = document.getElementById('userAnswer').value;

  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userAnswer }),
  });
  const result = await response.json();
  document.getElementById('response').textContent = result.message;
});

// 音声入力の処理
const startVoiceButton = document.getElementById('start-voice');
startVoiceButton.addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ja-JP'; // 日本語設定
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript; // 認識結果を取得
    document.getElementById('userAnswer').value = transcript; // 入力欄に表示
  };

  recognition.onerror = (event) => {
    console.error('音声認識エラー:', event.error);
    alert('音声入力が失敗しました。もう一度試してください。');
  };
});
