// game.js
// contains the definition for the main game object

window.hasOwnProperty("utilities") || (window.utilities = {});

(function($, util, undefined) {
    
    window.hasOwnProperty("shaders") || (window.shaders = {});
    
    window.game = {};
    
    // there can only ever be one instance of a game
    var gameInstance = null;
    
    var initGL = function() {
        try {
            gameInstance.gl = gameInstance.canvas[0].getContext("experimental-webgl");
            
            // set the viewport to match the element
            gameInstance.gl.viewportWidth = gameInstance.canvas.width();
            gameInstance.gl.viewportHeight = gameInstance.canvas.height();
            
            // clear and enable DEPTH_TEST mode for drawing
            gameInstance.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gameInstance.gl.enable(gameInstance.gl.DEPTH_TEST);
        } catch(e) {
            alert("Cannot start WebGL! " + e);
        }
    };
    
    var update = function(timeElapsed) {
        // do non-rendering frame updates
    };
    
    var draw = function(timeElapsed) {
        var gl = game.instance().gl;
        
        //Reset the viewport and Clear the frame
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    };
    
    var lastTime = 0; // used for timeElapsed
    var tick = function() {
        var timeElapsed; // time between frames
        
        requestAnimFrame(tick);
        
        lastTime = timeElapsed = (new Date().getTime() - lastTime);
        
        update(timeElapsed);
        draw(timeElapsed);
    };   
    
    game.instance = function($canvas) {
        var that;
        
        if(gameInstance === null) {
            that = gameInstance = {canvas: $canvas};    
        } else {
            that = gameInstance;
        }
        
        return that;
    };
    
    // main function to start it all up
    game.start = function($canvas) {
        // force init by grabbing an instance
        var g = game.instance($canvas);
        
        initGL();
        
        tick();
    };
    
})(jQuery, window.utilities);