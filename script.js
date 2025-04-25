document.addEventListener("DOMContentLoaded", async () => {
  const employeeSelect = document.getElementById("employee");

  try {
    const res = await fetch("special_holiday_pools.csv");
    const arrayBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder("shift_jis");
    const text = decoder.decode(arrayBuffer);
    const lines = text.trim().split("\n").slice(1);
    const names = lines.map(line => line.split(",")[2].trim()).filter(Boolean);
    names.sort((a, b) => a.localeCompare(b, "ja"));
    for (const name of names) {
      const opt = document.createElement("option");
      opt.value = opt.textContent = name;
      employeeSelect.appendChild(opt);
    }
  } catch (err) {
    document.getElementById("result").textContent = "従業員名の読み込みに失敗しました。";
  }

  document.getElementById("csvForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const days = document.getElementById("days").value;
    const date = document.getElementById("date").value;
    const expire = document.getElementById("expire").value;
    const employee = employeeSelect.value;

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "";

    if (new Date(date) > new Date(expire)) {
      resultDiv.textContent = "付与日は期限より同日かそれ以前である必要があります。";
      return;
    }

    try {
      const response = await fetch("https://special-holiday-pools-csv-1.onrender.com/api/create-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee, days, date, expire })
      });
      if (!response.ok) throw new Error("サーバーエラー");

      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      
      const disposition = response.headers.get('Content-Disposition');
      filename = employee + ".csv";//`${date.replaceAll("-", "")}${employee}.csv`;
      if (disposition && disposition.includes('filename=')) {
        filename = decodeURIComponent(disposition.split("''")[1]);
      }
      a.download = filename;
      a.click();
    } catch (err) {
      resultDiv.textContent = "通信エラーが発生しました。";
    }
  });
});
