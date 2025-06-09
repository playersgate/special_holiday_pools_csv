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

      // const blob = await response.blob();
      // const a = document.createElement("a");
      // a.href = URL.createObjectURL(blob);
      
      // const disposition = response.headers.get('Content-Disposition');
      // filename =`特別休暇_${date.replaceAll("-", "")}_${employee}.csv`;
      // if (disposition && disposition.includes('filename=')) {
      //   filename = decodeURIComponent(disposition.split("''")[1]);
      // }
      // a.download = filename;
      // a.click();
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const disposition = response.headers.get('Content-Disposition');
      let filename = `特別休暇_${date.replaceAll("-", "")}_${employee}.csv`;
      if (disposition && disposition.includes('filename=')) {
        filename = decodeURIComponent(disposition.split("''")[1]);
      }

      // iPad判定ロジック（iPadOS 13以降でも対応）
      const isIPad = (() => {
        const ua = navigator.userAgent || navigator.vendor || window.opera;
        const platform = navigator.platform;

        return (
          /iPad/.test(ua) || // 古いiPad判定
          (platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPadOS 13以降
        );
      })();

      if (isIPad) {
        // ✅ iPad: ユーザーが自分でタップするリンクを表示
        const resultDiv = document.getElementById("result");
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.textContent = "⬇️ こちらをタップしてCSVをダウンロード（iPad用）";
        link.style.display = "block";
        link.style.marginTop = "1rem";
        link.style.color = "blue";
        resultDiv.appendChild(link);
      } else {
        // ✅ PC等: 自動ダウンロード
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); // 必ずDOMに追加してからクリック
        a.click();
        document.body.removeChild(a);
      }

    } catch (err) {
      resultDiv.textContent = "通信エラーが発生しました。";
    }
  });
});
