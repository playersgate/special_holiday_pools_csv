import openErrorModal from "./error.js";

const getEmployee = async () => {
  const employeeSelect = document.getElementById("employee");

  try {
    const res = await fetch("special_holiday_pools.csv");
    const arrayBuffer = await res.arrayBuffer();
    const decoder = new TextDecoder("shift_jis");
    const text = decoder.decode(arrayBuffer);
    const lines = text.trim().split("\n").slice(1);
    const names = lines
      .map((line) => line.split(",")[2].trim())
      .filter(Boolean);
    names.sort((a, b) => a.localeCompare(b, "ja"));
    for (const name of names) {
      const opt = document.createElement("option");
      opt.value = opt.textContent = name;
      employeeSelect.appendChild(opt);
    }
  } catch (err) {
    openErrorModal("従業員名の読み込みに失敗しました。");

  }
};

export default getEmployee;
