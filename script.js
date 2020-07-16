window.addEventListener('load', function(){
    const menuButton = document.querySelector('.nav_toggle');
    if(menuButton){
        menuButton.addEventListener('click', function(){
            const menu = menuButton.nextElementSibling;
            if(!menu) return;
            menu.classList.toggle('nav_toggle_active');
            menuButton .classList.toggle('active');
        });
    };
})
