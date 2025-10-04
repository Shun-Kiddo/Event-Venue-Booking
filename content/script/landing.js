  const slides = document.querySelectorAll(".venue-slide");
  const next = document.querySelector(".next");
  const prev = document.querySelector(".prev");
  let index = 0;

  function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  next.addEventListener("click", nextSlide);
  prev.addEventListener("click", prevSlide);

  // Auto-slide every 6 seconds
  setInterval(nextSlide, 6000);