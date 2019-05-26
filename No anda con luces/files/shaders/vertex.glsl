// Vertex Shader source, asignado a una variable para usarlo en un tag <script>
var vertexShaderOrenNayar = `#version 300 es

precision highp float;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;

// parametro de la luz


out vec3 vNE; //vector normal
out vec3 vVE; //vector de vista

in vec3 vertexPosition;
in vec3 vertexNormal;

void main(){

vec3 vertexPosView = normalize(vec3(viewMatrix * modelMatrix * vec4(vertexPosition,1.0)));

vNE =  normalize(vec3(normalMatrix * vec4(vertexNormal,0.0)));


vVE = -vertexPosView;

gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1);
}
`;

var vertexShaderCook =`#version 300 es

precision highp float;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform vec3 Lpos;

out vec3 vNE; //vector normal
out vec3 vVE; //vector de vista

in vec3 vertexPosition;
in vec3 vertexNormal;

void main(){

vec3 vertexPosView = normalize(vec3(viewMatrix * modelMatrix * vec4(vertexPosition,1.0)));
vec3 LposView =normalize(Lpos);

vNE =  normalize(vec3(normalMatrix * vec4(vertexNormal,0.0)));

vVE = -vertexPosView;

gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition,1);
}
`