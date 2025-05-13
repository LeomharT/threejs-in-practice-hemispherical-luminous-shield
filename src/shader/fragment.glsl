#define PI 3.1415926

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uSunPosition;
uniform sampler2D uSpecularCloudsTexture;

void main()
{
    vec2 uv = vUv;

    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 sunPosition = uSunPosition;
    vec3 sunDirection = normalize(sunPosition - normal);

    vec4 specularCloudsTexture = texture2D(uSpecularCloudsTexture, uv);

    // Specular
    vec3 reflection = reflect(sunDirection, normal);
    float specular = -dot(reflection, normal);
    specular = max(0.0, specular);
    specular = pow(specular, 20.0);
    specular *= specularCloudsTexture.r;

    color += vec3(specular);

    gl_FragColor = vec4(color, 1.0);
}