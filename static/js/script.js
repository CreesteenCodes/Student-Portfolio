// Tab Switching Logic
let analyticsChartsInitialized = false;

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update Active Tab
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show Target Section
    const target = btn.dataset.tab;
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    const targetSection = document.getElementById(target);
    targetSection.style.display = 'block';

    // Scroll Smoothly to Top of Content
    document.querySelector('.right').scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize analytics charts lazily when analytics tab is opened
    if (target === 'analytics' && !analyticsChartsInitialized) {
      try {
        initializeAnalyticsCharts();
        analyticsChartsInitialized = true;
      } catch (e) {
        console.warn('Analytics charts initialization failed:', e);
      }
    }
  });
});

// Animate Skill Bars When Resume Section is Visible
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.fill').forEach(fill => {
        fill.style.width = fill.dataset.percent + '%';
        fill.style.transition = 'width 1.2s ease';
      });
    }
  });
});
observer.observe(document.getElementById('resume'));

// Initialize Analytics Charts (Chart.js must be loaded in the page)
function initializeAnalyticsCharts() {
  if (!window.Chart) return;

  // Line chart for Student Ranking Progression (if present)
  const rankEl = document.getElementById('rankChart');
  let rankChart = null;
  if (rankEl) {
    const ctx = rankEl.getContext('2d');
    rankChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1st Yr, 1st Sem','1st Yr, 2nd Sem','2nd Yr, 1st Sem','2nd Yr, 2nd Sem'],
        datasets: [{
          label: 'Rank',
          data: [1, 3, 5, 2],
          borderColor: 'rgba(25,211,198,0.95)',
          backgroundColor: 'rgba(25,211,198,0.08)',
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: 'rgba(255,255,255,1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        layout: { padding: { left: 6, right: 6, top: 18, bottom: 18 } },
        elements: { point: { radius: 5 } },
        scales: {
          y: { min: 1, max: 5, ticks: { stepSize: 1, padding: 0 }, reverse: true, grid: { drawBorder: false } },
          x: { ticks: { maxRotation: 0, minRotation: 0, autoSkip: true, padding: 6, font: { size: 11 } }, grid: { display: false } }
        }
      }
    });

    // ResizeObserver to keep chart sized correctly inside its container
    try {
      const wrap = rankEl.closest('.chart-wrap');
      if (wrap && window.ResizeObserver) {
        const ro = new ResizeObserver(() => { rankChart.resize(); });
        ro.observe(wrap);
      }
    } catch (e) { /* ignore */ }
  }

  // Donut chart for Top Language Used (if present)
  const langEl = document.getElementById('langChart');
  if (langEl) {
    const data = {
      labels: ['CSS','HTML','JavaScript','Python','C++'],
      datasets: [{ data: [35,20,25,15,5], backgroundColor: ['#6a2ea8','#f26c2a','#f7d154','#2f86c8','#ff6b92'], hoverOffset: 6, borderWidth: 0 }]
    };

    const ctx2 = langEl.getContext('2d');
    const langChart = new Chart(ctx2, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 8 } },
          tooltip: {
            padding: 8,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = Number(context.parsed || 0);
                const dataset = context.chart.data.datasets[context.datasetIndex];
                const sum = dataset.data.reduce((a,b) => a + Number(b || 0), 0);
                const pct = sum ? ((value / sum) * 100).toFixed(1) : '0.0';
                return label + ': ' + value + ' (' + pct + '%)';
              }
            }
          }
        }
      }
    });

    try {
      const wrap2 = langEl.closest('.chart-wrap');
      if (wrap2 && window.ResizeObserver) {
        const ro2 = new ResizeObserver(() => { langChart.resize(); });
        ro2.observe(wrap2);
      }
    } catch (e) { /* ignore */ }
  }
}
