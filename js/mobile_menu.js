
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenu = document.getElementById('mobile-menu');
            const menu = document.getElementById('menu');
            
            mobileMenu.addEventListener('click', function() {
                this.classList.toggle('active');
                menu.classList.toggle('active');
            });
            
            // Закрытие меню при клике на пункт меню
            const menuItems = document.querySelectorAll('.header_content_menu a');
            for(const item of menuItems){
                item.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    menu.classList.remove('active');
                });
            };
        });
    