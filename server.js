const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

function sanitize(str) {
  return str.replace(/\s+/g, "").replace(/[^\w\u3000-\u30FF\u4E00-\u9FFF]/g, "");
}

app.post('/api/create-csv', (req, res) => {
  const { employee, days, date, expire } = req.body;

  if (!employee || !days || !date || !expire) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const headers = [
    "システムID", "従業員番号", "従業員名", "入社日", "給与形態", "勤務・賃金設定",
    "特別休暇名", "特別休暇・休業休職種別", "残数(期限内)", "残日数(期限内)", "残時間数(期限内)",
    "最新の付与日数", "最新の付与日", "付与日数", "付与日", "期限"
  ];
  const data = [
    "3024405", "021", employee, "2025/4/1", "月給", "正社員規定",
    "特別休暇", "指定なし", "0", "0", "0", "", "", days, date, expire
  ];

  const csvContent = headers.join(",") + "\n" + data.join(",") + "\n";

  const filename = `特別休暇_${date.replace(/-/g, "")}_${sanitize(employee)}.csv`;
  const filepath = path.join(__dirname, filename);

  const iconv = require('iconv-lite');
  const buffer = iconv.encode(csvContent, 'Shift_JIS');
  fs.writeFileSync(filepath, buffer);

  res.json({ message: 'CSV作成成功', file: filename });
});

app.get('/download/:filename', (req, res) => {
  const filepath = path.join(__dirname, req.params.filename);
  if (fs.existsSync(filepath)) {
    res.download(filepath);
  } else {
    res.status(404).send('ファイルが見つかりません');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});