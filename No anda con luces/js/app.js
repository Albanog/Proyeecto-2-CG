var timerSeparar;
var timerTrasladar;
var timerServir;
var timerApoyar;
var timerAlinearY;
var timerRotarSobresuEje;
var timerRotacionRespecto;
var timerApoyarY;
var TimerAngX;
var timerTecla;

var activado=false;

var canvas
var gl = null;
var shaderProgramOrenNayar = null; //Shader program to use.
var shaderProgramCook = null;
var vaoTaza = null; //Geometry to render (stored in VAO).
var vaoCafetera = null; //Geometry to render (stored in VAO).
var vaoMesa = null;
var vaoPlano = null;
var indexCount1 = 0; //indice del primer objeto
var indexCount2 = 0;	//indice del segundo objeto
var indexCount3 = 0;
var indexCount4=0;


//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_Rugosidad;
var posLocation;
var colLocation;
var u_normalMatrix;


var u_modelMatrix2;
var u_viewMatrix2;
var u_projMatrix2;
var posLocation2;
var colLocation2;
var u_normalMatrix2;
//Luz
var u_Lposition2;
var u_Ka2;
var u_Ks2;
var u_Kd2;	

var	u_Lposition;
var	u_Ipuntual;
var	u_Iamb;
var	u_Ka;
var	u_Ks;
var	u_Kd;
var	u_Fresnel;
var	u_Rugosidad;

var u_Sigma;
var	u_Ro; 

var u_pos2;
var u_intensidad2;
var u_angulo2;
var	u_spot_direccion2;

var	u_atenuacion_a2;
var	u_atenuacion_b2;

var u_pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
var u_intensidad; //[r,g,b]
var u_angulo; // coseno, si es 0 o 1 no es spot
var u_spot_direccion;

var u_atenuacion_a;
var u_atenuacion_b;
var u_pos5;
var u_intensidad5;
var u_angulo5;
var	u_spot_direccion5;

var	u_atenuacion_a5;
var	u_atenuacion_b5;

//para el otro shader

var u_pos6;
var u_intensidad6;
var u_angulo6;
var	u_spot_direccion6;
var	u_atenuacion_a6;
var	u_atenuacion_b6;

//SPOT
var u_pos3;
var u_intensidad3;
var u_angulo3;
var	u_spot_direccion3;

var	u_atenuacion_a3;
var	u_atenuacion_b3;
var u_pos4;
var u_intensidad4;
var u_angulo4;
var	u_spot_direccion4;
var	u_atenuacion_a4;
var	u_atenuacion_b4;


var parsedOBJ1 = null; //Parsed OBJ1 file
var parsedOBJ2 = null; //Parsed OBJ2 file
var parsedOBJ3 = null;
var parsedOBJ4 = null;
var cam = new Camera(); //vamos a controlar la camara desde esta clase

var tMatTaza = new TransformMatrix(); //matriz de transformacion del obj1 (taza)
var tMatCafetera=new TransformMatrix(); //matriz de transformacion del obj2 (cafetera)
var tMatMesa = new TransformMatrix(); //mesa
var tMatPlano = new TransformMatrix();

var PlanoObj= new Objeto();
var CafeteraObj=new Objeto();
var TazaObj=new Objeto();
var MesaObj=new Objeto();

var Luz=new luz();
var LuzSpot=new luz();
var LuzPuntual=new luz();

var tMatCafeterarixActualBotones;
const DeltaRot=1; //cantidad de grados que rota
let teclaPresionada =false;


/*
	Inicialmente en la pantalla el evento de teclado solo puede capturar
	la tecla L la cual cumple la misma funcion de presionar primero el boton
	cargar y luego el boton renderizar.
	Es decir, ejecuta primero onLoad(), luego onRender() y se habilitan los demas botones.
*/
function primerosEventos(){

	document.addEventListener('keydown', function (e) {
		switch(e.keyCode)
		{
			case 76 : {onLoad(); onRender(); habilitarBotones(); break;}
		}

    }, false);
}


