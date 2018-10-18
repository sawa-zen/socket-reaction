attribute vec3 position;
attribute vec4 color;
uniform   mat4 mMatrix;
uniform   mat4 vMatrix;
uniform   mat4 pMatrix;
varying   vec4 vColor;

void main(void){
    vColor = color;
    gl_Position = pMatrix * vMatrix * mMatrix * vec4(position, 1.0);
}
