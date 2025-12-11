async function loadHeader() {
            try {
                const response = await fetch('/html/header.html');
                console.log(response)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Не удалось загрузить header`);
                }
                const html = await response.text();
                document.getElementById('header-placeholder').innerHTML = html;
                console.log(html.substring(0,100))
            } catch (error) {
                console.error('Ошибка загрузки header:', error);
                document.getElementById('header-placeholder').innerHTML =
                    '<p>Не удалось загрузить заголовок</p>';
            }

            try {
                const response = await fetch('/html/footer.html');
                console.log(response)
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: Не удалось загрузить header`);
                }
                const html = await response.text();
                document.getElementById('footer-placeholder').innerHTML = html;
                console.log(html.substring(0,100))
            } catch (error) {
                console.error('Ошибка загрузки header:', error);
                document.getElementById('header-placeholder').innerHTML =
                    '<p>Не удалось загрузить заголовок</p>';
            }


        }

            document.addEventListener('DOMContentLoaded', loadHeader);
            