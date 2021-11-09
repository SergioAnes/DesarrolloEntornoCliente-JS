window.onload = inicio;

function inicio () {
  document.formulario.validar.onclick = comprobar;
}

function comprobar(){//TEMPORAL, PARA HACER LAS COMPROBACIONES. 
//parametros generales
  let enviar=true; //por defecto, que enviar sea verdadero. 
  let mensaje=""; //Se va añadiendo al mensaje lo que haga falta. 

  //comprobacion NIF/CIF
  let vnifcif=document.formulario.cifEmpresa.value.trim();
  let resultanif=NIFCIF(vnifcif);
  if (resultanif!="C1" && resultanif!="N1" ) {
    mensaje+="El NIF o el CIF introducido no es correcto\n";
    enviar=false;
  } 

  //Se comprueba el tema de codigoBanco, codigoOficina y numeroCuenta. 
  var cBanco = document.formulario.codigoBanco.value.trim();
  if ((cBanco<"0" || cBanco>"9") || cBanco.length!=4) {
    mensaje+="El codigo del banco es incorrecto\n";
    enviar=false;
  }
  var cOficina = document.formulario.codigoOficina.value.trim();
  if ((cOficina<"0" || cOficina>"9") || cOficina.length!=4) {
    mensaje+="El codigo de la oficina es incorrecto\n";
    enviar=false;
  }
  var nCuenta = document.formulario.numeroCuenta.value.trim();
  if ((nCuenta<"0" || nCuenta>"9") || nCuenta.length!=10) {
    mensaje+="El numero de la cuenta es incorrecto\n";
    enviar=false;
  }
 //comprobacion del digito de control 
  var codigoIntroducido=document.formulario.codigoControl.value.trim();
  var codigoCorrecto=codigosControl(cBanco, cOficina, nCuenta);
  if(codigoCorrecto!=codigoIntroducido) {
    mensaje+="El codigo de control es incorrecto\n";
    enviar=false;
  }
  //comprobacion del IBAN 
  var ibanIntroducido = document.formulario.IBAN.value.trim();
  if (!comprobarIBAN(ibanIntroducido)) {
    mensaje+="El IBAN introducido es incorrecto\n";
    enviar=false;
  }
//comprobacion del nombre
  var nombre = document.formulario.apellidosNombre.value.toLowerCase();
  if (!comprobarNombre(nombre)) {
    mensaje+="El nombre está mal\n";
    enviar=false;
  }
//comprobacion codigoEmpresa
  var cEmpresa = document.formulario.codigoEmpresa.value.toLowerCase();
  if (!comprobarCodigoEmpresa(cEmpresa)){
      mensaje+="El codigo de la empresa es incorrecto\n";
      enviar=false;
  }
//comprobacion Direccion 
  var direccion = document.formulario.direccion.value.toLowerCase();
    if (!comprobarDireccion(direccion)) {
      mensaje+="La direccion es incorrecta\n";
      enviar=false;
    }
  //comprueba localidad
  var comLocalidad = document.formulario.localidad.value.toLowerCase();
    if (!comprobarLocalidad(comLocalidad)){
      mensaje+="La localidad está mal\n";
      enviar=false; 
    }
   //comprueba codigo postal
   if (codigoPostal()==false) { 
    mensaje+="El codigo postal está mal\n";
    enviar=false;
    }
   //comprueba telefono
   var nTelefono = document.formulario.telefono.value;
   if (!comprobarTelefono(nTelefono)) {
    mensaje+="El telefono está mal\n";
    enviar=false; 
   }
  //comprueba fax -- REVISAR

  //comprueba fecha -- NO ESTÁN PUESTOS LOS BISIESTOS, HE HECHO UNA FUNCIÓN BÁSICA. 
  var fechaEmpresa = document.formulario.fechaCreacionEmpresa.value;
  if (!comprobarFecha(fechaEmpresa)){
    mensaje+="La fecha es incorrecta\n";
    enviar=false;
  }
  //comprueba agrupaciones
  if (!comprobarAgrupaciones()) {
    mensaje+="Selecciona si la persona es física o jurídica\n";
    enviar=false;
  }
  //comprobarTipodeEmpresa
  if (!comprobarTipodeEmpresa()){
    mensaje+="Tienes que seleccionar el tipo de empresa\n";
    enviar=false; 
  }
  //comprobar CCAA seleccionados. 
  if (!comprobarComunidades()){
    mensaje+="Tienes que seleccionar al menos dos CCAA\n";
    enviar=false;
  }
  //comprobar sectores seleccionados
  if (!comprobarSectores()){
    mensaje+="Se debe seleccionar al menos un sector económico\n";
    enviar=false;
  }

  //cierre final de las comprobaciones
 if(enviar==true){
    alert("Esta tódo bien");
  }//de if
  else{
    alert(mensaje);
  }//de else
  return enviar; //para qué se hacía aquí el return. 
}//cierre FUNCION COMPROBAR

