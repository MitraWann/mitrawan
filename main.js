document.addEventListener("DOMContentLoaded", () => {
  
  // 1. DYNAMIC READ TIME CALCULATOR
  const articleBody = document.querySelector(".article-body");
  const readTimeDisplay = document.getElementById("read-time");
  if (articleBody && readTimeDisplay) {
    const text = articleBody.innerText;
    const wpm = 225; // Average adult reading speed
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    readTimeDisplay.innerText = `${time} min read`;
  }

  // 2. AUTO-GENERATE TABLE OF CONTENTS (TOC)
  const tocContainer = document.getElementById("toc");
  if (articleBody && tocContainer) {
    const headings = articleBody.querySelectorAll("h2, h3");
    const ul = document.createElement("ul");
    ul.style.listStyle = "none";

    headings.forEach((heading, index) => {
      // Create anchors
      const id = `heading-${index}`;
      heading.id = id;
      
      const li = document.createElement("li");
      li.style.marginLeft = heading.tagName === "H3" ? "15px" : "0";
      
      const a = document.createElement("a");
      a.href = `#${id}`;
      a.innerText = heading.innerText;
      a.style.color = "var(--text-muted)";
      
      li.appendChild(a);
      ul.appendChild(li);
    });
    tocContainer.appendChild(ul);
  }

  // 3. EXIT-INTENT POPUP LOGIC
  const modal = document.getElementById("exitModal");
  const closeModal = document.querySelector(".close-modal");
  
  // Only show once per session to respect UX
  const hasSeenModal = sessionStorage.getItem("hasSeenExitModal");

  if (modal && !hasSeenModal) {
    document.addEventListener("mouseleave", (e) => {
      // Trigger if mouse moves above the viewport (towards tabs)
      if (e.clientY < 0) {
        modal.classList.add("active");
        sessionStorage.setItem("hasSeenExitModal", "true");
        trackEvent("Exit_Intent_Triggered");
      }
    });

    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  // 4. ANALYTICS & EVENT TRACKING
  // Attach this to your analytics provider (Google Analytics, Mixpanel, Fathom)
  function trackEvent(eventName, eventData = {}) {
    console.log(`[Analytics Event]: ${eventName}`, eventData);
    // Example: dataLayer.push({ event: eventName, ...eventData });
  }

  document.querySelectorAll('.track-cta').forEach(button => {
    button.addEventListener('click', (e) => {
      trackEvent('CTA_Clicked', { cta_name: e.target.dataset.ctaName });
    });
  });

  document.querySelectorAll('.track-event').forEach(form => {
    form.addEventListener('submit', (e) => {
      trackEvent('Form_Submitted', { form_name: e.target.dataset.event });
    });
  });
});
