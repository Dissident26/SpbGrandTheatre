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
});
slider({element : 'slider1', type : 'slide', navigation : {next : 'slider1_next', prev : 'slider1_prev'}}); //first slider
slider({element : 'slider2', type : 'scroll'});
    //showItems('slider2');
validateForm('form1');