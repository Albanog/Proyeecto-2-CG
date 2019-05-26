class luz{

    constructor(){
        this.posicion = [0.0,0.0,0.0,0.0]; //[x,y,z,w] // si w = 0 es luz direccional
        this.intensidad = [0.0,0.0,0.0]; //[r,g,b]
        this.direccionSpot = [0.0,0.0,0.0,0.0]; //[x,y,z,w]
        this.anguloSpot = 0.0; //el valor representa el coseno del angulo, si es 0 o 1 no es spot
        this.atenuacionA = 0.0; //atenuacion lineal
        this.atenuacionB = 0.0; //atenuacion cuadratica
    }

    //getter
    getPosX(){
        return this.posicion[0];
    }

    getPosY(){
        return this.posicion[1];
    }

    getPosZ(){
        return this.posicion[2];
    }

    getPosW(){
        return this.posicion[3];
    }

    getIntensidadX(){
        return this.intensidad[0];
    }

    getIntensidadY(){
        return this.intensidad[1];
    }

    getIntensidadZ(){
        return this.intensidad[2];
    }




    getDireccionSpotX(){
        return this.direccionSpot[0];
    }


    getDireccionSpotY(){
        return this.direccionSpot[1];
    }


    getDireccionSpotZ(){
        return this.direccionSpot[2];
    }


    getDireccionSpotW(){
        return this.direccionSpot[3];
    }






    getAnguloSpot(){
        return this.anguloSpot;
    }
    getAtenuacionA(){
        return this.atenuacionA;
    }
    getAtenuacionB(){
        return this.atenuacionB;
    }

    //setter
    setPosX(X){

        this.posicion[0] = X;
    }

    setPosY(Y){


        this.posicion[1] = Y;
    }


    setPosZ(Z){
        this.posicion[2] = Z;
    }
    setPos(X,Y,Z,W){
        this.posicion[0] = X;
        this.posicion[1] = Y;
        this.posicion[2] = Z;
        this.posicion[3] = W;
    }
    

    setIntensidadX(X){
        this.intensidad[0] = X;
    }

    setIntensidadY(Y){
        this.intensidad[1] = Y;
    }

    setIntensidadZ(Z){

        this.intensidad[2] = Z;
    }


    setIntensidad(X,Y,Z){
        this.intensidad[0] = X;
         this.intensidad[1] = Y;
          this.intensidad[2] = Z;
    }
    
    setDireccionSpotX(X){
        this.direccionSpot[0] = X;
    }

    setDireccionSpotX(Y){
        this.direccionSpot[1] = Y;
    }
    setDireccionSpotZ(Z){
        this.direccionSpot[2] = Z;
    }
    setDireccionSpot(X,Y,Z,W){
        this.direccionSpot[0] = X;
        this.direccionSpot[1] = Y;
        this.direccionSpot[2] = Z;
        this.direccionSpot[3] = W;
    }
    setAnguloSpot(ang){
        this.anguloSpot = ang;
    }
    setAtenuacionA(ateA){
        this.atenuacionA = ateA;
    }
    setAtenuacionB(ateB){
        this.atenuacionB = ateB;
    }
}