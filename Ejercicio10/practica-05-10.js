window.onload = inicio; //cargo la funcion inicio desde el comienzo, que contiene el evento de click botones. 

function compruebaUrl() {


    var url = document.formulario.url.value.toLowerCase();
    var direccionValida = true;

       if (!(url.startsWith("http://www.") || url.startsWith("https://www.") || url.startsWith("www."))) {

            direccionValida=false;
       
        } else {

            var posicionPunto = url.indexOf(".");
            
            if (posicionPunto==-1) {

                direccionValida=false;

            }   else {

            var subcadena = url.substring(posicionPunto);

           if ((subcadena.charAt(posicionPunto) < "a" || subcadena.charAt(posicionPunto)>"z")) {

                 direccionValida=false;

           }

                else {

                        var posicionPuntoDos = email.lastIndexOf(".") 

                        if (posicionPuntoDos==-1) {

                            direccionValida=false;

                }
                    else {

                        subcadena2 = subcadena.substring(posicionPunto+1, posicionPuntoDos);

                        for (var i=1; i<posicionPuntoDos -1; i++) {

                            if ((subcadena2.charAt(i) < "a" || subcadena2.charAt(i)>"z") && 
                                (subcadena2.charAt(i)<"0" || subcadena2.charAt(i) > "9")  
                                && subcadena2.charAt(i)!="-" && subcadena2.charAt(i)!=".") {

                                esEmail=false;
                            }   

                                else {

                                if ((subcadena2.charAt(posicionPuntoDos -1) < "a" || subcadena2.charAt(posicionPuntoDos -1)>"z") && 
    
                                    (subcadena2.charAt(posicionPuntoDos -1)<"0" || subcadena2.charAt(posicionPuntoDos -1) > "9")) {

                                    esEmail=false;

                                }   else  {

                                        var urlFinal=url.substring(posicionPuntoDos+1);
                                        var posicionFinal=urlFinal.length;


                                         if ((urlFinal.length < 2 || urlFinal.length > 4)) { 

                                            esEmail=false;

                                                }  else {


                                                        for (var i= 0; i<posicionFinal; i++) {

                                                            if (urlFinal.charAt(i)<"a" || urlFinal.charAt(i)>"z") { 
                                                                esEmail=false;
                                                            }

                                                         }
                                                     }

                                                } //septimo else
                                    }//sexto else

                                }//quinto else
                    }//cuarto else

                    }//tercerelse
                }//segundo else
        }//else principal


    if (compruebaUrl)
       document.formulario.mensaje.value="La URL es correcta";
    else 
        document.formulario.mensaje.value="La URL es incorrecta";

} //fin funcion 



function inicio () { //se carga automaticamente cuando se abre la pagina. Cuando se apriete el botón se pone en marcha la funcion de conversionNumeros. 

document.formulario.boton.onclick = compruebaUrl;

}