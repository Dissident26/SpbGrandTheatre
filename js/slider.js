(function(){

    const slideHandler = function(slides, buttons, slider, type){
        const btnNext = buttons ? document.querySelector(`#${buttons.next}`) : null;
        const btnPrev = buttons ? document.querySelector(`#${buttons.prev}`) : null;
        
        if(type != 'scroll' && !btnNext && !btnPrev)return;

        if(type == 'showHide'){
            slides.forEach(function (el,i){
                (i > 0) ? el.style.display = 'none' : el.dataset.state = 'active';
            });
        };

        if(type == 'slide' || type == 'scroll'){
            slides[0].style.marginLeft = 0;
            slides[0].dataset.state = 'active';
            let firstSlideMarginLeft = 0;
        };
        
        const showSlide = function(direction){
            const currentSlide = slider.querySelector('[data-state="active"]');
            const nextSlide = direction == 'next' ? currentSlide.nextElementSibling : currentSlide.previousElementSibling;
            if(!nextSlide)return;
            currentSlide.dataset.state = '';
            nextSlide.dataset.state = 'active';

            if(type == 'showHide'){
                currentSlide.style.display = 'none';
                nextSlide.style.display = '';
            };

            if(type == 'slide'){
                let currentSlideWidth = currentSlide.clientWidth;
                firstSlideMarginLeft = Math.abs(parseInt(slides[0].style.marginLeft));
                currentSlide.dataset.state = '';
                nextSlide.dataset.state = 'active';

                let marginPerSecond = currentSlideWidth/60;
                let scrolling = 0;

                function actionSlide(){
                    btnNext.disabled = true, btnPrev.disabled = true;
                    direction == 'next' ? scrolling += marginPerSecond : scrolling -= marginPerSecond;
                    slides[0].style.marginLeft = `-${firstSlideMarginLeft + scrolling}px`;
                    const animation = requestAnimationFrame(actionSlide);
                    if( scrolling > currentSlideWidth && direction == "next" || scrolling < -currentSlideWidth && direction == "prev"){
                        cancelAnimationFrame(animation);
                        slides[0].style.marginLeft = `-${firstSlideMarginLeft + currentSlideWidth * (direction == "next" ? 1 : -1)}px`;
                        btnNext.disabled = false, btnPrev.disabled = false;
                    };
                }; actionSlide();
            };
        };
        if(btnNext && btnPrev){
            btnNext.addEventListener('click', function(){
                showSlide('next', type);
            });
            btnPrev.addEventListener('click', function(){
                showSlide('prev', type);
            });
        };
        
        if(type == 'scroll') {
            const sliderList = slider.querySelectorAll('ul')[0],
                sliderListWidth = sliderList.clientWidth;

            let slidesWidth = 0;
            
            slides.forEach(function(slide) {
                slidesWidth += slide.clientWidth;
            });

            let stopMlScroll = Math.abs(slidesWidth - sliderListWidth);

            let direction = null;
            let animation = null;

            function scroll(firstSlideMarginLeft, direction) {
                slides[0].style.marginLeft = `-${firstSlideMarginLeft + 5*(direction == 'next' ? 1 : -1)}px`;

                firstSlideMarginLeft = Math.abs(parseInt(slides[0].style.marginLeft));

                animation = requestAnimationFrame(function() {
                    scroll(firstSlideMarginLeft, direction);
                });
                
                if (firstSlideMarginLeft == 0 || firstSlideMarginLeft >= stopMlScroll) cancelAnimationFrame(animation);
            }

            slider.addEventListener('mousemove', function(even) {
                if (direction != 'next' && even.clientX >= sliderListWidth*0.8) {
                    direction = 'next';
                    if(animation) cancelAnimationFrame(animation);
                    scroll(Math.abs(parseInt(slides[0].style.marginLeft)), direction);

                } else if (direction != 'prev' && even.clientX <= sliderListWidth*0.2) {
                    direction = 'prev';
                    if(animation) cancelAnimationFrame(animation);
                    scroll(Math.abs(parseInt(slides[0].style.marginLeft)), direction);

                } else if (direction != null && even.clientX > sliderListWidth*0.2 && even.clientX < sliderListWidth*0.8) {
                    direction = null;
                    cancelAnimationFrame(animation);
                }
            });

            slider.addEventListener('mouseleave', function() {
                direction = null;
                cancelAnimationFrame(animation);
            });
        }
    };
    this.slider = function (options){
        if(!options.element)return;
        const slider = document.querySelector(`#${options.element}`);
        if(!slider)return;

        const slides = slider.querySelectorAll('ul li');
        if(slides == 0)return;
        
        switch(options.type){
            case 'showHide' : slideHandler(slides, options.navigation, slider, 'showHide'); break;
            case 'slide' : slideHandler(slides, options.navigation, slider, 'slide'); break;
            case 'scroll' : slideHandler(slides, null, slider, 'scroll'); break;
        };
    };

}());