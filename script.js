async function loadEmployees() {
  const res = await fetch('special_holiday_pools.csv');
  const arrayBuffer = await res.arrayBuffer();
  const decoder = new TextDecoder('shift_jis');
  const text = decoder.decode(arrayBuffer);
  const lines = text.trim().split('\n').slice(1);
  const employees = [...new Set(lines.map(line => line.split(',')[2]?.trim()))].filter(Boolean);

  const employeeSelect = document.getElementById('employee');
  employees.sort().forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    employeeSelect.appendChild(opt);
  });

  if (microsoftTeams) {
    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
      const email = context.userPrincipalName || "";
      const match = employees.find(name => email.includes(name));
      if (match) {
        employeeSelect.value = match;
      }
    });
  }
}

window.onload = loadEmployees;

document.getElementById('csvForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const days = document.getElementById('days').value;
  const date = document.getElementById('date').value;
  const expire = document.getElementById('expire').value;
  const employee = document.getElementById('employee').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerText = "";

  if (new Date(date) > new Date(expire)) {
    resultDiv.innerText = "付与日は期限より同日かそれ以前です。";
    return;
  }

  try {
    const res = await fetch('https://special-holiday-pools-csv-1.onrender.com/api/create-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days, date, expire, employee })
    });

    const data = await res.json();
    if (res.ok) {
      resultDiv.style.color = 'green';
      resultDiv.innerText = "CSV作成成功: " + data.file;
    } else {
      resultDiv.innerText = "エラー: " + data.message;
    }
  } catch (err) {
    resultDiv.innerText = "通信エラーが発生しました。";
    console.error(err);
  }
});
