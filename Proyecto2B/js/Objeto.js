class Objeto{
	
	constructor(){
		this.material = null;
		this.tMat = new TransformMatrix();
		this.Etiqueta=null;
	}

	//gettes
	getMaterial(){
		return this.material;
	}
	getTrans(){
		return this.tMat;
	}

	getEtiqueta(){
	return this.Etiqueta;
	}

	//setters
	setMaterial(m){
		this.material = m;
	}

	setEtiqueta(eti){
		this.Etiqueta=eti;
	}
}