function onLoad() {
	
	//Una vez que se ejecuta esta función la cual prepara todo para poder renderizar,
	//el tamaño del canvas ya no puede editarse, por lo tanto la opcion de redimencionar
	//desaparece
	var Tabla_tam_can = document.getElementById('tabla_tam_canvas');
	Tabla_tam_can.style.display="none";


	//obtenemos el canvas donde vamos a dibujar
	canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	//Agregamos eventos de teclado y mouse
	canvas.addEventListener("mousedown", mouseDown, false);
	canvas.addEventListener("mouseup", mouseUp, false);
	canvas.addEventListener("mouseout", mouseUp, false);
	canvas.addEventListener("mousemove", mouseMove, false);
	document.addEventListener('keydown', function (e) {
		
		//si es una de las teclas de movimiento uso timer, sino solo presiono una vez
		if( (e.keyCode==37) ||  (e.keyCode==39))
		{
			if (teclaPresionada==false)
			{
				teclaPresionada=true;
				timerTecla = setInterval(function() {Evento_teclado(e);},20);

			}
		}
		else
			Evento_teclado(e);
		
    }, false);

    document.addEventListener('keyup', function (e) {
    	
    	if((e.keyCode==37) ||  (e.keyCode==39))
    	{
    		teclaPresionada =false;
			clearInterval(timerTecla);
    	}
    	
    }, false);



	//carga autmaticamente el objeto1 y el objeto2
	CargarModelos();
	//ubico los modelos
	tMatTaza.setTransZ(-1);
	tMatTaza.setBox([0.4,0.4,0,0.7,0.4,0.4]);
	tMatCafetera.setTransZ(1);
	tMatCafetera.setBox([0.5,0.5,0,2.1,0.5,0.5]);
	tMatPlano.setTransY(-3.45);
	tMatTaza.setTransY(0.01);


	//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
	//creo el shader
	//obtengo la direccion de las variables
	
	//este control es por si se intenta ejecutar la carga de los dos modelos principales
	//sin que algun de ellos halla sido ubicdo
	if (parsedOBJ1==null) console.log("no se cargo el primer objeto");
		else if (parsedOBJ2== null) console.log("no se cargo el segundo objeto");
			else if (parsedOBJ2== null) console.log("no se cargo el tercer objeto");
				else if (parsedOBJ2== null) console.log("no se cargo el cuarto objeto");
					else
					{
						//borro la tabla que modifica el tamaño del canvas. se restaura cuando se reinicia.
						var Tabla_tam_can = document.getElementById('tabla_tam_canvas');
						Tabla_tam_can.style.display="none";

						//obtenemos el canvas donde vamos a dibujar
						let canvas = document.getElementById('webglCanvas');
						gl = canvas.getContext('webgl2');
						//obtenemos los indices de los vertices
						let indices1 = (parsedOBJ1.indices);
						indexCount1 = indices1.length;
						let indices2 =(parsedOBJ2.indices);
						indexCount2 = indices2.length;
						let indices3 = (parsedOBJ3.indices);
						indexCount3 = indices3.length;
						let indices4 = (parsedOBJ4.indices);
						indexCount4 = indices4.length;

						let positions = parsedOBJ1.positions;
						let colors = parsedOBJ1.normals;//Will use position coordinates as colors (as example)

						let positions2 = parsedOBJ2.positions;
						let colors2 = parsedOBJ2.normals;

						let positions3 = parsedOBJ3.positions;
						let colors3 = parsedOBJ3.normals;

						let positions4 = parsedOBJ4.positions;
						let colors4 = parsedOBJ4.normals;

						//vertexShaderSource y fragmentShaderSource estan importadas en index.html <script>
						//creo el shader
						shaderProgramOrenNayar = ShaderProgramHelper.create(vertexShaderOrenNayar, fragmentShaderOrenNayar);
						shaderProgramCook = ShaderProgramHelper.create(vertexShaderCook, fragmentShaderCook);
						
						CafeteraObj.setEtiqueta("Cook");
						CafeteraObj.setMaterial(Cromo);
						TazaObj.setEtiqueta("Oren");
						TazaObj.setMaterial(Perla);
						MesaObj.setEtiqueta("Oren");
						MesaObj.setMaterial(Madera);
						PlanoObj.setEtiqueta("Cook");
						PlanoObj.setMaterial(Oro);
						Luz.setPos(-1.0,-1.0,0.0,0.0);

					    Luz.setDireccionSpot(-1.0,-1.0,0.0,0.0);
					    Luz.setAtenuacionA(10.0);
					    Luz.setAtenuacionB(10.01);
					    Luz.setAnguloSpot(180.0);
					    //poner valores con variables
					    Luz.setIntensidad(0.5,0.5,0.5);	

					    LuzSpot.setPos(10.0,10.0,0.0,1.0);
					    LuzSpot.setDireccionSpot(0.0,-2.0,0.0,0.0);
					    LuzSpot.setIntensidad(0.5,0.5,0.5);
					    LuzSpot.setAnguloSpot(40);
					    LuzSpot.setAtenuacionA(0.1);
					    LuzSpot.setAtenuacionB(0.01);


						
					    LuzPuntual.setPos(0.0,5.0,0.0,1.0);
					    LuzPuntual.setDireccionSpot(0.0,-1.0,0.0,0.0);
					    LuzPuntual.setIntensidad(0.3,0.3,0.3);
					    LuzPuntual.setAnguloSpot(180);
					    LuzPuntual.setAtenuacionA(0.1);
					    LuzPuntual.setAtenuacionB(0.01);  

						LinkearCook();
						LinkearOren();
						
						  
						//creo los vao
						let vertexAttributeInfoArray1 = [
							new VertexAttributeInfo(positions, posLocation, 3),
							new VertexAttributeInfo(colors, colLocation, 3)
						];
						vaoTaza = VAOHelper.create(indices1, vertexAttributeInfoArray1);
						
						let vertexAttributeInfoArray2 = [
							new VertexAttributeInfo(positions2, posLocation, 3),
							new VertexAttributeInfo(colors2, colLocation, 3)
						];
						vaoCafetera = VAOHelper.create(indices2, vertexAttributeInfoArray2);
						
						let vertexAttributeInfoArray3 = [
							new VertexAttributeInfo(positions3, posLocation, 3),
							new VertexAttributeInfo(colors3, colLocation, 3)
						];
						vaoMesa = VAOHelper.create(indices3, vertexAttributeInfoArray3);
						
						let vertexAttributeInfoArray4 = [
							new VertexAttributeInfo(positions4, posLocation, 3),
							new VertexAttributeInfo(colors4, colLocation, 3)
						];
						vaoPlano = VAOHelper.create(indices4, vertexAttributeInfoArray4);

						//seteo el color del canvas
						gl.clearColor(0.18, 0.18, 0.18, 1.0);
						gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
						//para que los fragmentos no visibles no tapen a los visibles
						gl.enable(gl.DEPTH_TEST);

						//el boton de renderizar se habilita una vez que estemos listos para renderizar
						let boton_renderizar = document.getElementById('btnrenderizar');
						boton_renderizar.disabled=false;

					}
}