//funcion dni
function esNif(dni){
  var salida=1; //correcto
  var letraControl=["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X" ,"B" ,"N" ,"J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E"];
  var numerosDni=dni.substring(0,dni.length-1); //Recordemos que el último parámetro no se muestra. Es decir, si el DNI es 50556234A:
    // dni.length = es 9. Si quiero que me coja los numeros, es 9-1=8. de 0 a 8, porque la A, que ocupa la 8, no la cogería.
  var resto=0; var letra;
  if(numerosDni.length<6 || numerosDni.length>8 || numerosDni<100000){
    salida= 3; //mal los digitos y el valor total
  }//de if
  else{
    if(isNaN(numerosDni)){
        salida=0;//dato no valido 
      }//de if
    else{
      resto=numerosDni%23;
      letra=letraControl[resto];
      if(letra!=dni.charAt(dni.length-1)){ //Aqui si tengo que usar el dni.length-1, porque coge directamente esa posición del DNI, en este caso la A. 
        salida= 2; //caracter de control erroneo
      }//de if
    }//de else
  }//de else principal
  return salida;
}//fin de esNif

//funcion nif
function esCif (cif) {
  let cadena=cif;
  var cadenaCif = cadena.trim().toUpperCase();
  var resultado="";
  var inicio = "ABCDEFJHJUVPQRSW";
  var inicio1 = "ABCDEFJHJUV";
  var inicio2 = "PQRSW"; //Esta no la uso, en verdad creo que se podría quitar. Porque su parte se analiza con un else. 
  var letras ="JABCDEFGHI";
  if (!inicio.includes(cadenaCif.charAt(0)) || cadenaCif.length!=9) { //Se comprueba si el nif empieza por inicio1 y si tiene un tamaño diferente a 9. Luego seguimos comprobando. 
      resultado="0";  //dato no valido
  } else {
      var digitos=true;   
      for (var i=1; i<8; i++) { //se comprueba si el cif sigue con 7 digitos. Desde la posicion 1 a la 8 (siete digitos).
        if (cadenaCif.charAt(i)<"0" || cadenaCif.charAt(i)>"9") {
          digitos=false;
        }//condicion digitos if 
      }//bucle for
      if (digitos) {//si es un digito, comprueba lo de pares e impares. 
        var sumaPares=0; //posicionpares
        var sumaImpares=0; //posicionimpares
        for (var i=1; i<8; i+=2) { //Primero analizamos los impares. 
         var numeroPosicionImpar=parseInt(cadenaCif.charAt(i), 10)*2; //Si el digito ocupa una posicion impar, coge cada digito y multiplica por dos. 
          if (numeroPosicionImpar>9) {//si el resultado es mayor que 9, ¿SUMA LOS DÍGITOS ENTRE SÍ?
            sumaImpares = 1 + (numeroPosicionImpar%10); //no entiendo por qué. "Si el resultado > 9 se suman los dígitos entre sí". ¿Pero qué dígitos se suman? 
          }//bucle if impares
           else {
           sumaImpares+= numeroPosicionImpar;
           } //SI NO es mayor que 9, coge el valor de la multiplicacion (y se añade a la suma de los impares). 
        }//bucle for
     for (var j=2;j<8;j+=2) {
          sumaPares += parseInt(cadenaCif.charAt(j), 10); //se suman entre sí los dígitos que ocupan posiciones pares
        }
        var sumaTotal=sumaPares + sumaImpares; //se suman los dos valores obtenidos
        var division = sumaTotal % 10; //Dividimos el valor obtenido entre 10 y nos quedamos con el resto.
        var complemento = (10-division)%10; //Obtenemos el complemento a 10 (10 - número) del valor anterior, 
        //si el valor obtenido es 10 se utiliza el 0.
        //Si el carácter-control es un dígito el valor anterior es el carácter de control. Si el carácter-control es una letra se hace la siguiente conversión.
        let caractercontrol;
        if (inicio1.includes(cadenaCif.charAt(0))){ //Si empieza por ABCDEFJHJUV, entonces tendrá el carácter de control será dígito. 
          caractercontrol = complemento.toString(); //¿por qué se convierte a toString?
        }else{ //SI no empieza por ABCDEFJHJUV, es que empieza por PQRSW, en ese caso, el caracter de control sera 
          caractercontrol=letras.charAt(complemento); //por que es complemento. 
        }
        if (cadenaCif.charAt(8)==caractercontrol){ //si en el cif introducido, en su posicion 8, es decir, el carácter de control, coincide con el carácter de control que hemos definido antes, todo estaría OK. 
          resultado = "1"; //cif correcto
        }else {
          resultado="2"; //falla el codigo de control
        }
      } else {
        resultado="0";//de if (digitos) /dato no valido 
      }
  }//del else PRINCIPAL
  return resultado; //La funcion tiene que devolver el resultado. 
}//FIN DE LA LLAVE función esCif


