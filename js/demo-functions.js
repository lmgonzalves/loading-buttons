function circularLoading(){
    var button = document.querySelector('.loading-button'),
        options = {
            svg: '#circular-loading',
            paths: [
                {selector: '.outer-path', animation: outerAnimation},
                {selector: '.inner-path', animation: innerAnimation}
            ]
        },
        loading = new LoadingButton(button, options);

    function outerAnimation(segment){
        var self = this;
        segment.draw('15%', '25%', 0.2, {callback: function(){
            segment.draw('75%', '150%', 0.3, {circular:true, callback: function(){
                segment.draw('70%', '75%', 0.3, {circular:true, callback: function(){
                    segment.draw('100%', '100% + 0.1', 0.4, {circular:true, callback: function(){
                        self.completed(true);
                    }});
                }});
            }});
        }});
    }

    function innerAnimation(segment){
        segment.draw('20%', '80%', 0.6, {callback: function(){
            segment.draw('100%', '100% + 0.1', 0.6, {circular:true});
        }});
    }

    initDemo(button, loading);

    return loading;
}


function circleLoading(){
    var button = document.querySelector('.loading-button'),
        options = {
            svg: '#circle-loading',
            paths: [
                {selector: '.outer-path', animation: outerAnimation},
                {selector: '.inner-path', animation: innerAnimation}
            ]
        },
        loading = new LoadingButton(button, options),
        circles = button.querySelectorAll('circle');

    function outerAnimation(segment){
        var self = this;
        segment.draw('-20%', '0%');
        segment.draw('-120%', '-100%', 1, {circular: true, callback: function(){
            if(self.infinite){
                outerAnimation.call(self, segment);
                innerAnimation.call(self, self.options.paths[1].segment);
            }else{
                segment.draw('-100%', '-100% + 0.1', 0.7, {circular:true, callback: function(){
                    classie.remove(button, 'show-circles');
                    self.handleResponse();
                }});
                self.options.paths[1].segment.draw('100%', '100% + 0.1', 0.7, {circular:true});
            }
        }});
    }

    function innerAnimation(segment){
        segment.draw('30%', '50%');
        segment.draw('130%', '150%', 1, {circular: true, callback: function(){
        }});
    }

    initDemo(button, loading);

    button.addEventListener('click', function(){
        classie.add(button, 'show-circles');
    }, false);

    return loading;
}


function infinityLoading(){
    var button = document.querySelector('.loading-button'),
        options = {
            svg: '#infinity-loading',
            paths: [
                {selector: '.infinity-path', animation: infinityAnimation}
            ]
        },
        loading = new LoadingButton(button, options);

    function infinityAnimation(segment){
        var self = this;
        segment.draw('100%', '150%', 1, {circular:true, callback: function(){
            if(self.infinite){
                infinityAnimation.call(self, segment);
            }else{
                segment.draw('100%', '100% + 0.1', 0.5, {circular:true, callback: function(){
                    self.handleResponse();
                }});
            }
        }});
    }

    initDemo(button, loading);

    return loading;
}


function initDemo(button, loading){

    var makeItFail = document.querySelector('.make-it-fail'),
        makeItSucceed = document.querySelector('.make-it-succeed'),
        controls = document.querySelectorAll('.control-button');

    function hideControls(){
        classie.remove(controls.item(0), 'show-control');
        classie.remove(controls.item(1), 'show-control');
    }

    makeItFail.addEventListener('click', function(){
        loading.triggerFail();
        hideControls();
    }, false);

    makeItSucceed.addEventListener('click', function(){
        loading.triggerSuccess();
        hideControls();
    }, false);

    button.addEventListener('click', function(){
        classie.add(controls.item(0), 'show-control');
        classie.add(controls.item(1), 'show-control');
    }, false);

}