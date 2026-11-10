async function loadFooter() {

  const container =
    document.getElementById("footer");

  if (!container) return;

  const html =
    await (
      await fetch(
        "/api/v1/components/footer.html"
      )
    ).text();

  container.innerHTML = html;
  // innerHTML: trasforma quel che gli passiamo in html. Può generare un attacco
  // trasforma quegli script  in html che una volta sul broser va in eseguzione
  // abbastanza percoloso 
}

window.addEventListener(
  "DOMContentLoaded",
  loadFooter
);
