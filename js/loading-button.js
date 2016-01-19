function LoadingButton(el, options){
    this.el = el;
    this.options = options;
    this.init();
}

LoadingButton.prototype = {
    // Initialize everything
    init: function(){
        this.infinite = true;
        this.succeed = false;
        this.initDOM();
        this.initSegments();
        this.initEvents();
    },

    // Create an span element with inner text of the button and insert the corresponding SVG beside it
    initDOM: function(){
        this.el.innerHTML = '<span>' + this.el.innerHTML + '</span>';
        this.span = this.el.querySelector('span');
        var div = document.createElement('div');
        div.innerHTML = document.querySelector(this.options.svg).innerHTML;
        this.svg = div.querySelector('svg');
        this.el.appendChild(this.svg);
    },

    // Initialize the segments for all the paths of the loader itself, and for the success and error animations
    initSegments: function(){
        for(var i = 0, paths = this.options.paths, len = paths.length; i < len; i++){
            paths[i].el = this.svg.querySelector(paths[i].selector);
            paths[i].begin = paths[i].begin ? paths[i].begin : 0;
            paths[i].end = paths[i].end ? paths[i].end : 0.1;
            paths[i].segment = new Segment(paths[i].el, paths[i].begin, paths[i].end);
        }
        this.success = this.el.querySelector('.success-path');
        this.error = this.el.querySelector('.error-path');
        this.error2 = this.el.querySelector('.error-path2');
        this.successSegment = new Segment(this.success, 0, 0.1);
        this.errorSegment = new Segment(this.error, 0, 0.1);
        this.errorSegment2 = new Segment(this.error2, 0, 0.1);
    },

    // Initialize the click event in loading buttons, that trigger the animation
    initEvents: function(){
        var self = this;
        self.el.addEventListener('click', function(){
            self.el.disabled = 'disabled';
            classie.add(self.el, 'open-loading');
            self.span.innerHTML = 'Sending';
            for(var i = 0, paths = self.options.paths, len = paths.length; i < len; i++){
                paths[i].animation.call(self, paths[i].segment);
            }
        }, false);
    },

    // Make it fail
    triggerFail: function(){
        this.infinite = false;
        this.succeed = false;
    },

    // Make it succeed
    triggerSuccess: function(){
        this.infinite = false;
        this.succeed = true;
    },

    // When each animation cycle is completed, check whether any feedback has triggered and call the feedback
    // handler, otherwise it restarts again
    completed: function(reset){
        if(this.infinite){
            for(var i = 0, paths = this.options.paths, len = paths.length; i < len; i++){
                if(reset){
                    paths[i].segment.draw(0, 0.1);
                }
                paths[i].animation.call(this, paths[i].segment);
            }
        }else{
            this.handleResponse();
        }
    },

    // Handle the feedback request, and perform the success or error animation
    handleResponse: function(){
        for(var i = 0, paths = this.options.paths, len = paths.length; i < len; i++){
            paths[i].el.style.visibility = 'hidden';
        }
        if(this.succeed){
            this.success.style.visibility = 'visible';
            this.successAnimation();
        }else{
            this.error.style.visibility = 'visible';
            this.error2.style.visibility = 'visible';
            this.errorAnimation();
        }
    },

    // Success animation
    successAnimation: function(){
        var self = this;
        self.successSegment.draw('100% - 50', '100%', 0.4, {callback: function(){
            self.span.innerHTML = 'Succeed';
            classie.add(self.el, 'succeed');
            setTimeout(function(){ self.reset(); }, 2000);
        }});
    },

    // Error animation
    errorAnimation: function(){
        var self = this;
        self.errorSegment.draw('100% - 42.5', '100%', 0.4);
        self.errorSegment2.draw('100% - 42.5', '100%', 0.4, {callback: function(){
            self.span.innerHTML = 'Failed';
            classie.add(self.el, 'failed');
            setTimeout(function(){ self.reset(); }, 2000);
        }});
    },

    // Reset the entire loading button to the initial state
    reset: function(){
        this.el.removeAttribute('disabled');
        classie.remove(this.el, 'open-loading');
        this.span.innerHTML = 'Send';
        classie.remove(this.el, 'succeed');
        classie.remove(this.el, 'failed');
        this.resetSegments();
        this.infinite = true;
        for(var i = 0, paths = this.options.paths, len = paths.length; i < len; i++){
            paths[i].el.style.visibility = 'visible';
        }
        this.success.style.visibility = 'hidden';
        this.error.style.visibility = 'hidden';
        this.error2.style.visibility = 'hidden';
    },

    // Reset the segments to the initial state
    resetSegments: function(){
        for(var i = 0, paths = this.options.paths, len = paths.length; i < len; i++){
            paths[i].segment.draw(paths[i].begin, paths[i].end);
        }
        this.successSegment.draw(0, 0.1);
        this.errorSegment.draw(0, 0.1);
        this.errorSegment2.draw(0, 0.1);
    }
};