function LinkearCook(){

	posLocation = gl.getAttribLocation(shaderProgramCook, 'vertexPosition');
	colLocation = gl.getAttribLocation(shaderProgramCook, 'vertexNormal');
	u_modelMatrix = gl.getUniformLocation(shaderProgramCook, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgramCook, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgramCook, 'projectionMatrix');
	u_normalMatrix = gl.getUniformLocation(shaderProgramCook, 'normalMatrix');
	//Luz
	u_Lposition = gl.getUniformLocation(shaderProgramCook, 'Lpos');
	u_pos=gl.getUniformLocation(shaderProgramCook,'luz1.pos');
	u_intensidad=gl.getUniformLocation(shaderProgramCook,'luz1.intensidad');
	u_angulo=gl.getUniformLocation(shaderProgramCook,'luz1.angulo');
	u_spot_direccion=gl.getUniformLocation(shaderProgramCook,'luz1.spot_direccion');
	u_atenuacion_a=gl.getUniformLocation(shaderProgramCook,'luz1.atenuacion_a');
	u_atenuacion_b=gl.getUniformLocation(shaderProgramCook,'luz1.atenuacion_b');


	//spot
	u_pos3=gl.getUniformLocation(shaderProgramCook,'luz2.pos');
	u_intensidad3=gl.getUniformLocation(shaderProgramCook,'luz2.intensidad');
	u_angulo3=gl.getUniformLocation(shaderProgramCook,'luz2.angulo');
	u_spot_direccion3=gl.getUniformLocation(shaderProgramCook,'luz2.spot_direccion');
	u_atenuacion_a3=gl.getUniformLocation(shaderProgramCook,'luz2.atenuacion_a');
	u_atenuacion_b3=gl.getUniformLocation(shaderProgramCook,'luz2.atenuacion_b');

	//LUZ PUNTUAL
	u_pos5=gl.getUniformLocation(shaderProgramCook,'luz3.pos');
	u_intensidad5=gl.getUniformLocation(shaderProgramCook,'luz3.intensidad');
	u_angulo5=gl.getUniformLocation(shaderProgramCook,'luz3.angulo');
	u_spot_direccion5=gl.getUniformLocation(shaderProgramCook,'luz3.spot_direccion');
	u_atenuacion_a5=gl.getUniformLocation(shaderProgramCook,'luz3.atenuacion_a');
	u_atenuacion_b5=gl.getUniformLocation(shaderProgramCook,'luz3.atenuacion_b');
	

	//materiales
	u_Ka=gl.getUniformLocation(shaderProgramCook,'Ka');
	u_Kd = gl.getUniformLocation(shaderProgramCook,'Kd');
	u_Fresnel= gl.getUniformLocation(shaderProgramCook,'F0');
	u_Rugosidad= gl.getUniformLocation(shaderProgramCook,'m');

}

