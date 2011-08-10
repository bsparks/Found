var main = main || {};

main.map = [];

main.map.xDim = 20;
main.map.yDim = 5;
main.map.zDim = 20;

(function($){
		
	main.loadMap = function () {
		
		for(var y=0; y < main.map.yDim; y++){
			for(var z=0; z < main.map.zDim; z++){
				for(var x=0; x < main.map.xDim; x++){
					
					if(Math.round(Math.random() * 12) == 3 || y == 0){
						main.map.push(1);	
					} else {
						main.map.push(0);
					}
					
				}
			}
		}
		
	};
	

})(jQuery)


