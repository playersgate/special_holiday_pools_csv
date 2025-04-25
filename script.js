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

  const token = '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';
  const owner = 'playersgate';
  const repo = 'special_holiday_pools_csv';
  const workflow_id = 'create_csv.yml';

  const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`;
  const body = {
    ref: "main",
    inputs: {
      days,
      date,
      expire,
      employee
    }
  };

  resultDiv.innerText = "送信中...";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `token ${token}`,
        "Accept": "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 204) {
      resultDiv.style.color = "green";
      resultDiv.innerText = "CSV作成リクエストを送信しました。GitHub Actionsが実行されます。";
    } else {
      const text = await res.text();
      resultDiv.innerText = `エラー: ${res.status}\n${text}`;
    }
  } catch (err) {
    resultDiv.innerText = "通信エラーが発生しました。";
    console.error(err);
  }
});