//funcion nifCif
function NIFCIF(nifCif){

  var esNifCif = nifCif.trim().toUpperCase();
  //Lo primero, ¿qué diferencia a uno de otro? Los inicios. En la practica anterior se decia que empieza por unas letras determinadas
  var inicioDni= "XYZLKM1234567890"; //pero tambien podria ser que empezase por números, así que los añado (eso no sé si estaba, pero mi dni empieza por 5)
  var inicioCif = "ABCDEFJHJUVPQRSW";
  var enviar;
  //y ahora simplemente se plantea eso. Si empieza por X es una cosa y si empieza por Y es otra. 
  if (inicioDni.includes(esNifCif.charAt(0))) { //si el tipico inicio del dni esta incluido en el esnifCif, entonces es un nif y tiene que aplicarse la funcion del nif. 
        var essNif=esNif(esNifCif); //En ese caso, hay que aplicar la funcion esNif al parámetro que se recibe desde la caja. 
        //La funcion esNif puede devolver 0,1,2 o 3. El 1 sería que todo OK y los demás dan algún tipo de problema. 
        if (essNif=="0"){
            enviar = essNif;
        }else {
          enviar ="N"+essNif.toString();
        }
    } else if (inicioCif.includes(esNifCif.charAt(0))) {
    var essCif=esCif(esNifCif);
    if (essCif=="0") 
      enviar=essCif
    else
      enviar ="C"+essCif.toString();
  } else
    enviar=0;
  return enviar;
}//fin funcion principal


//funcion codigosControl //Probando poco a poco. 

