/**
 * Agent Aura - WebGL2 visual effects for Agent UIs
 *
 * @author wangmiao<tuziling84@gmail.com>
 * @license MIT
 * @repository https://github.com/wangmiaozero/agent-aura
 */

#version 300 es

in vec2 aPosition;
in vec2 aUV;
out vec2 vUV;
void main() {
	vUV = aUV;
	gl_Position = vec4(aPosition, 0.0, 1.0);
}