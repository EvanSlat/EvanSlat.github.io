"use strict"; 

var gl;
var lines = 750;
var points=[];
var colors = [];
var canvas;
var degree = 1;
var incrementSpeed = 0.001;
var vBuffer;
function createPoints(n,d){
    var p = [];
    for(let i = 0; i<n;i++){
        p.push(vec2(Math.cos( (2*Math.PI*i)/n),Math.sin( (2*Math.PI*i)/n)));
    }

    for(let i = 0; i<n;i++){
        points.push(p[i]);
        points.push(p[Math.floor(d*i)%n]);
    }
}



window.onload = function init() { //when window loads this runs
    //finds the canvice to set it
    canvas = document.getElementById("gl-canvas"); 

    //version check
    gl = canvas.getContext('webgl2');
    if (!gl) {
        alert("WebGL 2.0 isn't available");
    }

    // First, initialize two points.
    //these are the points
    createPoints(1000,degree);
    points.push(vec2(-1,-1));
    points.push(vec2(-1, 1));
    points.push(vec2(1,1));
    points.push(vec2(1,-1));


    for(let i = lines*2; i>= 0;i--){
        colors.push(vec3(0,0,i/(lines*2)));
    }
    colors.push(vec3(0,0,0));
    colors.push(vec3(0,0,0));
    colors.push(vec3(0,0,0));
    colors.push(vec3(0,0,0));
    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
     vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    // Associate out shader variables with our data buffer
    var aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);


    //adding the colors 
    // Load the data into the GPU
    var cbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    //what format you are passing in, what it will resprenent, how to 'Draw'?
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var aColor = gl.getAttribLocation( program, "aColor" ); 
    gl.vertexAttribPointer( aColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aColor );
    //done adding colors 
    canvas.onclick = function(e){
        // console.log( (2*e.clientX/canvas.width-1)+" "+(1-2*e.clientY/canvas.height));
        //need to hard code all of them, find one square then we will use math to find the rest of points 
        //570 106
        //668 205
        let x = e.clientX;
        let y = e.clientY;
        if(570<=x && x<=660){
            if(110<=y && y<=200){
                degree = Math.floor(degree)*10 +7;
            }
            if(240<=y && y<=330){
                degree = Math.floor(degree)*10 +4;
            }
            if(360<=y && y<=460){
                degree = Math.floor(degree)*10 +1;
            }
        }
        if(700<=x && x<=790){
            if(110<=y && y<=200){
                degree = Math.floor(degree)*10 +8;
            }
            if(240<=y && y<=330){
                degree = Math.floor(degree)*10 +5;
            }
            if(360<=y && y<=460){
                degree = Math.floor(degree)*10 +2;
            }
            if(495<=y && y<=580){
                degree = Math.floor(degree)*10 +0;
            }
        }

        if(830<=x && x<=925){
            if(110<=y && y<=200){
                degree = Math.floor(degree)*10 +9;
            }
            if(240<=y && y<=330){
                degree = Math.floor(degree)*10 +6;
            }
            if(360<=y && y<=460){
                degree = Math.floor(degree)*10 +3;
            }
        }


        // degree = degree%lines;
    };
    render();
};

function render() {
    var w = canvas.width;
    var h = canvas.height;
    var uw = (w/2)/(5);
    var uh = (h)/(5);
    points = [];
    degree += incrementSpeed;
    degree = degree%lines;
    document.getElementById("degree_counter").innerHTML = Math.round(degree*100,3)/100;
    createPoints(lines, degree);
    points.push(vec2(-1,-1));
    points.push(vec2(-1, 1));
    points.push(vec2(1,1));
    points.push(vec2(1,-1));
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0,canvas.width/2,canvas.height);
    gl.drawArrays(gl.LINES,0,points.length-4);
    gl.viewport(((w/2)*(1.1))+(uw*1.25),0,uw,uh);
    gl.drawArrays(gl.TRIANGLE_FAN,points.length-4,points.length);

    for( let x = 0; x<3;x++){
        for(let y = 0; y<3;y++){
            gl.viewport((w/2)*1.1+(uw*1.25*x),(y+1)*(uh*1.25),uw,uh);
            gl.drawArrays(gl.TRIANGLE_FAN,points.length-4,points.length);
        }
    }
    
    requestAnimationFrame(render);
};