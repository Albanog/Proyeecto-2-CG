var Ruby = new materials(); //6x esferas

Ruby.setKa(0.17, 0.01, 0.01);
Ruby.setKd(0.61, 0.04, 0.04);
Ruby.setKs(0.72, 0.63, 0.63);
Ruby.setFresnel(0.8);
Ruby.setRugosidad(1.0);
Ruby.setSigma(90.0);
Ruby.setRho(1.0);



var Cromo = new materials(); //6x esferas

Cromo.setKa(0.25, 0.25, 0.25);
Cromo.setKd(0.4, 0.4, 0.4);
Cromo.setKs(0.77, 0.77, 0.77);
Cromo.setFresnel(0.9);
Cromo.setRugosidad(0.15);
Cromo.setSigma(80.0);
Cromo.setRho(1.0);



var Perla = new materials(); //6x esferas y la taza

Perla.setKa(0.25, 0.21, 0.21);
Perla.setKd(1.0, 0.83, 0.83);
Perla.setKs(0.30, 0.30, 0.30);
Perla.setFresnel(0.75);
Perla.setRugosidad(0.3);
Perla.setSigma(15.0);
Perla.setRho(1.0);



var Oro = new materials(); //6x esferas

Oro.setKa(0.25, 0.20, 0.07);
Oro.setKd(0.75, 0.61, 0.23);
Oro.setKs(0.63, 0.56, 0.23);
Oro.setFresnel(1);
Oro.setRugosidad(0.1);
Oro.setSigma(66.0);
Oro.setRho(1.0);



var Piso = new materials(); //piso

Piso.setKa(0.0, 0.0, 0.0);
Piso.setKd(0.03, 0.03, 0.03);
Piso.setKs(0.5, 0.5, 0.5);
Piso.setFresnel(0.1);
Piso.setRugosidad(0.75);
Piso.setSigma(20.0);
Piso.setRho(1.0);

var Madera = new materials(); //mesa

Madera.setKa(0.5, 0.3, 0.0);
Madera.setKd(0.55, 0.22, 0.11);
Madera.setKs(0.5, 0.2, 0.0);
Madera.setFresnel(0.2);
Madera.setRugosidad(0.9);
Madera.setSigma(20.0);
Madera.setRho(1.0);

var Plata = new materials();  //cafetera

Plata.setKa(0.19, 0.19, 0.19);
Plata.setKd(0.51, 0.51, 0.51);
Plata.setKs(0.51, 0.51, 0.51);
Plata.setFresnel(0.9);
Plata.setRugosidad(0.15);
Plata.setSigma(80.0);
Plata.setRho(1.0);