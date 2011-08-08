var main = main || {};

main.map = [];

main.map.xDim = 30;
main.map.yDim = 3;
main.map.zDim = 30;

(function($){
		
	main.loadMap = function () {
		
		for(y=0; y < main.map.yDim; y++){
			for(z=0; z < main.map.zDim; z++){
				for(x=0; x < main.map.xDim; x++){
					
					if(Math.round(Math.random() * 5) == 3 ){
						main.map.push(1);	
					} else {
						main.map.push(0);
					}
					
				}
			}
		}
		
	};
	

})(jQuery)


