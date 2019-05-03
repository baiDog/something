function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );


    var loader = new THREE.TextureLoader();
	var texture = loader.load( "../../img/road.jpg" );

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.4, 0.4 );

    var material = new THREE.MeshLambertMaterial(
        // {map: texture}
        {color:"#b1aca6"}
    );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( x, y, z);
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    // group.add( mesh );
    roads.add( mesh );
    // addLineShape( shape, '#ffffff', x, y, z, rx, ry, rz, s );

}



// 划线？

function addLineShape( shape, color, x, y, z, rx, ry, rz, s ) {
    // lines
    shape.autoClose = true;

    var points = shape.getPoints();
    var spacedPoints = shape.getSpacedPoints( 50 );

    var geometryPoints = new THREE.BufferGeometry().setFromPoints( points );
    var geometrySpacedPoints = new THREE.BufferGeometry().setFromPoints( spacedPoints );		
    
    var line = new THREE.Line( geometryPoints, new THREE.LineBasicMaterial( { color: color } ) );
    line.position.set( x, y, z+5);
    line.rotation.set( rx, ry, rz );
    line.scale.set( s, s, s );
    roads.add( line );
}

// 斑马线 ，  路中央的白线
function roadLine(objs){
    var lineWid = 2; //斑马线宽度
    if(!objs){
        objs = {
            wid:40,
            hei:60
        }
    }    
    var canvas = document.createElement("canvas");
    canvas.width = objs.wid;
    canvas.height = objs.hei;
    var context = canvas.getContext("2d");

    context.fillStyle = "#b1aca6";
    // context.globalAlpha = "0.1";
    context.fillRect(0,0,objs.wid,objs.hei);
    for(var i=0;i<objs.hei;i+=lineWid){
       context.fillStyle = "rgb(255,255,255)"; 
        if((i/lineWid)%2==0){
            context.fillStyle = "#b1aca6"; 
        }
        context.fillRect(0,i,objs.wid,i+lineWid);
    }


    return canvas;
}
