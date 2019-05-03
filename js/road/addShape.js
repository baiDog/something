function addShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {
    var geometry = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );
			
    var loader = new THREE.TextureLoader();
	var texture = loader.load( "../../img/road.jpg" );

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.4, 0.4 );

    var material = new THREE.MeshLambertMaterial(
//			         {map: texture}
        {color:color}
    );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( x, y, z);
    mesh.rotation.set( rx, ry, rz );
    mesh.scale.set( s, s, s );
    return mesh;   		
}