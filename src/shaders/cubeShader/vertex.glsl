uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // modelPosition.y += aRandom;
    // modelPosition.y += aRandom;
    // modelPosition.z += 10.0;

    // modelPosition.z += sin(modelPosition.y * 10.0) * .10;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
}