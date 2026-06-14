import * as http from 'http';

const server = http.createServer((req, res) => {
  // ブラウザがアクセスしてきたURLをチェックする
  const url = req.url;

  if (url === '/') {
    // トップページにアクセスされたとき
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ここはトップページです！🏠\n');

  } else if (url === '/about') {
    // /about にアクセスされたとき
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ここは自己紹介ページです！🙋\n');

  } else {
    // 存在しないURLにアクセスされたとき（404エラー）
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('ページが見つかりません。❌\n');
  }
});

server.listen(3000, () => {
  console.log('サーバーが http://localhost:3000 で再起動しました');
});