const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/create-csv', (req, res) => {
  const { employee, days, date, expire } = req.body;

  if (!employee || !days || !date || !expire) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const csvContent = `従業員名,付与日数,付与日,期限\n"${employee}",${days},${date},${expire}\n`;
  const filename = `csv_${uuidv4().slice(0, 8)}.csv`;
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, csvContent);

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