var init = function() {
  var box = document.getElementById("cube");
  setTimeout(function(){
    cube.style.cssText = "-webkit-transform:rotateZ(" + 10 + "deg);";
  }, 500);

  setTimeout(function(){
    cube.style.cssText = "-webkit-transform:rotateZ(" + 20 + "deg);";
  }, 1000);

  setTimeout(function(){
    cube.style.cssText = "-webkit-transform:rotateZ(" + 30 + "deg);";
  }, 1500);
  
};
  
window.addEventListener( 'DOMContentLoaded', init, false);