function LinkearOren(){

	posLocation2 = gl.getAttribLocation(shaderProgramOrenNayar, 'vertexPosition');
	colLocation2 = gl.getAttribLocation(shaderProgramOrenNayar, 'vertexNormal');
	u_modelMatrix2 = gl.getUniformLocation(shaderProgramOrenNayar, 'modelMatrix');
	u_viewMatrix2 = gl.getUniformLocation(shaderProgramOrenNayar, 'viewMatrix');
	u_projMatrix2 = gl.getUniformLocation(shaderProgramOrenNayar, 'projectionMatrix');
	u_normalMatrix2 = gl.getUniformLocation(shaderProgramOrenNayar, 'normalMatrix');
	//Luz
	u_Lposition2 = gl.getUniformLocation(shaderProgramOrenNayar, 'luz1.Lpos');
	 u_pos2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.pos');


	u_intensidad2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.intensidad');

	u_angulo2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.angulo');

	u_spot_direccion2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.spot_direccion');



	u_atenuacion_a2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.atenuacion_a');

	u_atenuacion_b2=gl.getUniformLocation(shaderProgramOrenNayar,'luz1.atenuacion_b');

		//spot
	u_pos4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.pos');


	u_intensidad4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.intensidad');
	u_angulo4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.angulo');
	u_spot_direccion4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.spot_direccion');

	u_atenuacion_a4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.atenuacion_a');

	u_atenuacion_b4=gl.getUniformLocation(shaderProgramOrenNayar,'luz2.atenuacion_b');

	//LUZ PUNTUAL
	u_pos6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.pos');


	u_intensidad6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.intensidad');
	u_angulo6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.angulo');
	u_spot_direccion6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.spot_direccion');

	u_atenuacion_a6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.atenuacion_a');

	u_atenuacion_b6=gl.getUniformLocation(shaderProgramOrenNayar,'luz3.atenuacion_b');
	//materiales
	u_Ka2=gl.getUniformLocation(shaderProgramOrenNayar,'Ka');
	u_Ks2 =gl.getUniformLocation(shaderProgramOrenNayar,'Ks');
	u_Kd2 = gl.getUniformLocation(shaderProgramOrenNayar,'Kd');
	u_Sigma= gl.getUniformLocation(shaderProgramOrenNayar,'sigma');
	u_Ro= gl.getUniformLocation(shaderProgramOrenNayar,'ro');
}
function DibujarCook(tMat,Ob,vao,indexC){

	gl.useProgram(shaderProgramCook);
	
	gl.uniformMatrix4fv(u_modelMatrix, false, tMat.getTransformMatrix());
	
	gl.uniformMatrix4fv(u_viewMatrix, false, cam.getView());
	gl.uniformMatrix4fv(u_projMatrix, false, cam.getProj());
	 MV = mat4.create();
	mat4.multiply(MV , cam.getView(), tMat.getTransformMatrix());

	mat4.invert(MV,MV);
	mat4.transpose(MV,MV);
	gl.uniformMatrix4fv(u_normalMatrix, false, MV);
	
	gl.uniform3fv(u_Lposition, [0.0,2.0,0.0]);
	

	gl.uniform1f(u_Fresnel,Ob.getMaterial().getFresnel());
	gl.uniform1f(u_Rugosidad,Ob.getMaterial().getRugosidad());

	gl.uniform4fv(u_pos, [Luz.getPosX(),Luz.getPosY(),Luz.getPosZ(),Luz.getPosW()]);
	 gl.uniform3fv(u_intensidad,[Luz.getIntensidadX(),Luz.getIntensidadY(),Luz.getIntensidadZ()]);

	gl.uniform4fv(u_spot_direccion,[Luz.getDireccionSpotX(),Luz.getDireccionSpotY(),Luz.getDireccionSpotZ(),Luz.getDireccionSpotW()]);

	//SPOT

	gl.uniform4fv(u_pos3, [LuzSpot.getPosX(),LuzSpot.getPosY(),LuzSpot.getPosZ(),LuzSpot.getPosW()]);

	 gl.uniform3fv(u_intensidad3,[LuzSpot.getIntensidadX(),LuzSpot.getIntensidadY(),LuzSpot.getIntensidadZ()]);
 	gl.uniform1f(u_angulo3,LuzSpot.getAnguloSpot());
	gl.uniform4fv(u_spot_direccion3,[LuzSpot.getDireccionSpotX(),LuzSpot.getDireccionSpotY(),LuzSpot.getDireccionSpotZ(),LuzSpot.getDireccionSpotW()]);
	gl.uniform1f(u_atenuacion_a3,LuzSpot.getAtenuacionA());
	gl.uniform1f(u_atenuacion_b3,LuzSpot.getAtenuacionB());



//PUNTUAL


	gl.uniform4fv(u_pos5, [LuzPuntual.getPosX(),LuzPuntual.getPosY(),LuzPuntual.getPosZ(),LuzPuntual.getPosW()]);

 gl.uniform3fv(u_intensidad5,[LuzPuntual.getIntensidadX(),LuzPuntual.getIntensidadY(),LuzPuntual.getIntensidadZ()]);
 gl.uniform1f(u_angulo5,LuzPuntual.getAnguloSpot());
	gl.uniform4fv(u_spot_direccion5,[LuzPuntual.getDireccionSpotX(),LuzPuntual.getDireccionSpotY(),LuzPuntual.getDireccionSpotZ(),LuzPuntual.getDireccionSpotW()]);
	gl.uniform1f(u_atenuacion_a5,LuzPuntual.getAtenuacionA());
	gl.uniform1f(u_atenuacion_b5,LuzPuntual.getAtenuacionB());

	gl.uniform3fv(u_Ka, [Ob.getMaterial().getKaX(),Ob.getMaterial().getKaY(),Ob.getMaterial().getKaZ()]);
	gl.uniform3fv(u_Kd, [Ob.getMaterial().getKdX(),Ob.getMaterial().getKdY(),Ob.getMaterial().getKdZ()]);
	gl.uniform3fv(u_Ks, [Ob.getMaterial().getKsX(),Ob.getMaterial().getKsY(),Ob.getMaterial().getKsZ()]);

	//elijo el vao a usar y llamo a draw elements
	gl.bindVertexArray(vao);
	gl.drawElements(gl.TRIANGLES, indexC, gl.UNSIGNED_INT, 0);
	//desconectconsole.log(u_Rugosidad);o el vao y el shader
	gl.bindVertexArray(null);
	gl.useProgram(null);
}


