// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderOrenNayar = `#version 300 es

precision highp float;

in vec3 vNE; //vector normal
in vec3 vLE; //vector direcion de luz
in vec3 vVE; //vector de vista

out vec4 fragmentColor;

//tipo de material
uniform float sigma;
uniform float ro;

const float PI = 3.1415;

// parametros de la luz
uniform vec3 Kd;
uniform vec3 Ks;
uniform vec3 Ka;

void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);

    float A = 1.0 - 0.5*(pow(sigma,2.0)/( pow(sigma,2.0) + 0.33));
    float B = 0.45 * (pow(sigma,2.0)/( pow(sigma,2.0) + 0.09));;
    
    float fir = (atan(V.y/V.x),2.0);    
    float fii = (atan(L.y/L.x),2.0);
    
    float oi = acos(dot(N,L));
    float or = acos(dot(N,V));
    float alfa = max(oi,or);
    float beta = min(oi,or);
     
    vec3 difuse=PI * max(0.0,dot(L,N))* ((Kd* ( (ro/PI)*dot(N,L)*(A+( B*max(0.0, cos(fii-fir)) * sin(alfa)*tan(beta) ) )) )); ;
    fragmentColor = vec4((Ka+Ks* difuse),1.0);
}
`;

var fragmentShaderCook=`#version 300 es
#define PI 3.141516

precision highp float;

in vec3 vNE; //vector normal
in vec3 vLE; //vector direcion de luz
in vec3 vVE; //vector de vista

out vec4 fragmentColor;

uniform float m;//rugosidad
uniform float F0;//porcentaje de la luz reflejada
uniform vec3 Ka;
uniform vec3 Kd;
void main(){
    vec3 N = normalize(vNE);
    vec3 L = normalize(vLE);
    vec3 V = normalize(vVE);
    vec3 H = normalize(L+V);
    
    float NdotH = max(0.0,dot(N, H));
    float NdotV = max(0.0,dot(N, V));
    float VdotH = max(0.0,dot(V, H));
    float NdotL = dot(N, L);
    
    //calculo G
    float Ge = (2.0 * NdotH * NdotV)/VdotH;
    float Gs = (2.0 * NdotH * NdotL)/VdotH;
    float G = min(1.0, min(Ge, Gs));
    
    //calculo D0.2
    float m2 = pow(m,2.0);
    float D = exp(((NdotH * NdotH) - 1.0)/(m2*NdotH*NdotH))/ (PI * m2 * pow(NdotH, 4.0));
    
    //calculo F
    float cro = pow((1.0-NdotV), 5.0);
    float F =(1.0 - F0)*cro;
    F+=F0;
    
    vec3 cook= vec3(1.0,1.0,1.0)*PI * NdotL*((D*F*G)/ (PI * NdotV*NdotL));
    
    vec3 difuso = Kd * max(dot(L,N),0.0);

    vec3 color=Ka + difuso+cook;
    
    fragmentColor = vec4(color,1); 
}
`;
