// Chart.js が CDN 経由でグローバル（window）に読み込まれている前提の宣言
declare const Chart: any;

// 1. DOM要素の取得と型キャスト (Type Assertion)
const dateInput = document.getElementById('dateInput') as HTMLInputElement;
const targetInput = document.getElementById('targetInput') as HTMLInputElement;
const weightInput = document.getElementById('weightInput') as HTMLInputElement;
const breakfastInput = document.getElementById('breakfastInput') as HTMLInputElement;
const lunchInput = document.getElementById('lunchInput') as HTMLInputElement;
const dinnerInput = document.getElementById('dinnerInput') as HTMLInputElement;

const deleteDateInput = document.getElementById('deleteDateInput') as HTMLInputElement;
const btnSubmit = document.querySelector('.btn-submit') as HTMLButtonElement;
const btnDelete = document.querySelector('.btn-delete') as HTMLButtonElement;

const canvas = document.getElementById('combinedChart') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

// 2. 初期値とデータ配列（型を明示）
let currentTargetWeight: number = 48.0;

const labels: string[] = ['08/10', '08/11', '08/12', '08/13'];
const weights: number[] = [50.5, 50.2, 49.8, 51.2];
const breakfastData: number[] = [380, 420, 350, 400];
const lunchData: number[] = [600, 580, 620, 700];
const dinnerData: number[] = [520, 650, 480, 600];

// 今日の日付をセット
const today: string = new Date().toISOString().split('T')[0];
if (dateInput) dateInput.value = today;
if (deleteDateInput) deleteDateInput.value = today;

// 3. Chartインスタンスの生成
const combinedChart = new Chart(ctx, {
  data: {
    labels: labels,
    datasets: [
      {
        type: 'line',
        label: '体重 (kg)',
        data: weights,
        borderColor: '#9b59b6',
        backgroundColor: '#9b59b6',
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 9,
        tension: 0.3,
        yAxisID: 'yAxisWeight',
        order: 1
      },
      {
        type: 'bar',
        label: '朝食 (kcal)',
        data: breakfastData,
        backgroundColor: '#FF9F40',
        stack: 'calorieStack',
        yAxisID: 'yAxisCalorie',
        order: 2
      },
      {
        type: 'bar',
        label: '昼食 (kcal)',
        data: lunchData,
        backgroundColor: '#FF6384',
        stack: 'calorieStack',
        yAxisID: 'yAxisCalorie',
        order: 2
      },
      {
        type: 'bar',
        label: '夕食 (kcal)',
        data: dinnerData,
        backgroundColor: '#36A2EB',
        stack: 'calorieStack',
        yAxisID: 'yAxisCalorie',
        order: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      annotation: {
        annotations: {
          targetLine: {
            type: 'line',
            yScaleID: 'yAxisWeight',
            yMin: currentTargetWeight,
            yMax: currentTargetWeight,
            borderColor: '#e74c3c',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              display: true,
              content: `目標: ${currentTargetWeight}kg`,
              position: 'end',
              backgroundColor: 'rgba(231, 76, 60, 0.85)',
              color: '#fff',
              font: { size: 11, weight: 'bold' }
            }
          }
        }
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: any[]) => {
            let calorieTotal: number = 0;
            tooltipItems.forEach((item) => {
              if (item.datasetIndex !== 0) calorieTotal += item.raw as number;
            });
            return calorieTotal > 0 ? `合計カロリー: ${calorieTotal} kcal` : '';
          }
        }
      }
    },
    scales: {
      yAxisCalorie: {
        type: 'linear',
        position: 'left',
        stacked: true,
        title: { display: true, text: 'カロリー (kcal)' },
        min: 0,
        max: 2500,
        grid: { drawOnChartArea: true }
      },
      yAxisWeight: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: '体重 (kg)' },
        min: 45,
        max: 55,
        grid: { drawOnChartArea: false }
      }
    }
  }
});

// 4. 各種ロジック関数
function updateTargetFromInput(): void {
  const targetVal: number = parseFloat(targetInput.value);
  if (!isNaN(targetVal)) {
    currentTargetWeight = targetVal;
    const targetLine = combinedChart.options.plugins.annotation.annotations.targetLine;
    targetLine.yMin = currentTargetWeight;
    targetLine.yMax = currentTargetWeight;
    targetLine.label.content = `目標: ${currentTargetWeight}kg`;
    combinedChart.update();
  }
}

function addRecord(): void {
  const dateVal: string = dateInput.value;
  const weightVal: number = parseFloat(weightInput.value);
  const bVal: number = parseFloat(breakfastInput.value) || 0;
  const lVal: number = parseFloat(lunchInput.value) || 0;
  const dVal: number = parseFloat(dinnerInput.value) || 0;

  if (!dateVal || isNaN(weightVal)) {
    alert('日付と体重を正しく入力してくれよな！');
    return;
  }

  updateTargetFromInput();

  const formattedDate: string = dateVal.substring(5).replace('-', '/');

  combinedChart.data.labels.push(formattedDate);
  combinedChart.data.datasets[0].data.push(weightVal);
  combinedChart.data.datasets[1].data.push(bVal);
  combinedChart.data.datasets[2].data.push(lVal);
  combinedChart.data.datasets[3].data.push(dVal);

  combinedChart.update();

  weightInput.value = '';
  breakfastInput.value = '';
  lunchInput.value = '';
  dinnerInput.value = '';
}

function deleteRecord(): void {
  const deleteDateVal: string = deleteDateInput.value;
  if (!deleteDateVal) {
    alert('削除したい日付を選んでくれよな！');
    return;
  }

  const formattedDate: string = deleteDateVal.substring(5).replace('-', '/');
  const targetIndex: number = combinedChart.data.labels.indexOf(formattedDate);

  if (targetIndex === -1) {
    alert(`${formattedDate} のデータは見つからなかったぜ！`);
    return;
  }

  if (confirm(`${formattedDate} の記録を削除して本当に大丈夫か？`)) {
    combinedChart.data.labels.splice(targetIndex, 1);

    combinedChart.data.datasets.forEach((dataset: any) => {
      dataset.data.splice(targetIndex, 1);
    });

    combinedChart.update();
    alert(`${formattedDate} のデータを削除したぜ！`);
  }
}

// 5. イベントリスナーの設定（HTML側の onclick を廃止）
targetInput.addEventListener('change', updateTargetFromInput);
btnSubmit.addEventListener('click', addRecord);
btnDelete.addEventListener('click', deleteRecord);