const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "ALLOW-FROM https://teams.microsoft.com");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://*.teams.microsoft.com https://teams.microsoft.com");
  next();
});

app.post('/api/create-csv', (req, res) => {
  const { employee, days, date, expire } = req.body;
  if (!employee || !days || !date || !expire) {
    return res.status(400).json({ message: '必須パラメータが不足しています' });
  }

  const csvPath = path.join(__dirname, 'special_holiday_pools.csv');
  if (!fs.existsSync(csvPath)) {
    return res.status(500).json({ message: 'CSVデータが存在しません' });
  }

  const raw = fs.readFileSync(csvPath);
  const decoded = iconv.decode(raw, 'shift_jis');
  const lines = decoded.trim().split(/\r?\n/);
  const header = lines[0];
  const dataLines = lines.slice(1);

  const matchLine = dataLines.find(line => {
    const cols = line.split(',');
    return cols[2]?.trim() === employee.trim();
  });

  if (!matchLine) {
    return res.status(404).json({ message: '従業員が見つかりません' });
  }

  const cols = matchLine.split(',');

  // 最新の付与日数と最新の付与日は空白
  cols[11] = "";
  cols[12] = "";
  // 付与日数、付与日、期限を更新
  cols[13] = days;
  cols[14] = date;
  cols[15] = expire;

  // ここで outputCsvContent を定義し、正しく文字列として結合
  const outputCsvContent = header + "\n" + cols.join(','); 

  const safeEmployee = employee.replace(/\s+/g, '').replace(/[^\w\u3000-\u30FF\u4E00-\u9FFF]/g, '');
  const filename = `特別休暇_${date.replace(/-/g, '')}_${safeEmployee}.csv`;
  
  // outputCsvContent を Shift_JIS にエンコードし、Buffer として encodedOutputCsv に代入
  const encodedOutputCsv = iconv.encode(outputCsvContent, 'shift_jis'); 

  res.setHeader('Content-Type', 'text/csv; charset=Shift_JIS');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
  
  // ここで encodedOutputCsv を引数として渡す
  res.send(encodedOutputCsv); 
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
