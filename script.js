// Default gradient
const gradient = document.getElementById("gradient");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");

const gradientCSS = "linear-gradient(135deg, #ff6a00, #ee0979)";
gradient.style.background = gradientCSS;

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(`background: ${gradientCSS};`)
    .then(() => {
      message.textContent = "✅ CSS copied!";
      setTimeout(() => message.textContent = "", 2000);
    });
});