function DibujarOren(tMat,Ob,vao,indexC){
	gl.useProgram(shaderProgramOrenNayar);

	gl.uniformMatrix4fv(u_modelMatrix2, false, tMat.getTransformMatrix());
	
	gl.uniformMatrix4fv(u_viewMatrix2, false, cam.getView());
	gl.uniformMatrix4fv(u_projMatrix2, false, cam.getProj());
	 MV = mat4.create();
	mat4.multiply(MV , cam.getView(), tMat.getTransformMatrix());

	mat4.invert(MV,MV);
	mat4.transpose(MV,MV);
	gl.uniformMatrix4fv(u_normalMatrix2, false, MV);
	
	gl.uniform3fv(u_Lposition2, [0.0,2.0,0.0]);
	
	gl.uniform1f(u_Ro,1.0);
	gl.uniform1f(u_Sigma,1.0);


	gl.uniform4fv(u_pos2, [Luz.getPosX(),Luz.getPosY(),Luz.getPosZ(),Luz.getPosW()]);
	gl.uniform3fv(u_intensidad2,[1.0,1.0,1.0]);
 	gl.uniform1f(u_angulo2,40);
	gl.uniform4fv(u_spot_direccion2,[Luz.getDireccionSpotX(),Luz.getDireccionSpotY(),Luz.getDireccionSpotZ(),Luz.getDireccionSpotW()]);
	gl.uniform1f(u_atenuacion_a2,Luz.getAtenuacionA());
	gl.uniform1f(u_atenuacion_b2,Luz.getAtenuacionB());


	//SPOT

	gl.uniform4fv(u_pos4, [LuzSpot.getPosX(),LuzSpot.getPosY(),LuzSpot.getPosZ(),LuzSpot.getPosW()]);

	 gl.uniform3fv(u_intensidad4,[LuzSpot.getIntensidadX(),LuzSpot.getIntensidadY(),LuzSpot.getIntensidadZ()]);
 	gl.uniform1f(u_angulo4,LuzSpot.getAnguloSpot());
	gl.uniform4fv(u_spot_direccion4,[LuzSpot.getDireccionSpotX(),LuzSpot.getDireccionSpotY(),LuzSpot.getDireccionSpotZ(),LuzSpot.getDireccionSpotW()]);
	gl.uniform1f(u_atenuacion_a4,LuzSpot.getAtenuacionA());
	gl.uniform1f(u_atenuacion_b4,LuzSpot.getAtenuacionB());


//PUNTUAL


	gl.uniform4fv(u_pos6, [LuzPuntual.getPosX(),LuzPuntual.getPosY(),LuzPuntual.getPosZ(),LuzPuntual.getPosW()]);

 gl.uniform3fv(u_intensidad6,[1.0,1.0,1.0]);
 gl.uniform1f(u_angulo6,LuzPuntual.getAnguloSpot());
	gl.uniform4fv(u_spot_direccion6,[LuzPuntual.getDireccionSpotX(),LuzPuntual.getDireccionSpotY(),LuzPuntual.getDireccionSpotZ(),LuzPuntual.getDireccionSpotW()]);
	gl.uniform1f(u_atenuacion_a6,LuzPuntual.getAtenuacionA());
	gl.uniform1f(u_atenuacion_b6,LuzPuntual.getAtenuacionB());


	gl.uniform3fv(u_Ka2, [1.0,1.0,1.0]);
	gl.uniform3fv(u_Kd2, [1.0,1.0,1.0]);
	gl.uniform3fv(u_Ks2, [1.0,1.0,1.0]);
	gl.bindVertexArray(vao);
	gl.drawElements(gl.TRIANGLES, indexC, gl.UNSIGNED_INT, 0);
	//desconecto el vao y el shader
	gl.bindVertexArray(null);
	gl.useProgram(null);

}