function codigosControl (cBanco, nSucursal, nCuenta) { //4 digitos, 4digitos y 10 digitos. 
  //tiene que devolver un valor que es el codigo de control de cuenta: 2 digitos.
  //La parte de codigoBANCO
 var codigoBanco = cBanco.trim();
 var primeraBanco = parseInt(codigoBanco.charAt(0),10)*4; //dice Felix que conviene siempre parsear y convertir en decimal.
 var segundaBanco =  parseInt(codigoBanco.charAt(1),10)*8;
 var terceraBanco = parseInt(codigoBanco.charAt(2),10)*5;
 var cuartaBanco = parseInt(codigoBanco.charAt(3),10)*10;
 var numero1 = primeraBanco+segundaBanco+terceraBanco+cuartaBanco;

//La parte de NumeroSucursal
 var numeroSucursal = nSucursal.trim();
 var primeraSucursal = parseInt(numeroSucursal.charAt(0),10)*9;
 var segundaSucursal = parseInt(numeroSucursal.charAt(1),10)*7;
 var terceraSucursal = parseInt(numeroSucursal.charAt(2),10)*3;
 var cuartaSucursal = parseInt(numeroSucursal.charAt(3),10)*6;
 var numero2 = primeraSucursal+segundaSucursal+terceraSucursal+cuartaSucursal;

 var sumaBancoSucursal = numero1 + numero2;
 var restoSucursal = sumaBancoSucursal%11;
 var modulo = 11 - restoSucursal; 

 var caracterControl = "";
 if (modulo==10)
    caracterControl="1";
  else if (modulo==11) 
    caracterControl="0";
  else 
    caracterControl=modulo.toString(); //Si el valor obtenido tiene un dígito ese va a ser el primero de los caracteres de control
//La parte del numero de la Cuenta 
//Se podría hacer con un array, para no ir poniendo todos los numeros a mano. 

var numerosMutiplicaCuenta = new Array(1,2,4,8,5,10,9,7,3,6);
var numeroCuenta = nCuenta.trim();
var numero3=0;

for (var i=0; i<numerosMutiplicaCuenta.length; i++){
        numero3+=parseInt(numeroCuenta.charAt(i),10)*numerosMutiplicaCuenta[i]; //Se me está olvidando hacer los parseos a int, para asegurar que no hay conflicto de tipos. 
}

var restoCuenta = numero3 % 11; //dividimos el numero3 por el 11 y nos quedamos con el resto.
modulo = 11 - restoCuenta;
  if (modulo==10) //Se repite el proceso que se había puesto arriba, PERO AQUI BUSCAMOS SABER EL SEGUNDO CARACTER DE CONTROL, ASÍ QUE HAY QUE USAR += SOBRE LA VARIABLE. 
    caracterControl+="1";
  else if (modulo==11) 
    caracterControl+="0";
  else 
    caracterControl+=modulo.toString(); 
return caracterControl; //esta funcion tiene que devolver LOS DOS CARÁCTERES DE CONTROL. 

}//de la funcion codigosControl 
//Habría que hacer la comprobación de codigosControl, a ver si funciona. PARECE QUE SÍ FUNCIONA. Tanto con el codigo del Santander como con otros. 
/*function codigoControlCorrecto(){ //FUNCION DE PRUEBA, NO LA HE LLAMADO TODAVÍA EN LA PARTE DE LA COMRPOBACIÓN. 
  var codigoCorrecto=codigosControl("0049", "1500","1234567892"); //Esta es la cuenta real del Santander, usada para hacer la prueba. El codigo de control que hay que poner en el formulario es 05
  var codigoIntroducido=document.formulario.codigoControl.value.trim();
  if(codigoCorrecto==codigoIntroducido){
    return true;
  }//de if
  else{
    return false;
  }//de else
}//de function*/


//Hacer la funcion del IBAN para España 
function calculoIBANEspanya (codigoCuenta) { //la funcion tiene que tener un return del codigo IBAN para España. 

  var codigoIBAN=codigoCuenta+"ES00";
  codigoIBAN = codigoIBAN.replace("E",14);
  codigoIBAN = codigoIBAN.replace("S",28);
  var resto = (parseInt(codigoIBAN))%97;
  var codigo = 98-resto;
  if (codigo<10){
    codigoIBAN="ES0"+codigo.toString+codigoCuenta; //si es menor de 10, se le añade 0.
    } else {
      codigoIBAN="ES"+codigo.toString+codigoCuenta;
     } //si es mayor de 10, simplemente hay que añadirlo despues del ES. 
  return codigoIBAN;
}

//fin funcion calculo IbanEspanya */

