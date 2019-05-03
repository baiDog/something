// 创建房子（盒子，+ 贴窗户）
function getHouse(data){
    var value = 1 - Math.random()*Math.random();
    var objs = {
        x:data.x?data.x:0, 
        z:data.z?data.z:0,    //位置
        ry:data.ry?data.ry:0, //旋转
        sx:data.sx?data.sx:10, //宽
        sy:data.sy?data.sy:8,  //高
        color:data.color?new THREE.Color(data.color):new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 ), //颜色
    }
    var geometry = new THREE.CubeGeometry( 1, 1, 1 );
    //我们将立方体的中轴点从中心变到底部。
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    //然后移除底部的面。这是一个优化的步骤，因为立方体底部的面永远不会被看到，所以可以移除。
    geometry.faces.splice( 6, 2 );
    geometry.faceVertexUvs[0].splice(6,2);
    //现在我们为顶部的面修整UV贴图。将它们放到单一坐标（0,0）中。这样屋顶和地板颜色就一样了。因为建筑物的每个面都用一张贴图，所以调用绘制函数一次就好。
    // console.log(geometry.faceVertexUvs);

    geometry.faceVertexUvs[0][2][0].set( 0, 0 );
    geometry.faceVertexUvs[0][2][1].set( 0, 0 );
    geometry.faceVertexUvs[0][2][2].set( 0, 0 );
    // 顶部
    geometry.faceVertexUvs[0][4][0].set( 0, 0 );
    geometry.faceVertexUvs[0][4][1].set( 0, 0 );
    geometry.faceVertexUvs[0][4][2].set( 0, 0 );
    geometry.faceVertexUvs[0][5][0].set( 0, 0 );
    geometry.faceVertexUvs[0][5][1].set( 0, 0 );
    geometry.faceVertexUvs[0][5][2].set( 0, 0 );

    // 设置 位置
    var buildingMesh = new THREE.Mesh( geometry);

    buildingMesh.position.x = objs.x;
    buildingMesh.position.y = objs.z;
    buildingMesh.position.z = -250;
    buildingMesh.rotation.y = objs.ry;
    buildingMesh.scale.x    = objs.sx;
    buildingMesh.scale.z    = objs.sx;
    buildingMesh.scale.y    = objs.sy;

    buildingMesh.rotation.x = Math.PI/2;
    //使用VertexColor模拟环境光遮挡
    //在graphic programming里面，环境光遮挡（ambientocclusion）可以被应用到很多个方面。
    //首先我们分别定义接收光源部分和阴影部分的基础色。这对于每个建筑物都是常量。
    var light = new THREE.Color( 0xffffff );
    var shadow  = new THREE.Color( 0x303050 );
    //现在我们需要给每个面的每个顶点分配.vertexColor。顶部面给color，
    //旁边的面给color乘以顶部顶点的light和底部顶点的shaddow。以此来做简单的环境光遮挡效果。
    var topColor = objs.color.clone().multiply(light);
    var bottomColor = objs.color.clone().multiply(shadow);

    // var geometrys = buildingMesh.geometry;
    for(var j=0;j<buildingMesh.geometry.faces.length;j++){
        if(j===2){
            buildingMesh.geometry.faces[j].vertexColors = [objs.color,objs.color,objs.color,objs.color];
        }else{
            buildingMesh.geometry.faces[j].vertexColors = [topColor,bottomColor,bottomColor,topColor];
        }
    }
    //手动更新模型的矩阵
    buildingMesh.updateMatrix();
    cityGeometry.merge(buildingMesh.geometry, buildingMesh.matrix);
}

// 建筑贴图
function getTextrues(x0,y0){
    if(!x0){
        x0 = 16;
    }
    if(!y0){
        y0 = 32;
    }
    var canvas = document.createElement("canvas");
    canvas.width = x0;
    canvas.height = y0;
    var context = canvas.getContext("2d");
    // 染成白色
    context.fillStyle = "#ffffff";
    context.fillRect(0,0,x0,y0);
    // 白色表面绘制地板 （一个窗户行，一个地板行然后进行循环。实际上，当表面已经是白色的时候，我们只需要绘制窗户行就可以了。为了绘制窗户行，我们要加一些随机值以模拟窗户中的光线变化。）
    for(var y=2;y<y0;y+=2){
        for(var x=0;x<x0;x+=2){
            var value = Math.floor(Math.random()*64);
            context.fillStyle = "rgb("+[value,value,value].join(",")+')';
            context.fillRect(x,y,2,1);
        }
    }

    var canvas2 = document.createElement('canvas');
    canvas2.width = 512;
    canvas2.height = 1024;
    var context = canvas2.getContext('2d');
    
    // 关闭平滑 ，将小canvas复制到大canvas上
    context.imageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;

    context.drawImage(canvas,0,0,canvas2.width,canvas2.height);

    return canvas2;
}