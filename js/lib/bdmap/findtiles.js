function downloadBaiduTiles(){
var EARTHRADIUS = 6370996.81;
var MCBAND = [ 12890594.86, 8362377.87, 5591021, 3481989.83,
		1678043.12, 0 ];
var LLBAND = [ 75, 60, 45, 30, 15, 0 ];
var MC2LL = [
		[ 1.410526172116255e-8, 0.00000898305509648872,
-1.9939833816331, 200.9824383106796,
-187.2403703815547, 91.6087516669843,
-23.38765649603339, 2.57121317296198,
-0.03801003308653, 17337981.2 ],
		[ -7.435856389565537e-9, 0.000008983055097726239,
-0.78625201886289, 96.32687599759846,
-1.85204757529826, -59.36935905485877,
47.40033549296737, -16.50741931063887,
2.28786674699375, 10260144.86 ],
		[ -3.030883460898826e-8, 0.00000898305509983578,
0.30071316287616, 59.74293618442277,
7.357984074871, -25.38371002664745,
13.45380521110908, -3.29883767235584,
0.32710905363475, 6856817.37 ],
		[ -1.981981304930552e-8, 0.000008983055099779535,
0.03278182852591, 40.31678527705744,
0.65659298677277, -4.44255534477492,
0.85341911805263, 0.12923347998204,
-0.04625736007561, 4482777.06 ],
		[ 3.09191371068437e-9, 0.000008983055096812155,
0.00006995724062, 23.10934304144901,
-0.00023663490511, -0.6321817810242,
-0.00663494467273, 0.03430082397953,
-0.00466043876332, 2555164.4 ],
		[ 2.890871144776878e-9, 0.000008983055095805407,
-3.068298e-8, 7.47137025468032,
-0.00000353937994, -0.02145144861037,
-0.00001234426596, 0.00010322952773,
-0.00000323890364, 826088.5 ] ];


var LL2MC = [
		[ -0.0015702102444, 111320.7020616939,
1704480524535203, -10338987376042340,
26112667856603880, -35149669176653700,
26595700718403920, -10725012454188240,
1800819912950474, 82.5 ],
		[ 0.0008277824516172526, 111320.7020463578,
647795574.6671607, -4082003173.641316,
10774905663.51142, -15171875531.51559,
12053065338.62167, -5124939663.577472,
913311935.9512032, 67.5 ],
		[ 0.00337398766765, 111320.7020202162,
4481351.045890365, -23393751.19931662,
79682215.47186455, -115964993.2797253,
97236711.15602145, -43661946.33752821,
8477230.501135234, 52.5 ],
		[ 0.00220636496208, 111320.7020209128,
51751.86112841131, 3796837.749470245,
992013.7397791013, -1221952.21711287,
1340652.697009075, -620943.6990984312,
144416.9293806241, 37.5 ],
		[ -0.0003441963504368392, 111320.7020576856,
278.2353980772752, 2485758.690035394,
6070.750963243378, 54821.18345352118,
9540.606633304236, -2710.55326746645,
1405.483844121726, 22.5 ],
		[ -0.0003218135878613132, 111320.7020701615,
0.00369383431289, 823725.6402795718,
0.46104986909093, 2351.343141331292,
1.58060784298199, 8.77738589078284,
0.37238884252424, 7.45 ] ];



function Point(lng, lat){
	this.lng = lng;
	this.lat = lat;
}

function convertor (point, ll2mc) {
	if (!point || !ll2mc) {
		return
	}
	// 经度的转换比较简单，一个简单的线性转换就可以了。
	// 0、1的数量级别是这样的-0.0015702102444, 111320.7020616939
	var x = ll2mc[0] + ll2mc[1] * Math.abs(point.lng);
	// 先计算一个线性关系，其中9的数量级是这样的：67.5，a的估值大约是一个个位数
	var a = Math.abs(point.lat) / ll2mc[9];
	// 维度的转换相对比较复杂，y=b+ca+da^2+ea^3+fa^4+ga^5+ha^6
	// 其中，a是维度的线性转换，而最终值则是一个六次方的多项式，2、3、4、5、6、7、8的数值大约是这样的：
	// 278.2353980772752, 2485758.690035394,
	// 6070.750963243378, 54821.18345352118,
	// 9540.606633304236, -2710.55326746645,
	// 1405.483844121726,
	// 这意味着维度会变成一个很大的数，大到多少很难说
	var y = ll2mc[2] + ll2mc[3] * a + ll2mc[4] * a * a + ll2mc[5] * a
	* a * a + ll2mc[6] * a * a * a * a + ll2mc[7] * a
	* a * a * a * a + ll2mc[8] * a * a * a * a
	* a * a;
	// 整个计算是基于绝对值的，符号位最后补回去就行了
	x *= (point.lng < 0 ? -1 : 1);
	y *= (point.lat < 0 ? -1 : 1);
	// 产生一个新的点坐标。果然不一样了啊
	return new Point(x, y)
}

function lngLatToMercator(T) {
	return convertLL2MC(T);
}

function getLoop(value, min, max) {
	while (value > max) {
		value -= max - min
	}
	while (value < min) {
		value += max - min
	}
	return value
}

function convertLL2MC (point) {
	var point1;
	var ll2mc;
	point.lng = getLoop(point.lng, -180, 180);// 标准化到区间内
	point.lat = getLoop(point.lat, -74, 74);// 标准化到区间内
	point1 = new Point(point.lng, point.lat);
	// 查找LLBAND的维度字典，字典由大到小排序，找到则停止
	for (var i = 0; i < LLBAND.length; i++) {
		if (point1.lat >= LLBAND[i]) {
			ll2mc = LL2MC[i];
			break;
		}
	}
	// 如果没有找到，则反过来找。找到即停止。
	if (!ll2mc) {
		for (var i = LLBAND.length - 1; i >= 0; i--) {
			if (point1.lat <= -LLBAND[i]) {
				ll2mc = LL2MC[i];
				break;
			}
		}
	}
	var newPoint = convertor(point, ll2mc);
	var point = new Point(newPoint.lng.toFixed(2), newPoint.lat.toFixed(2));
	return point;
}

function findAllTiles(map, callback){
	//var mapType = map.getMapType();// 地图类型，现在里面没那么多的可用数据了，直接不要了
	var zoomLevel = map.getZoom();// 放大倍数，现在是用getZoom了，原先是zoomLevel，现在没了。
	var center = map.getCenter(); //这个中心可能需要转换一下。先试试。 //map.mercatorCenter;// 原先获取的中心坐标
	center = convertLL2MC(center);//果然是需要转换才能用啊
	//var cV = mapType.getZoomUnits(zoomLevel);// zoomLevel相关的一个指数，=2^(18-zoomLevel)
	var cV = Math.pow(2, 18-zoomLevel);//现在直接计算这个数。理论不变，代码变了，我们直接计算好了。
	var unitSize = cV * 256; //这个也只能自己计算了//mapType.getZoomFactor(zoomLevel);// 一个系数，=cV*256
	var longitudeUnits = Math.ceil(center.lng / unitSize);// center.lng是一个很大的数
	var latitudeUnits = Math.ceil(center.lat / unitSize);//这两个不用解释了吧
	var tileSize = 256; //这个直接给常亮吧。要不得是mapType.k.Ob//mapType.getTileSize();
	var cP = [ longitudeUnits, latitudeUnits, (center.lng - longitudeUnits * unitSize) / unitSize * tileSize,
			(center.lat - latitudeUnits * unitSize) / unitSize * tileSize ];
	var left = cP[0] - Math.ceil((map.width / 2 - cP[2]) / tileSize);
	var top = cP[1] - Math.ceil((map.height / 2 - cP[3]) / tileSize);
	var right = cP[0] + Math.ceil((map.width / 2 + cP[2]) / tileSize);
	var c0 = 0;
	//if (mapType === BMAP_PERSPECTIVE_MAP && map.getZoom() == 15) {//这句应该不起作用
	//	c0 = 1
	//}
	var bottom = cP[1] + Math.ceil((map.height / 2 + cP[3]) / tileSize) + c0;
	var xydata = [];
	for (var i = left; i < right; i++) {
		for (var j = top; j < bottom; j++) {
			xydata.push([ i, j ])
		}
	}
	//var zoom = map.getZoom();
	//这个地方能直接获取瓦片地址的内部方法，挺好，省去了很多的代码移植。
	var getTilesUrl = map.getMapType().getTileLayer().getTilesUrl;
	//循环获取代码吧
	for (var i = 0, len = xydata.length; i < len; i++) {
		var url = getTilesUrl({x:xydata[i][0],y:xydata[i][1]}, zoomLevel, "normal");
		var path = zoomLevel+"/"+xydata[i][0]+"/"+xydata[i][1]+".png";
		if(!!callback){
			callback(path, url);
		}
	}	
	
}
	
return function(map, callback){findAllTiles(map, callback);};
}