//Ahora toca comprobar el IBAN 
function comprobarIBAN(codigoIBAN) { //Tiene que devolver un valor lógico que nos diga si el codigo IBAN de una cuenta es correcto (true) o falso. 
//El codigo IBAN tiene que tener: 2 letras, dos digitos control y el codigo de la cuenta. Dependerá del país. El número máximo de caracteres, eso sí, será de 34.
  var cuatroPrimeros = codigoIBAN.slice(0,5); //Los cuatro primeros caracteres del IBAN. El 5 no lo tiene en cuenta. 
//Ahora hay que extraer las dos primeras letras. 
  var letra1=cuatroPrimeros.charAt(0);
  var letra2=cuatroPrimeros.charAt(1);
//Ahora hay que comprobar la longitud que tiene el IBAN en función de cada país. ¿Cómo se hace eso? Tenemos que pasarle a una función las letras del país y que nos devuelve la longitud. 
  if (calculaLongitud(letra1+letra2)==codigoIBAN.length){ //Si la longitud que debería tener corresponde con la que se ha puesto en el formulario, entonces: 
//hay que convertir todas las letras a numeros a partir de una tabla. 
    var letra1Numero1 = convertirLetrasIban(letra1); //convertimos la letra en numero
    var letra2Numero2 = convertirLetrasIban(letra2); //convertimos la letra en numero
//hay que colocar los cuatro primeros caracteres del IBAN al final. 
    var IBANcolocado= codigoIBAN.slice(5)+letra1Numero1+letra2Numero2+cuatroPrimeros.slice(2,3)+cuatroPrimeros.slice(3); 
    //Ahora toca llamar a una funcion que calcule el tema de la longitud. Si el número es demasiado grande, seleccionamos 9 digitos 
    //y lo dividimos entre %97 para tener el resto. Se genera un nuevo número: primero el resto y luego el resto de dígitos. 
    //Luego se divide %97 y nos quedamos de nuevo con el resto. (ESO SE HACE EN LA FUNCIÓN demasiado grande);
    if (demasiadoGrande(IBANcolocado)==1) { //Si el resto es 1, entonces devuelve verdadero, si no es falso.
      return true;
    }else {
      return false;
    }//cierre else
  }//cierre if principal
}//fin funcion comprobar IBAN

function convertirLetrasIban (letraIban) {
  var letra="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  //vale, cada letra va asociada a +10. así que tengo que asociar cada posicion del array letras a 10+i. Por ejemplo, la E ocupa posicion 4, asi que me tiene que devolver 14.
  for (var i=0; i<letra.length; i++){
    if (letraIban == letra.charAt(i)) {
      return i+10;
   } //cierre if
  }//cierre for
}//FUNCION convertir letras IBAN 

function calculaLongitud (inicialesPais) {
  var letrasPais=["DE","BE","CY","DK","SI","EE","FR","HU","IT","LT","MT","PL","GB","RO","IS","CH","MC","AT","BG","HR","SK","ES","FI","GR","IE","LV","LU","NL","PT","CZ","SE","NO","SM","LI"];
  var numerosAsociadosPais=[22,16,28,18,19,20,27,28,27,20,31,28,22,24,26,21,27,20,22,21,24,24,18,27,22,21,20,18,25,24,24,15,27,21];
  var posicion = letrasPais.indexOf(inicialesPais); //Si por ejemplo las iniciales del PAIS SON "ES", con el indexOF le digo que me diga cuál es la posición que ocupa "ES" en el array letrasPais. COn "ES" devuelve 21.
  if (posicion!=-1) { //Si el indexOf es diferente a -1 es porque ha encontrado coincidencia, es decir, las iniciales del país están en el array letras Pais. 
    return numerosAsociadosPais[posicion]; //En ese caso devuelve la longitud que le correspondería al IBAN (el numero de numerosAsociadosPais que sale de la posicion que le hemos pasado con la variable POSICION) En la posicion 21 de ese array está el número 24, que es la longitud para el IBAN de España.
  } //cierre if
    else {
      return posicion;
    } //Si el indexof es -1, es decir, si no encuentra coincidencia, por ejemplo, he puesto "AS" en el IBAN y no corresponde a ningun pais, devuelve -1, que sería como falso. 
}//fin de la funcion de calculaLongitud 

