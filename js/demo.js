(function(){

    function clean(button, value){
        loading.infinite = false;
        button.innerHTML = button.querySelector('span').innerHTML;
        classie.remove(button, current);
        classie.add(button, value);
        current = value;
        var newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        return newButton;
    }

    function newLoader(button, value, open){
        var newButton = clean(button, value);
        if(value === 'circular-loading'){
            loading = circularLoading();
        }else if(value === 'infinity-loading'){
            loading = infinityLoading();
        }else if(value === 'circle-loading'){
            loading = circleLoading();
        }
        if(open){
            newButton.removeAttribute('disabled');
            setTimeout(function(){ newButton.click(); }, 300);
        }
    }

    function loadersClick(){
        var self = this;
        var button = document.querySelector('.loading-button');
        if(classie.has(button, 'open-loading')){
            classie.remove(button, 'open-loading');
            setTimeout(function(){ newLoader(button, self.value, true); }, 300);
        }else{
            newLoader(button, self.value);
        }
    }

    var loaders = document.getElementsByName('loaders'),
        current = 'circular-loading';

    for(var i = 0; i < loaders.length; i++){
        loaders[i].addEventListener('change', loadersClick, false);
    }

    var loading = circularLoading();

    function positionsClick(){
        var button = document.querySelector('.loading-button');
        classie.add(button, 'no-transition');
        classie.remove(button, currentStyle);
        classie.add(button, this.value);
        currentStyle = this.value;
        setTimeout(function(){ classie.remove(button, 'no-transition'); }, 10);
    }

    var positions = document.getElementsByName('positions'),
        currentStyle = 'top';

    for(i = 0; i < positions.length; i++){
        positions[i].addEventListener('change', positionsClick, false);
    }

})();