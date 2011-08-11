// game.js
// contains the definition for the main game object

window.hasOwnProperty("utilities") || (window.utilities = {});

(function($, utils, undefined) {
    
    window.hasOwnProperty("shaders") || (window.shaders = {});
    
    window.game = {};
    
    // there can only ever be one instance of a game
    var gameInstance = null;
    
    var modelViewMat, projectionMat;
    var initGL = function() {
        var canvas = game.instance().canvas;
        
        try {
            var gl = gameInstance.gl = utils.get3DContext(canvas.get(0));            
            
            // set the viewport to match the element
            gl.viewportWidth = canvas.width();
            gl.viewportHeight = canvas.height();
            
            // clear and enable DEPTH_TEST mode for drawing
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.enable(gl.CULL_FACE);
            
            projectionMat = mat4.create();
            mat4.perspective(45.0, gl.viewportWidth/gl.viewportHeight, 1.0, 4096.0, projectionMat);
            modelViewMat = mat4.create();
        } catch(e) {
            alert("Cannot start WebGL! " + e);
        }
    };
    
    var update = function(tick) {
        // do non-rendering frame updates
    };
    
    var draw = function(tick) {
        var gl = game.instance().gl;
        
        //Reset the viewport and Clear the frame
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
        
        // this monitors each animation frame from jquery plugin
        $canvas.requestAnimation(function(event) {            
            update(event);
            draw(event);
        });
        
        console.log(game.tick);
    };
    
})(jQuery, window.utilities);