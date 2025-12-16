async function loadAll() {
  try {
    const response = await fetch("/resources/templates/html/header.html");
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Не удалось загрузить header`);
    }
    const html = await response.text();
    document.getElementById("header-placeholder").innerHTML = html;
    console.log(html.substring(0, 100));
  } catch (error) {
    console.error("Ошибка загрузки header:", error);
    document.getElementById("header-placeholder").innerHTML =
      "<p>Не удалось загрузить заголовок</p>";
  }

  try {
    const response = await fetch("/resources/templates/html/footer.html");
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Не удалось загрузить footer`);
    }
    const html = await response.text();
    document.getElementById("footer-placeholder").innerHTML = html;
    console.log(html.substring(0, 100));
  } catch (error) {
    console.error("Ошибка загрузки header:", error);
    document.getElementById("footer-placeholder").innerHTML =
      "<p>Не удалось загрузить footer</p>";
  }

  await loadCSS("/resources/static/css/header.css");
  await loadCSS("/resources/static/css/footer.css");
  await loadCSS("/resources/static/css/base.css");
  await loadCSS("/resources/static/css/main.css");
  await loadCSS("/resources/static/css/responsive.css");
  await loadCSS("/resources/static/css/pages.css")

  
  initMobileMenu();
}

async function loadCSS(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = () => reject(new Error(`Не удалось загрузить CSS: ${href}`));
    document.head.appendChild(link);
  });
}
function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const menu = document.getElementById("menu");

  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    menu.classList.toggle("active");
  });

  // Закрытие меню при клике на пункт меню
  const menuItems = document.querySelectorAll(".header_content_menu a");
  for (const item of menuItems) {
    item.addEventListener("click", function () {
      mobileMenu.classList.remove("active");
      menu.classList.remove("active");
    });
  }
}

document.addEventListener("DOMContentLoaded", loadAll);