function onRender() {

	//limpio el canvas
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//eligo el shader a usar y las matrices de transformacion, camara y perspectiva
	DibujarOren(tMatTaza,TazaObj,vaoTaza,indexCount1);
	DibujarCook(tMatCafetera,CafeteraObj,vaoCafetera,indexCount2);
	DibujarOren(tMatMesa,MesaObj,vaoMesa,indexCount3);
	DibujarOren(tMatPlano,PlanoObj,vaoPlano,indexCount4);
}


function CargarModelos()
{
	parsedOBJ1 = OBJParser.parseFile(tazajs);
    parsedOBJ2 = OBJParser.parseFile(cafeterajs);
    parsedOBJ3 = OBJParser.parseFile(mesajs);
    parsedOBJ4 = OBJParser.parseFile(planojs);
}

//reordena los indices de un obj para poder ser dibujado en forma de wireframes
function reordenarIndices(srcIndices){
	let i = 0;
	let dstIndices = [];
		while(i<srcIndices.length){
			dstIndices.push(srcIndices[i]);
			dstIndices.push(srcIndices[i+1]);
			dstIndices.push(srcIndices[i+1]);
			dstIndices.push(srcIndices[i+2]);
			dstIndices.push(srcIndices[i+2]);
			dstIndices.push(srcIndices[i]);
			i = i+3;
		}	
	return dstIndices;
}

/*
	rota el objeto 1 sobre su propio eje
*/
function rotarObj(){
	if(document.getElementById('selectobj0').value=='Taza'){

		let eje = document.getElementById('selectobj1').value;
		
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotarSobresuEje); 
			return;
		}
		{
			clearInterval(timerRotarSobresuEje); // limpio por cualquier movimiento anterior
			
			let delta = DeltaRot;
			let start = Date.now();
			timerRotarSobresuEje = setInterval(function() {
			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotarSobresuEje); // termino a los 20 segundos
				document.getElementById('selectobj1').value="No";
				return;
			}
			if (eje=="Y")
			{
				tMatTaza.sumarAngleY(delta);
			}
				else if (eje=="X")
					tMatTaza.sumarAngleX(delta);
						else if (eje=="Z")
							tMatTaza.sumarAngleZ(delta);
								else if (eje=="XY")
								{
									tMatTaza.sumarAngleX(delta);
									tMatTaza.sumarAngleY(delta);
								}												
			onRender();
			}, 10);
		}
	}
	if(document.getElementById('selectobj0').value=='Cafetera'){
		let eje = document.getElementById('selectobj1').value;
	
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotarSobresuEje); // limpio
			return;
		}
		{
			clearInterval(timerRotarSobresuEje); // limpio por cualquier movimiento anterior
			
			let delta = -DeltaRot;
			let start = Date.now();
			timerRotarSobresuEje = setInterval(function() {
			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotarSobresuEje); // termino a los 20 segundos
				document.getElementById('selectobj1').value="No";
				return;
			}
			if (eje=="Y")
				tMatCafetera.sumarAngleY(delta);
				else if (eje=="X")
					tMatCafetera.sumarAngleX(delta);
						else if (eje=="Z")
							tMatCafetera.sumarAngleZ(delta);
								else if (eje=="XY")
								{
									tMatCafetera.sumarAngleX(delta);
									tMatCafetera.sumarAngleY(delta);
								}
			onRender();
			}, 10);
		}
	}
}

function rotarAlrededorPunto(objeto,punto,angulo) {		
		objeto.rotarRespectoA(punto,angulo);		
	onRender();
	}

