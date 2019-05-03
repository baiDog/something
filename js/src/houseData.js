function houseData(){
    let data = {
        "name": "华阳人民大道房子",
        "data":[
            //位置//位置//旋转//宽//高
            {x:-300, z:-50, ry:0, sx:140, sy:800},
            {x:-300, z:-350, ry:0, sx:120, sy:500},
            {x:-300, z:-850, ry:0, sx:130, sy:700},
            {x:200, z:-100, ry:0, sx:150, sy:650},
        ]
    };

    return data;
}

function roadLines(){
    let data = {
        "name": "华阳人民大道斑马线",
        "data":[
            //长宽，      位置//位置        //旋转
            {wid:20,hei:86,x:-137,y:-152,rz:Math.PI/2*17/18},      
            {wid:20,hei:89,x:-157,y:-280,rz:Math.PI/2*16.5/18},

            {wid:20,hei:54,x:-217,y:-205,rz:2*Math.PI*17.5/18},
            {wid:20,hei:54,x:-70,y:-225,rz:2*Math.PI*17.7/18},                
        ]
    };

    return data;
}