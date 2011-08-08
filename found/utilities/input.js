var main = main || {};
var utilities = utilities || {};

(function($){
	
	
	//=============== KEY MAPPINGS ===============
	var keyMap = {
		move_forward:38,
		move_back:40,
		look_left:65,
		look_right:68,
		look_up:87,
		look_down:83,
		strafe_left:37,
		strafe_right:39 
	};
	
	
	//=============== GLOBAL VARIABLES ===============
	
	//global positions
	var x,y,z,yaw,pitch;
	
	//speed
	var speed = .0001;
	var turnSpeed = .01;
	
	//jogging
	var joggingAngle = 0;
	
	//max speed
	var speed_max = 10;
	
	//global rates
	var dX = dY = dZ = dYaw = dPitch = 0;
	
	//max rates for position
	var dX_max = dY_max = dZ_max = .4;
	
	//max rates for view angle
	var dYaw_max = dPitch_max = 3;
	
	//general resistance based on atmosphere
	var resistance = .1;
	
	//general friction based on what's underneath
	var friction = .1;
	
	//pitch
	var pitchDir = 1;
	
	//Currently Pressed Keys --or-- California Pizza Kitchen
	var CPK = {};
	
	
	//=============== INPUT OBJECT AND METHODS ===============
	
	//attach the input Object to utilities 
    utilities.input = {
		
		//takes intial values for position and view angles
        init : function (xPos,yPos,zPos,yawPos,pitchPos) {
			
			//set the global position
			x = xPos;
			y = yPos;
			z = zPos;
			yaw = yawPos;
			pitch = pitchPos;
			
			this.startListening();
		  	
		},
		
		//INVERT PITCH
		invertPitch : function () {
			pitchDir = -1 * pitchDir;
		},
		
		//Start listing for key strokes and update the CPK
		startListening : function () {
			
			//handle key down
			document.onkeydown = function (event) {
				event.preventDefault();
				event.stopPropagation();
				CPK[event.keyCode] = true;	
			};
			
			//handle key up
        	document.onkeyup = function (event) {
				event.preventDefault();
		        event.stopPropagation();
				CPK[event.keyCode] = false;	
			};	
		},
		
		
		//APPLY THE CPK to our position and view parameters
		applyKeyInput : function () {
	        
			//Look UP & DOWN
			if (CPK[keyMap['look_up']]) {
	            dPitch = dPitch - 0.03 * pitchDir;
	        } else if (CPK[keyMap['look_down']]) {
	            dPitch = dPitch + 0.03 * pitchDir;
	        } else {
	            dPitch = 0;
	        }
		    
			//Look LEFT & RIGHT
	        if (CPK[keyMap['look_left']]) {
	            // Left cursor key or A
	            dYaw = dYaw + 1;
	        } else if (CPK[keyMap['look_right']]) {
	            // Right cursor key or D
	            dYaw = dYaw - 1;
				dX = dZ = 0;
	        } else {
	            dYaw = 0;
	        }
			
			var moved = false;
			var f_dZ = f_dX = s_dZ = s_dX = 0;
			
			//move FORWARD & BACK  strafe LEFT & RIGHT
	        if (CPK[keyMap['move_forward']]) {
				
				moved = true;
				//calculate the unit for DZ, DX
				f_dZ = Math.cos(utilities.degToRad(yaw));
				f_dX = Math.sin(utilities.degToRad(yaw));
				
	        } else if (CPK[keyMap['move_back']]) {
				
				moved = true;
				//calculate the unit for DZ, DX
				f_dZ = -Math.cos(utilities.degToRad(yaw));
				f_dX = -Math.sin(utilities.degToRad(yaw));
				
	        } else {
				f_dZ = f_dX = 0;
			}
			
			if (CPK[keyMap['strafe_left']]) {
				
				moved = true;
				//calculate the unit for DZ, DX
				s_dZ = Math.cos(utilities.degToRad(yaw + 90));
				s_dX = Math.sin(utilities.degToRad(yaw + 90));
				
	        } else if (CPK[keyMap['strafe_right']]) {
				
				moved = true;
				//calculate the unit for DZ, DX
				s_dZ = Math.cos(utilities.degToRad(yaw - 90));
				s_dX = Math.sin(utilities.degToRad(yaw - 90));
			
	        } else {
				s_dZ = s_dX = 0;
			} 
			
			if(!moved){
				dX = dZ = 0;			
	        } else {
				//update the change X and change Z
				dZ = dZ + f_dZ + s_dZ;
				dX = dX + f_dX + s_dX;
			}
	
	    },
		
		//updates position on "elapsed" time which is passed from the game loop
		updatePosition : function (elapsed) {

            if (dX != 0 || dZ !=0) {
                x -=  dX * speed * elapsed;
                z -=  dZ * speed * elapsed;
                joggingAngle += elapsed * 0.6;
            }

            yaw += dYaw * turnSpeed * elapsed;
            pitch += dPitch * 3 * turnSpeed * elapsed;
			
			this.pitch = pitch;
			this.yaw = yaw;
			this.x = x;
			this.y = y + Math.sin(utilities.degToRad(joggingAngle)) / 20 + 0.4;
			this.z = z;

		}
		
	};//end: declaration of utilities.input
	
	
	

})(jQuery)
