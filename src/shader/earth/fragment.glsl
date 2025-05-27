uniform vec3 uSunDirection;

uniform sampler2D uEarthDayMapTexture; 
uniform sampler2D uEarthNightMapTexture; 

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main()
{
    vec2 uv = vUv;
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 sunDirection = uSunDirection;
    float sunOrientation = dot(sunDirection, normal);

    float dayMix = smoothstep(-0.25, 0.5, sunOrientation);

    vec4 dayColor = texture2D(uEarthDayMapTexture, uv);
    vec4 nightColor = texture2D(uEarthNightMapTexture, uv);


    color = mix(
        nightColor.rgb,
        dayColor.rgb,
        dayMix
    );

    float fresnel = dot(vPosition, viewDirection) + 1.0;
    fresnel = pow(fresnel, 2.0);

    vec3 reflection = reflect(-sunDirection, normal);
    float specular = -dot(viewDirection, reflection);
    specular = max(0.0, specular);
    specular = pow(specular, 20.0);

    color = vec3(specular);


    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}