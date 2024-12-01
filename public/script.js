// 音声入力の処理
console.error('こんに');

const startVoiceButton = document.getElementById('start-voice');
startVoiceButton.addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ja-JP'; // 日本語設定
  recognition.start();

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript; // 認識結果を取得
    console.log("音声認識結果:", transcript); // 追加してみる

    try {
      // 音声認識結果を直接送信
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAnswer: transcript }),
      });

      if (response.ok) {
        const result = await response.json();
        const message = result.message;
        console.log("サーバーレスポンス:", message); // ここも追加してみる

        // ChatGPTの応答に応じた出力
        if (message.includes('正解')) {
          console.log(1); // 正解を含む場合
        } else if (message.startsWith('不正解')) {
          console.log(2); // 不正解から始まる場合
        } else {
          console.error('予期しない応答:', message); // 予期しない応答
        }
      } else {
        console.error('サーバーエラーが発生しました。');
      }
    } catch (error) {
      console.error('通信エラー:', error);
    }
  };

  recognition.onerror = (event) => {
    console.error('音声認識エラー:', event.error);
    alert('音声入力が失敗しました。もう一度試してください。');
  };
});
