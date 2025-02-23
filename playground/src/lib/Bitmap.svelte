<script lang="ts">
	import type { HTMLCanvasAttributes } from 'svelte/elements';
	type Props = HTMLCanvasAttributes & {
		data: Uint8Array;
		width: number;
		height: number;
	};
	let { data, width, height, ...props }: Props = $props();
	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!canvas) return;
		const gl = canvas.getContext('webgl2');
		if (!gl) return;

		const vertexShaderSource = `\
#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

in vec2 a_texCoord;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

out vec2 v_texCoord;

// all shaders have a main function
void main() {
	// convert the position from pixels to 0.0 to 1.0
	vec2 zeroToOne = a_position / u_resolution;

	// convert from 0->1 to 0->2
	vec2 zeroToTwo = zeroToOne * 2.0;

	// convert from 0->2 to -1->+1 (clipspace)
	vec2 clipSpace = zeroToTwo - 1.0;

	// invert y axis
	clipSpace.y *= -1.0;

	gl_Position = vec4(clipSpace, 0, 1);

	// pass the texCoord to the fragment shader
	// The GPU will interpolate this value between points
	v_texCoord = a_texCoord;
}
`;

		const fragmentShaderSource = `\
#version 300 es
precision highp float;
 
// our texture
uniform sampler2D u_image;
 
// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
	// Look up a color from the texture.
	outColor = texture(u_image, v_texCoord);
}`;
		const vertexShader = gl.createShader(gl.VERTEX_SHADER);
		if (!vertexShader) return;
		gl.shaderSource(vertexShader, vertexShaderSource);
		gl.compileShader(vertexShader);
		const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		if (!fragmentShader) return;
		gl.shaderSource(fragmentShader, fragmentShaderSource);
		gl.compileShader(fragmentShader);

		const program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		// look up where the vertex data needs to go.
		const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
		const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

		// look up uniform locations
		const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
		const imageLocation = gl.getUniformLocation(program, 'u_image');

		// Create a buffer and put a single pixel space rectangle in
		// it (2 triangles)
		// Create a buffer and put three 2d clip space points in it
		const positionBuffer = gl.createBuffer();

		// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Create a vertex array object (attribute state)
		const vao = gl.createVertexArray();

		// and make it the one we're currently working with
		gl.bindVertexArray(vao);

		// Turn on the attribute
		gl.enableVertexAttribArray(positionAttributeLocation);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		// Tell WebGL how to convert from clip space to pixels
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// provide texture coordinates for the rectangle.
		const texCoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
			gl.STATIC_DRAW
		);
		gl.enableVertexAttribArray(texCoordAttributeLocation);
		gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		// Create a texture.
		const texture = gl.createTexture();

		// make unit 0 the active texture uint
		// (ie, the unit all other texture commands will affect
		gl.activeTexture(gl.TEXTURE0 + 0);

		// Bind it to texture unit 0' 2D bind point
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the parameters so we don't need mips and so we're not filtering
		// and we don't repeat
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		// Upload the image into the texture.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, data);

		// Tell it to use our program (pair of shaders)
		gl.useProgram(program);

		// Bind the attribute/buffer set we want.
		gl.bindVertexArray(vao);

		// Pass in the canvas resolution so we can convert from
		// pixels to clipspace in the shader
		gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

		// Tell the shader to get the texture from texture unit 0
		gl.uniform1i(imageLocation, 0);

		// Bind the position buffer so gl.bufferData that will be called
		// in setRectangle puts data in the position buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		function setRectangle(
			gl: WebGL2RenderingContext,
			x: number,
			y: number,
			width: number,
			height: number
		) {
			const x1 = x;
			const x2 = x + width;
			const y1 = y;
			const y2 = y + height;
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
				gl.STATIC_DRAW
			);
		}
		// Set a rectangle the same size as the image.
		setRectangle(gl, 0, 0, width, height);
		// draw
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	});
</script>

<canvas bind:this={canvas} {width} {height} {...props}></canvas>
