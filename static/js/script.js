// Tab Switching Logic
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