function demasiadoGrande (IBANPartes) {
//Al bucle solo entre si el numero es mayor de 16, y creo que casi siemrpre lo va a ser. ¿POR QUÉ 16? PORQUE ES EL MÁXIMO DE DÍGITOS QUE ADMITE INT. 
while (IBANPartes.length>16){//es decir, si el número es muy grande. Y lo va a ser siempre porque solo hay un IBAN de 16 digitos, haz lo siguiente:
  var nuevePrimeros = ((parseInt)(IBANPartes.slice(0,10)))%97; //seleccionamos los primeros 9 digitos.  //El nuevePrimeros se divide entre 97 y nos QUEDAMOS CON EL RESTO.  //"IBANcolocado" pasa a ser el RESTO generado, QUE SUSTITUYE a los 9 primeros DÍGITOS, Y SE LE CONCATENA LOS 9 SIGUIENTES.
    IBANPartes=nuevePrimeros+IBANPartes.slice(10);//Y lo volvemos a dividir entre %97 y nos quedamos con el NUEVO RESTO. 
  } //fin while 
    return ((parseInt)(IBANPartes)%97);
}//fin funcion DemasiadoGrande



//razonSocial/Apellidos, nombre. 
//La Razón Social/Apellidos y Nombre va a empezar por una letra, 
//y en su interior puede contener letras, dígitos, y los caracteres, “ª”, “º”, “-“ y “.”. Va a terminar por una letra, un dígito o un punto.
function comprobarNombre (nombre) {
  var especiales = "ªº-.";
  var esNombre= true;
  var ultimaPosicion = nombre.length-1;
  if (nombre.charAt(0)<"a" || nombre.charAt(0)>"z") {
    esNombre=false;
  }//final if 
  else {
    for (var i=1; i<nombre.length-2; i++) {
      if ((nombre.charAt(i) < "a" || nombre.charAt(i)>"z") && 
      !especiales.includes(nombre.charAt(i)) && 
      (nombre.charAt(i)<"0" || nombre.charAt(i) > "9")) {
      esNombre=false;
      } //final if   
    }  //final for 
    if ((nombre.charAt(ultimaPosicion) < "a" || nombre.charAt(ultimaPosicion)>"z") &&
        (nombre.charAt(ultimaPosicion)!=".") && (nombre.charAt(ultimaPosicion)<"0" || nombre.charAt(ultimaPosicion) > "9")) {
          esNombre=false;
      }//final if
    }//final else
return esNombre;
}//final comprobarNombre

//El Código de la empresa va a contener letra y dígitos y va a tener un número de caracteres comprendidos entre 5 y 10.
function comprobarCodigoEmpresa (codigoEmpresa) {
  var esEmpresa=true; 
  if (codigoEmpresa<5 || codigoEmpresa>10) {
    esEmpresa=false;
  }//final if 
  else {
    for (var i=0; i<codigoEmpresa.length-1; i++){
      if ((codigoEmpresa.charAt(i)<"a" || codigoEmpresa.charAt(i)>"z") 
        && (codigoEmpresa.charAt(i)<"0" || codigoEmpresa.charAt(i)>"9")) {
          esEmpresa=false;
      }//final if
    }//fin bucle for
  }//fin else
  return esEmpresa;
}//final CodigoEmpresa

