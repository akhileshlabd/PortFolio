document.addEventListener('DOMContentLoaded', () => {
  // Tab switching functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContent = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      
      // Deactivate all tabs and hide content
      tabs.forEach(t => t.classList.remove('active'));
      tabContent.forEach(content => content.classList.remove('active'));

      // Activate clicked tab and show content
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Counter functionality
  const counters = document.querySelectorAll('.counter-number');

  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = target / 200;

    const updateCount = () => {
      if (count < target) {
        count += increment;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
});
