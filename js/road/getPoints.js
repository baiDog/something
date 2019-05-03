//获取点 (1条线扩展成路的点集)
/*
 * points = [
 * 		[147,251],                //普通点
        [59,0,127,197,57,102],    //贝塞尔曲线终点
        [27,-250,59,-128]         //二次曲线的终点
 * ]
 * roadWid                        //路面宽度
 * */
function getPoints(points,roadWid){	
	if(!points){
		points = [];
	}
	if(!roadWid){
		roadWid = 40;
	}
	var point2 = dealPoint(points);
	var res = [];
	points.map(function(v,i){
		res.push(changes(v,1));
	});	
	point2.map(function(v,i){
		res.push(changes(v,2));
	});	           	
	//完成闭环
	res.push(res[0]);           	
	//返回时，贝塞尔等的曲点坐标需要调整  (具体调整方法：
	//①倒着push,将点从最后一个先放进数组；
	//②二次曲线的点，直接将当前的曲率点位移到下个点的旁边；
	//③贝塞尔曲线，两个曲率点，和二次曲线的点一致，但是需要交换位置)        
	function dealPoint(attrs){
		var res =[];
		var len = attrs.length;
		for(var i=0;i<len;i++){
			if(i==0){
				res.push(attrs[len-1].slice(0,2));
			}else{
				var attr1 = attrs[len-i];
				var attr2 = [];
				var len2 = attr1.length;
				if(len2>5){
					attr2 = [attrs[len-i-1][0],attrs[len-i-1][1],attr1[4],attr1[5],attr1[2],attr1[3]];
				}else if(len2>3){
					attr2 = [attrs[len-i-1][0],attrs[len-i-1][1],attr1[2],attr1[3]];
				}else{
					attr2 = [attrs[len-i-1][0],attrs[len-i-1][1]];
				}
				res.push(attr2);
			}
		}
		return res;
	}
	
	function changes(attr,type){
		var len = attr.length;
		var res = [];
		for(var i=0;i<len;i+=2){              			
			var num1,num2;
			if(type==1){
				num1 = attr[i]-roadWid/2;
				num2 = attr[i+1];
			}else if(type==2){
				num1 = attr[i]+roadWid/2;
				num2 = attr[i+1];
			}
			res.push(num1);
			res.push(num2);
		}
		return res;
	}
	return res;
}