function rotacionResp(punto)
{
	let obj1 = sel;
	let obj2;
	let delta;
	if(obj1==tMatTaza){
		obj2 = tMatCafetera;
		delta = -3;
	}
	if(obj1==tMatCafetera){
		obj2 = tMatTaza;
		delta = 3;
	}	
	let eje;
	if(punto == null){
		//si no se pasa ningun punto por parametro, se rota respecto al otro objeto, 
		//por lo tanto se toma el eje seleccionado en el select 4
		eje = document.getElementById('selectobj4').value;	
		document.getElementById('selectobj3').value="No"; //reestablezco la opcion en la otra rotacion 
	}else{
		//si se pasa un punto por parametro, se rota respecto al punto, por lo tanto
		//se toma el eje seleccionado en el select 3
		eje = document.getElementById('selectobj3').value;
		document.getElementById('selectobj4').value="No";
	}
		if (eje=="No")
		{
			//si se selecciona "no" entonces limpio el timer
			clearInterval(timerRotacionRespecto); 
			return;
		}
		{
			clearInterval(timerRotacionRespecto); // limpio por cualquier movimiento anterior		
			let start = Date.now();
			timerRotacionRespecto = setInterval(function() {			
			let timePassed = Date.now() - start;
			if (timePassed >= 20000) {
				clearInterval(timerRotacionRespecto); // termino a los 20 segundos
				document.getElementById('selectobj3').value="No";
				document.getElementById('selectobj4').value="No";
				return;
			}
		if(punto == null){
			punto = obj2.getTrans();
		}
		if(eje=="X"){
			rotarAlrededorPunto(obj1,punto,[delta,0,0]);
		}
		if(eje=="Y"){
			rotarAlrededorPunto(obj1,punto,[0,delta,0]);
		}
		if(eje=="Z"){
			rotarAlrededorPunto(obj1,punto,[0,0,delta]);
		}
			}, 20);
		}
}

//vuelve a la misma posición de la taza
function apoyarY(){
	let Y1=Math.trunc(tMatTaza.getTransY()*10);
	let Y2=Math.trunc(tMatCafetera.getTransY()*10);

	if(Y1!=Y2)
	{
		tMatCafetera.setTransY(tMatCafetera.getTransY()-0.1);
	}
	else
	{
		activado=false;
		clearInterval(timerApoyarY);
	}

	mat4.fromTranslation(tMatCafetera.getTransformMatrix() ,[tMatCafetera.getTransX(),tMatCafetera.getTransY(),tMatCafetera.getTransZ()]);
	onRender();
}

//Si la cafetera esta rotada en X, esta vuelve a 0°
function AlinearAngX(){
	A1=Math.trunc(tMatCafetera.getAngleX()*10);
	if(A1!=0)
	{
		if(A1<0)
			tMatCafetera.setAngleX(tMatCafetera.getAngleX()+0.1);
		else
			tMatCafetera.setAngleX(tMatCafetera.getAngleX()-0.1);
	}
	else
	{
		Apuntar();		
		clearInterval(TimerAngX);
	}
	mat4.fromXRotation(tMatCafetera.getTransformMatrix(),tMatCafetera.getAngleX());
	onRender();

}


//Roto la cafetera a la posición inicial
function ApoyarCafetera(){
	if(tMatCafetera.getAngleX()<0)
	{
		tMatCafetera.setAngleX(tMatCafetera.getAngleX()+ 2);
		mat4.fromXRotation(tMatCafetera.getTransformMatrix(),tMatCafetera.getAngleX());
		onRender();
	}
	else
	{
		timerApoyarY=setInterval("apoyarY()",30);
		clearInterval(timerApoyar);
	}
}

//Roto la cafetera hacia adelante para servir
function ServirATaza(){
	if(tMatCafetera.getAngleX()>-50)
	{
		tMatCafetera.setAngleX(tMatCafetera.getAngleX()- 2);
		mat4.fromXRotation(tMatCafetera.getTransformMatrix(),tMatCafetera.getAngleX());
		onRender();
	}
	else
	{
		timerApoyar= setInterval("ApoyarCafetera()",30);
		clearInterval(timerServir);
	}


}

//La boquilla de la cafetera apunta a la taza
function Apuntar(){

	let punto=[0,0,0];
	punto[0]=tMatTaza.getTransX();
	punto[1]=tMatTaza.getTransY();
	punto[2]=tMatTaza.getTransZ();
	let old=tMatCafetera.getTransY();
	tMatCafetera.setTransY(tMatTaza.getTransY());
	tMatCafetera.apuntarA(punto);
	tMatCafetera.setTransY(old);
    timerServir= setInterval("ServirATaza()",30);
}

//La cafetera se levanta 1.2 en Y listo para servir
function AlinearY(){
	let Y1=Math.trunc(tMatTaza.getTransY()*10);
	let Y2=Math.trunc(tMatCafetera.getTransY()*10);


		if(Y1<Y2-12)
			tMatCafetera.setTransY(tMatCafetera.getTransY()-0.1);
		else
			if(Y1>Y2-12)
				tMatCafetera.setTransY(tMatCafetera.getTransY()+0.1);
			else
				if(Y1==Y2-12)
				{
					TimerAngX= setInterval("AlinearAngX()",1);				
					clearInterval(timerAlinearY);
				}

	mat4.fromTranslation(tMatCafetera.getTransformMatrix() ,[tMatCafetera.getTransX(),tMatCafetera.getTransY(),tMatCafetera.getTransZ()]);
	onRender();
	

}

 //Veo la distancia en que estoy y me muevo en XYZ
