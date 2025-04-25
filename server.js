const express = require('express');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { employee, days, date, expire } = req.body;

  const filePath = `outputs/${employee}_${Date.now()}.csv`;

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'employee', title: '従業員名' },
      { id: 'days', title: '付与日数' },
      { id: 'date', title: '付与日' },
      { id: 'expire', title: '期限' }
    ]
  });

  await csvWriter.writeRecords([{ employee, days, date, expire }]);
  res.send({ message: 'CSV作成完了', path: filePath });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});