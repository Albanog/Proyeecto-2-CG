class materials{

constructor(){
	this.Ka = new Array(0.0,0.0,0.0);
	this.Kd = new Array(0.0,0.0,0.0);
	this.Ks = new Array(0.0,0.0,0.0);
	this.fresnel = 0.0;
    this.rug = 0.0;
	this.fresnelarr = new Array(0.0,0.0,0.0);
    this.sigma = 0.0; 
    this.rho=0.0;
}

//gettes
getKaX(){
	return this.Ka[0];
}

getKaY(){
	return this.Ka[1];
}

getKaZ(){
	return this.Ka[2];
}
getKdX(){
	return this.Kd[0];
}

getKdY(){
	return this.Kd[1];
}
getKdZ(){
	return this.Kd[2];
}
getKsX(){
	return this.Ks[0];
}

getKsY(){
	return this.Ks[1];
}
getKsZ(){
	return this.Ks[2];
}
getFresnel(){
	return this.fresnel;
}

getFresnelX(){
	return this.fresnelarr[0];
}

getFresnelY(){
	return this.fresnelarr[1];
}

getFresnelZ(){
	return this.fresnelarr[2];
}

getRugosidad(){
    return this.rug;
}

getRho(){
    return this.rho;
}
getSigma(){
    return this.sigma;
}
//setters

setKa(Ka1, Ka2, Ka3){
	this.Ka[0] =Ka1;
	this.Ka[1] = Ka2;
	this.Ka[2] = Ka3;
}

setKd(Kd1, Kd2, Kd3){
	this.Kd[0] =Kd1;
	this.Kd[1] = Kd2;
	this.Kd[2] = Kd3;
}

setKs(Ks1, Ks2, Ks3){
	this.Ks[0] =Ks1;
	this.Ks[1] = Ks2;
	this.Ks[2] = Ks3;}

setFresnel(F){
	this.fresnel=F;
}

setRugosidad(ru){
    this.rug=ru;
}

setSigma(s){
    this.sigma=s;
}

setRho(ro){
    this.rho=ro;
}
}