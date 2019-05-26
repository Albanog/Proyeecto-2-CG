// Fragment Shader source, asignado a una variable para usarlo en un tag <script>
var fragmentShaderOrenNayar = `#version 300 es

precision highp float;

const float PI = 3.1415;
in vec3 vNE; //vector normal
in vec3 vVE; //vector de vista

out vec4 fragmentColor;

struct material{
//tipo de material
    float sigma;
    float ro;
    vec3 Kd;
    vec3 Ks;
    vec3 Ka;
};

struct Luz{
    vec4 pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 intensidad; //[r,g,b]
    float angulo; // coseno, si es 0 o 1 no es spot
    vec4 spot_direccion;
    float atenuacion_a;
    float atenuacion_b;
};

uniform material mat;
uniform Luz luz1,luz2,luz3;

vec3 oren_nayar(Luz luz,vec3 N,vec3 V){
    vec3 luces=vec3(0.0,0.0,0.0);
    vec3 VL=vec3 (0.0,0.0,0.0);
    float distancia=0.0; 
    if(length(luz.intensidad) > 0.0){ //checkeo si la luz esta prendida

        if(luz.pos.w < 0.01){ //si es luz direccional
            VL = -luz.pos.xyz;
        }else{ //no es luz direccional
            VL = luz.pos.xyz + vVE;
            distancia = length(VL);
        }
        vec3 L = normalize(VL);
        vec3 H = normalize(L+V);
        vec3 S = normalize(luz.spot_direccion.xyz);

        float NdotH = dot(N, H);
        float NdotV = max(0.0,dot(N, V));
        float VdotH = max(0.0,dot(V, H));
        float NdotL = dot(N, L);
    
        float radio = cos(radians(luz.angulo));
        if((radio >  0.0 && radio<1.0 && (dot(S,-L)> radio)) //si es spot y esta dentro del cono
            ||  luz.angulo == 180.0 //o si es puntual
                ||  luz.pos.w < 0.1){ //o si es direccional
            float A = 1.0 - 0.5*(pow(mat.sigma,2.0)/( pow(mat.sigma,2.0) + 0.33));
            float B = 0.45 * (pow(mat.sigma,2.0)/( pow(mat.sigma,2.0) + 0.09));;
    
            float fir = (atan(V.y/V.x),2.0);    
            float fii = (atan(L.y/L.x),2.0);
    
            float oi = acos(dot(N,L));
            float or = acos(dot(N,V));
            float alfa = max(oi,or);
            float beta = min(oi,or);
            float atenuacion = 1.0/(1.0+luz.atenuacion_a*distancia+luz.atenuacion_b*distancia*distancia);
             luces= (luz.intensidad*(mat.Kd* ( (mat.ro/PI)*dot(N,L)*(A+( B*max(0.0, cos(fii-fir)) * sin(alfa)*tan(beta) ) )) ));
            }
 }   
    return luces;
}


void main(){
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);
    
    
    vec3 color1 = oren_nayar(luz1,N,V);
    vec3 color2 =  oren_nayar(luz2,N,V);
    vec3 color3 = oren_nayar(luz3,N,V);
    vec3 color= mat.Ka +color1 + color2 + color3;
    fragmentColor = vec4(color,1.0);
}
`;








var fragmentShaderCook=`#version 300 es
#define PI 3.1415

precision highp float;

struct material{
float m;//rugosidad
float F0;//porcentaje de la luz reflejada
vec3 Ka;
vec3 Kd;
vec3 Ks;
  };

struct Light{
    vec4 pos; //si w = 0 es vector de luz direccional, si w = 1 es posicion
    vec3 intensidad; //[r,g,b]
    float angulo; // coseno, si es 0 o 1 no es spot
    vec4 spot_direccion;
    float atenuacion_a;
    float atenuacion_b;
};

uniform material mat;
uniform Light luz1,luz2,luz3;

in vec3 vNE; //vector normal
in vec3 vVE; //vector de vista

out vec4 fragmentColor;

vec3 cook_torrence(Light luz,vec3 N,vec3 V){
    vec3 luces=vec3(0.0,0.0,0.0);
    vec3 VL=vec3 (0.0,0.0,0.0);
    float distancia=0.0; 
    if(length(luz.intensidad) > 0.0){ //checkeo si la luz esta prendida

        if(luz.pos.w < 0.01){ //si es luz direccional
            VL = -luz.pos.xyz;
        }else{ //no es luz direccional
            VL = luz.pos.xyz + vVE;
            distancia = length(VL);
        }
        vec3 L = normalize(VL);
        vec3 H = normalize(L+V);
        vec3 S = normalize(luz.spot_direccion.xyz);

        float NdotH = dot(N, H);
        float NdotV = max(0.0,dot(N, V));
        float VdotH = max(0.0,dot(V, H));
        float NdotL = max(0.0,dot(N, L));
    
        float radio = cos(radians(luz.angulo));
        if((radio >  0.0 && radio<1.0 && (dot(S,-L)> radio)) //si es spot y esta dentro del cono
            ||  luz.angulo == 180.0 //o si es puntual
                ||  luz.pos.w < 0.1){ //o si es direccional
    
               //calculo G
            float Ge = (2.0 * NdotH * NdotV)/VdotH;
            float Gs = (2.0 * NdotH * NdotL)/VdotH;
            float G = min(1.0, min(Ge, Gs));

            //calculo D0.2
            float m2 = pow(mat.m,2.0);
            float D = exp(((NdotH * NdotH) - 1.0)/(m2*NdotH*NdotH))/ (PI * m2 * pow(NdotH, 4.0));

            //calculo F
            float cro = pow((1.0-NdotV), 5.0);
            vec3 F =(vec3(1.0,1.0,1.0) - mat.F0)*cro;
            F+=mat.F0;
    float atenuacion = 1.0/(1.0+luz.atenuacion_a*distancia+luz.atenuacion_b*distancia*distancia);

        luces=  (luz.intensidad)*NdotL*( (mat.Kd)/PI + mat.Ks * ((F*D*G)/(PI*NdotV*NdotL)));
        
          
            
 }
 }   
    return luces;
}



void main(){
    vec3 N = normalize(vNE);
    vec3 V = normalize(vVE);
   
    vec3 color1 = cook_torrence(luz1,N,V);
    vec3 color2 = cook_torrence(luz2,N,V);
    vec3 color3 = cook_torrence(luz3,N,V);
    vec3 color = mat.Ka+color1+color2+color3;
     
    fragmentColor = vec4(color,1.0); 
}
`