function Trasladar(){
	let X1=tMatTaza.getTransX();
	let Y1=tMatTaza.getTransY();
	let Z1=tMatTaza.getTransZ();
	
	let X2=tMatCafetera.getTransX();
	let Y2=tMatCafetera.getTransY();
	let Z2=tMatCafetera.getTransZ();
	
	let dist=vec3.distance([X2,Y2,Z2],[X1,Y1,Z1]);

	if(dist>1.8)
	{	
		if(Math.abs(X2-X1)>=1)			
			if(X2<X1)
				tMatCafetera.setTransX(tMatCafetera.getTransX()+ 0.2);
			else
				if(X2>X1)
					tMatCafetera.setTransX(tMatCafetera.getTransX()-0.2);    

		if(Math.abs(Y2-Y1)>=1)
			if(Y2<Y1)
				tMatCafetera.setTransY(tMatCafetera.getTransY()+0.2);
			else
				if(Y2>Y1)
					tMatCafetera.setTransY(tMatCafetera.getTransY()-0.2);

	 	if(Math.abs(Z2-Z1)>=1)
			if(Z2<Z1)
				tMatCafetera.setTransZ(tMatCafetera.getTransZ()+0.2);
			else
				if(Z2>Z1)
					tMatCafetera.setTransZ(tMatCafetera.getTransZ()-0.2);	
	}
	else
	{
		 timerAlinearY= setInterval("AlinearY()",20);
		 clearInterval(timerTrasladar);
	}
	
	mat4.fromTranslation(tMatCafetera.getTransformMatrix() ,[tMatCafetera.getTransX(),tMatCafetera.getTransY(),tMatCafetera.getTransZ()]);
	onRender();
	
}

//El efecto de que una cafetera sirva en una taza
function Servir() {
	if(!activado)
	{
		activado=true;
		timerTrasladar= setInterval("Trasladar()",30);
	}
}


function limpiar_timers()
{
	clearInterval(timerOrbitar);
	clearInterval(timerSeparar);
	clearInterval(timerTrasladar);
	clearInterval(timerServir);
	clearInterval(timerApoyar);
	clearInterval(timerAlinearY);
	clearInterval(timerRotarSobresuEje);
	clearInterval(timerRotacionRespecto);
	clearInterval(timerApoyarY);
	clearInterval(TimerAngX);

}

function habilitarBotones()
{
	document.getElementById('Frente').disabled=false;
	document.getElementById('Trasera').disabled=false;
	document.getElementById('Izquierda').disabled=false;
	document.getElementById('Derecha').disabled=false;
	document.getElementById('btnOrbitar').disabled=false;
	document.getElementById('btnReiniciar').disabled=false;
	document.getElementById('btnServir').disabled=false;
	
	document.getElementById('b1').disabled=false;
	document.getElementById('b2').disabled=false;
	document.getElementById('b3').disabled=false;
	document.getElementById('b4').disabled=false;
	document.getElementById('b5').disabled=false;
	document.getElementById('b6').disabled=false;
	document.getElementById('b7').disabled=false;
	document.getElementById('b8').disabled=false;
	document.getElementById('b9').disabled=false;
	document.getElementById('b10').disabled=false;
	document.getElementById('b11').disabled=false;
	document.getElementById('b12').disabled=false;
	document.getElementById('b13').disabled=false;
	document.getElementById('b14').disabled=false;
	

	
	document.getElementById('selectobj0').disabled=false;
	document.getElementById('selectobj1').disabled=false;
	document.getElementById('selectobj3').disabled=false;
	document.getElementById('selectobj4').disabled=false;
	
	document.getElementById('btn1').disabled=false;
	document.getElementById('btn2').disabled=false;
	document.getElementById('btn3').disabled=false;
	document.getElementById('btn4').disabled=false;
	document.getElementById('btn5').disabled=false;
	document.getElementById('btn6').disabled=false;
	document.getElementById('btn7').disabled=false;

	document.getElementById('btnCamPhi').disabled=false;
	document.getElementById('btnCamTheta').disabled=false;
	document.getElementById('btnCamRadius').disabled=false;
	document.getElementById('btnFovy').disabled=false;

	document.getElementById('btnFocoTaza').disabled=false;
	document.getElementById('btnFocoCafetera').disabled=false;
	document.getElementById('btnFocoCentro').disabled=false;

}
