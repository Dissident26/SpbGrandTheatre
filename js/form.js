(function() {

    let errors = [];

    const showErrors = function() {
        const errorsElement = document.createElement('div');
        errorsElement.setAttribute('style', `
            padding: 20px;
            background-color: white;
            opacity: .8;
            position: fixed;
            bottom: 0;
            right: 0;
            z-index: 999;
            color: #000;
        `);

        let errorsHtml = '';

        errors.forEach(function(error) {
            if(error.field)error.field.setAttribute('style', 'border: 1px solid red; box-shadow: inset 0 0 5px red;');

            errorsHtml += `<p> - ${error.text}</p>`;
        });
        errorsElement.innerHTML = errorsHtml;
        document.body.appendChild(errorsElement);

        setTimeout(()=> document.body.removeChild(errorsElement), 10000)
    };

    const validateTel = function(element) {
        let regExp = /^\+?\d+[\d \-()]{6,}$/;
        if (element.value.length < 6 || !regExp.test(element.value)) errors.push({ field: element, text: 'Неверный формат номера телефона' });
    };

    const validateEmail = function(element) {
        let regExp = /^[a-z0-9]+[a-z0-9._\-]+[a-z0-9]@[a-z0-9\-]+[a-z0-9].[a-z]{2,5}$/i;
        if (element.value.length < 7 || !regExp.test(element.value)) errors.push({ field: element, text: 'Неверный формат адреса эл. почты' });
    };

    const validateText = function(element) {
        if (element.value.length < 2) errors.push({ field: element, text: 'Длина значения должна быть больше 2' });
    };

    const validate = function(fields) {
        errors = [];

        fields.forEach(element => {
            switch(element.tagName) {
                case 'INPUT': 
                    
                    switch(element.type) {
                        case 'tel':
                            validateTel(element);
                        break;
                        case 'email':
                            validateEmail(element);
                        break;
                        default:
                            validateText(element);
                    };
                break;
                case 'TEXTAREA': 
                    validateText(element);
                break;
            }
        });
        return errors.length > 0 ? showErrors() : true;
    };

    const send = async function(event) {
        event.preventDefault();
        const form = new FormData(this);
        if (!validate(this.querySelectorAll('[name]'))) return;
        form.append('to', 'blackhate@bk.ru'); //your e-mail here
        form.append('html', `
            <p><strong>Name: </strong>${form.get('name')}</p>
            <p><strong>Company: </strong>${form.get('company')}</p>
            <p><strong>E-mail: </strong>${form.get('email')}</p>
            <p><strong>Phone: </strong>${form.get('phone')}</p>
            <p><strong>Message: </strong>${form.get('message')}</p>
        `); //mail template
        await fetch('https://f.myitschool.by/mail.php',{//sample server
            method : 'POST',
            body : form,
            'Content-Type': 'text/html'
        }) 
            .then(function (response, reject){
                if(response.status === 201){
                    errors.push({text :'Сообщение отправлено!'});
                    showErrors();
                } else return reject()})
            .catch(function(){
                errors.push({text : 'Сообщение не отправлено!'});
                showErrors();
            });
    };
    
    this.validateForm = function(id) {
        const form = document.querySelector(`#${id}`);
        if (!form) return;
        form.addEventListener('submit', send);
    };

}());

//добавить в имя поля имя ошибки
//посмотреть дизайн
//доделать поля после отправки почты(стили)