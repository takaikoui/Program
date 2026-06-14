// server.ts
// require ではなく import を使う（TypeScriptの標準的な書き方）
import * as http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello, モダンなTypeScriptサーバーです！\n');
});

server.listen(3000, () => {
  console.log('サーバーが http://localhost:3000 で起動しました');
});