//La Dirección va a comenzar por una letra, 
//va a terminar por una letra o un dígito y en medio va a poder contener letras, dígitos, y los caracteres “ª”, “º”, “-“, “/” y “.”.
function comprobarDireccion (direccion) {
 var especiales = "ªº-/.";
  var esDireccion= true;
  var ultimaPosicion = direccion.length-1;
  if (direccion.charAt(0)<"a" || direccion.charAt(0)>"z") {
    esDireccion=false;
  }//final if 
  else {
    for (var i=1; i<direccion.length-2; i++) {
      if ((direccion.charAt(i) < "a" || direccion.charAt(i)>"z") && 
      !especiales.includes(direccion.charAt(i)) && 
      (direccion.charAt(i)<"0" || direccion.charAt(i) > "9")) {
      esDireccion=false;
      } //final if   
    }  //final for 
    if ((direccion.charAt(ultimaPosicion) < "a" || direccion.charAt(ultimaPosicion)>"z") &&
        (direccion.charAt(ultimaPosicion)<"0" || direccion.charAt(ultimaPosicion)>"9")) {
          esDireccion=false;
      }//final if
    }//final else
      return esDireccion;
}//final comprobarDireccion

//comprobar localidad
//La Localidad va a empezar y terminar con letra y en medio va a contener letras o espacio.
function comprobarLocalidad (localidad) {
  var cLocalidad = true;
  var finalLocalidad = localidad.length-1;
  if ((localidad.charAt(0)<"a" || localidad.charAt(0)>"z") || (localidad.charAt(finalLocalidad)<"a" || localidad.charAt(finalLocalidad)>"z")) {
    cLocalidad=false; 
  }//final condicion if
  else {
    for (var i=1; i<localidad.length-2; i++){
      if ((localidad.charAt(i)<"a" || localidad.charAt(i)>"z") && (localidad.charAt(i)!=" ")) {
        cLocalidad=false;
      }//final if
    }//final bucle for
  }//final else
    return cLocalidad;
}//final comprueba localidad

function codigoPostal () {
  var cp = document.formulario.codigoPostal.value;
  var codiPostal=true;
  var provincias=['Alava','Albacete','Alicante','Almeria','Avila','Badajoz','Islas Baleares','Barcelona','Burgos','Caceres','Cadiz','Castellon','Ciudad Real','Cordoba',
          'La Coruña','Cuenca','Gerona','Granada','Gualdajara','Guipúzcoa','Huelva','Huesca','Jaén','León','Lérida','La Rioja','Lugo','Madrid','Málaga','Murcia',
          'Navarra','Orense','Asturias','Palencia','Las Palmas','Pontevedra','Salamanca','Santa Cruz de Tenerife','Cantabria','Segovia','Sevilla','Soria','Tarragona',
          'Teruel','Toledo','Valencia','Valladolid','Vizcaya','Zamora','Zaragoza','Ceuta','Melilla'];
          
      if (((Math.floor(cp/1000))-1)>-1 && ((Math.floor(cp/1000))-1)<52) { //Ejemplo Madrid: 28025/1000=28.025, con el flor se queda en 28. 28-1=27. La posicion 27 en provincias está ocupada por Madrid.
        document.formulario.provincia.value=provincias[(Math.floor(cp/1000))-1]; //en verdad esto actúa como en return, porque le estoy pasando a la caja de texto una acción. 
      }
      else {
        codiPostal=false;  
      }
    return codiPostal;
}//final codigoPostal. 


//Inicio telefono
//El Teléfono contiene nueve dígitos y solamente puede empezar por 9, 6 y 7.
function comprobarTelefono (telefono){
  var esTelefono=true; 
  var inicio="967";
  if (telefono.length!=9) {
      esTelefono=false;
  } else {
      if (!inicio.includes(telefono.charAt(0))){
      esTelefono=false;
      }//fin if
    }//fin else;
  return esTelefono;
}//final funcion comprobar telefono

//FUNCION COMPROBAR FAX
//El Fax contiene nueve dígitos y empieza por 9. //¿PERO ESTO DÓNDE LO APLICO? 
function comprobarFax (fax) {
 var esFax=true; 
 var inicio="9";
  if (fax.length!=9) {
      esFax=false;
  } else {
      if (!inicio.includes(fax.charAt(0))){
      esFax=false;
      }//fin if
    }//fin else;
  return esFax;
}//final funcion comproabrFax

//Los números que se introducen van a ser siempre positivos. ?????


//La Fecha puede tener uno ó dos dígitos para el mes y día y para el año va a poder tener dos o cuatro dígitos.
//ESTA VALIDACION ES UN POCO CHAPUZA  
function comprobarFecha (fecha) {
var esFecha=true;
var fechaPartes = fecha.split("/"); //con esto divido la fecha en partes.
var dia = fechaPartes[0];
var mes = fechaPartes[1];
var anyo = fechaPartes[2];

  if ((dia.length!= 1 && dia.length!=2) || (dia<"0" || dia>"31")) { //No estoy diferenciando entre los distintos días que puede tener cada mes ni nada. Revisar cuando tenga tiempo. 
    esFecha=false; 
  }//fin if
  else {
    if ((mes.length!=1 && mes.length!=2) || (mes<"0" || mes>"12")) {
      esFecha=false; 
    }//fin if
     else {
      if (anyo.length!=2 && anyo.length!=4){
        esFecha=false;
      } if (fechaPartes.length>3) {
        esFecha=false;
      }//fin if 
    }//fin else
 }//fin else principal
 return esFecha;
}//fin funcion comprueba fecha 

//Se debe comprobar que en las agrupaciones de los botones de selección solamente uno esté seleccionado y 
//en las casillas de verificación debe haber al menos uno seleccionado.
function comprobarAgrupaciones() { //A LOS INPUT TYPE RADIO SE ACCEDE CON EL CHECKED. 
  var estaMarcada=true; 
  var contador=0;
  var tipoPersona= new Array (document.formulario.tipoPersona[0], document.formulario.tipoPersona[1]); //TipoPersona = (física, jurídica).
  for (var i=0; i<tipoPersona.length; i++){
    if (!tipoPersona[i].checked){
      estaMarcada=false;
    }//fin if
    else {
     contador++;
    }//fin else
   if (contador==1){
      estaMarcada=true;
    }//final if
  }//fin bucle for
  return estaMarcada;
}//fin funcion agrupaciones

//Se debe comprobar que en las agrupaciones de los botones de selección solamente uno esté seleccionado y 
//en las casillas de verificación debe haber al menos uno seleccionado.
function comprobarTipodeEmpresa() {
  var esTipoEmpresa = true; 
  var contador=0;
  var tipoEmpresa = new Array (document.formulario.tEmpresa[0], document.formulario.tEmpresa[1],document.formulario.tEmpresa[2],document.formulario.tEmpresa[3],document.formulario.tEmpresa[4],
    document.formulario.tEmpresa[5]);
  for (var i=0; i<tipoEmpresa.length; i++) {
      if (!tipoEmpresa[i].checked) {
        esTipoEmpresa=false; 
      }//final if
      else {
        contador++;
      }
     if (contador==1) {
      esTipoEmpresa=true; 
     } //final if
  }//final bucle for
  return esTipoEmpresa;
}//fin funcion comprobar tipo de empresa

//Se debe comprobar que se han seleccionado al menos dos comunidades autónomas en las que hay fábricas.
function comprobarComunidades() { // A LOS INPUTS Select OPTION SE ACCEDE CON UN SELECTED. 
  var sonComunidades=true; 
  var contador=0;
  for (var i=0; i<document.formulario.comunidades.length; i++){
    if (document.formulario.comunidades[i].selected){
      contador++;
    }//fin if 
  }//fin bucle for 
    if (contador<2){
      sonComunidades=false;
    }//fin if
  return sonComunidades; 
}//fin funcion comprobar CCAA

//Se debe comprobar que en los sectores económicos al menos hay uno seleccionado. Hay otras formas de hacerlo, pero esta es la más corta. 
function comprobarSectores() {
  var esSector=true; 
  var contador=0;
  for (var i=0; i<document.formulario.elements.length; i++){
    if (document.formulario.elements[i].type=="checkbox") {
      if (document.formulario.elements[i].checked) {
        contador+=1;
      }
    }//final if
  }//final for
  if (contador<1){
    esSector=false;
  }//final if
  return esSector;
}//final funcion sectores economicos;

