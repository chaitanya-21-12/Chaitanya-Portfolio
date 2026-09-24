'use client';

import { useEffect, useRef } from 'react';

interface ColorRGB { r: number; g: number; b: number; }
interface Pointer {
  id: number; texcoordX: number; texcoordY: number;
  prevTexcoordX: number; prevTexcoordY: number;
  deltaX: number; deltaY: number;
  down: boolean; moved: boolean; color: ColorRGB;
}
interface FBO {
  texture: WebGLTexture; fbo: WebGLFramebuffer;
  width: number; height: number; texelSizeX: number; texelSizeY: number;
  attach: (id: number) => number;
}
interface DoubleFBO {
  width: number; height: number; texelSizeX: number; texelSizeY: number;
  read: FBO; write: FBO; swap: () => void;
}

function pointerPrototype(): Pointer {
  return { id:-1, texcoordX:0, texcoordY:0, prevTexcoordX:0, prevTexcoordY:0,
           deltaX:0, deltaY:0, down:false, moved:false, color:{r:0,g:0,b:0} };
}

/**
 * WebGL Fluid Simulation — atmospheric ink/smoke cursor.
 *
 * Key design decisions:
 *  - SPLAT_FORCE 3500 + SPLAT_RADIUS 0.12  → soft thin injection, not a splat
 *  - DENSITY_DISSIPATION 0.90              → trail lingers naturally
 *  - VELOCITY_DISSIPATION 0.22             → fluid stretches behind cursor
 *  - CURL 3                                → gentle drift, not tornado
 *  - Smooth cursor lerp (0.08)             → velocity naturally scales force
 *    (slow move = small deltaX/Y = small force; fast = larger but clamped by lerp)
 *  - No fluid injection when cursor is still → cloud STOPS when cursor stops
 *  - canvas z-index 7, mixBlendMode screen → renders BEHIND hero text (z:10+)
 */
export default function CursorGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip heavy WebGL fluid sim on low-end devices (< 4 CPU cores)
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4) return;

    // ── Config ────────────────────────────────────────────────────────────────
    const config = {
      SIM_RESOLUTION:      64,
      DYE_RESOLUTION:      512,
      DENSITY_DISSIPATION: 1.25,   // balanced: visible smoke trail without turning into thick dense fog
      VELOCITY_DISSIPATION: 0.35,  // smooth fluid drag
      PRESSURE:            0.08,
      PRESSURE_ITERATIONS: 8,
      CURL:                2.5,    // graceful organic swirls
      SPLAT_RADIUS:        0.09,   // balanced plume thickness
      SPLAT_FORCE:         3400,   // responsive, visible smoke injection
      SHADING:             true,
      COLOR_UPDATE_SPEED:  10,
      TRANSPARENT:         true,
      RAINBOW_MODE:        false,
      COLOR:               '#c8102e',
    };

    let pointers: Pointer[] = [pointerPrototype()];

    // ── WebGL setup ───────────────────────────────────────────────────────────
    const params = { alpha:true, depth:false, stencil:false, antialias:false, preserveDrawingBuffer:false };
    let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
    if (!gl) gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext | null;
    if (!gl) return;

    const isWebGL2 = 'drawBuffers' in gl;
    let supportLinearFiltering = false;
    let halfFloat: OES_texture_half_float | null = null;
    if (isWebGL2) {
      (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float');
      supportLinearFiltering = !!(gl as WebGL2RenderingContext).getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
    }
    if (!supportLinearFiltering) { config.DYE_RESOLUTION = 256; config.SHADING = false; }

    gl.clearColor(0,0,0,1);
    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : (halfFloat?.HALF_FLOAT_OES) || 0;
    const gl2 = gl as WebGL2RenderingContext;

    function getSupportedFormat(inF: number, fmt: number): { internalFormat: number; format: number } | null {
      if (!supportRenderTextureFormat(inF, fmt, halfFloatTexType)) {
        if (isWebGL2) {
          if (inF === gl2.R16F)  return getSupportedFormat(gl2.RG16F,   gl2.RG);
          if (inF === gl2.RG16F) return getSupportedFormat(gl2.RGBA16F,  gl2.RGBA);
          return null;
        }
        return null;
      }
      return { internalFormat: inF, format: fmt };
    }
    function supportRenderTextureFormat(inF: number, fmt: number, type: number) {
      const t = gl!.createTexture(); if (!t) return false;
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, inF, 4, 4, 0, fmt, type, null);
      const f = gl!.createFramebuffer(); if (!f) return false;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, f);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, t, 0);
      return gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
    }

    const formatRGBA = isWebGL2 ? getSupportedFormat(gl2.RGBA16F, gl2.RGBA) : getSupportedFormat(gl.RGBA, gl.RGBA);
    const formatRG   = isWebGL2 ? getSupportedFormat(gl2.RG16F,   gl2.RG)   : getSupportedFormat(gl.RGBA, gl.RGBA);
    const formatR    = isWebGL2 ? getSupportedFormat(gl2.R16F,    (gl2 as any).RED) : getSupportedFormat(gl.RGBA, gl.RGBA);
    if (!formatRGBA || !formatRG || !formatR) return;

    // ── Shader helpers ────────────────────────────────────────────────────────
    function compile(type: number, src: string, kws: string[] | null = null): WebGLShader | null {
      const s = gl!.createShader(type); if (!s) return null;
      gl!.shaderSource(s, (kws ? kws.map(k=>`#define ${k}\n`).join('') : '') + src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) console.warn(gl!.getShaderInfoLog(s));
      return s;
    }
    function createProgram(vs: WebGLShader|null, fs: WebGLShader|null): WebGLProgram|null {
      if (!vs||!fs) return null;
      const p = gl!.createProgram(); if (!p) return null;
      gl!.attachShader(p,vs); gl!.attachShader(p,fs); gl!.linkProgram(p);
      return p;
    }
    function getUniforms(p: WebGLProgram) {
      const u: Record<string,WebGLUniformLocation|null> = {};
      const n = gl!.getProgramParameter(p, gl!.ACTIVE_UNIFORMS);
      for (let i=0;i<n;i++) { const info=gl!.getActiveUniform(p,i); if(info) u[info.name]=gl!.getUniformLocation(p,info.name); }
      return u;
    }

    // ── Shaders ───────────────────────────────────────────────────────────────
    const baseVS = compile(gl.VERTEX_SHADER, `precision highp float;
      attribute vec2 aPosition; varying vec2 vUv,vL,vR,vT,vB; uniform vec2 texelSize;
      void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);
      vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}`);
    const copyFS  = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`);
    const clearFS = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
    const splatFS = compile(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.);}`);
    const advFS   = compile(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;vec4 bilerp(sampler2D sam,vec2 uv,vec2 ts){vec2 st=uv/ts-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(sam,(iuv+vec2(.5,.5))*ts);vec4 b=texture2D(sam,(iuv+vec2(1.5,.5))*ts);vec4 c=texture2D(sam,(iuv+vec2(.5,1.5))*ts);vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*ts);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){
      #ifdef MANUAL_FILTERING
      vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;vec4 result=bilerp(uSource,coord,dyeTexelSize);
      #else
      vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;vec4 result=texture2D(uSource,coord);
      #endif
      float decay=1.+dissipation*dt;gl_FragColor=result/decay;}`, supportLinearFiltering?null:['MANUAL_FILTERING']);
    const divFS   = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x,T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
    const curlFS  = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y,T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`);
    const vortFS  = compile(gl.FRAGMENT_SHADER,`precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x,T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+.0001;force*=curl*C;force.y*=-1.;vec2 vel=texture2D(uVelocity,vUv).xy;vel+=force*dt;vel=min(max(vel,-1000.),1000.);gl_FragColor=vec4(vel,0.,1.);}`);
    const pressFS = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;float div=texture2D(uDivergence,vUv).x;gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);}`);
    const gradFS  = compile(gl.FRAGMENT_SHADER,`precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x,T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;vec2 vel=texture2D(uVelocity,vUv).xy;vel.xy-=vec2(R-L,T-B);gl_FragColor=vec4(vel,0.,1.);}`);
    const dispSrc = `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;void main(){vec3 c=texture2D(uTexture,vUv).rgb;
      #ifdef SHADING
      vec3 lc=texture2D(uTexture,vL).rgb,rc=texture2D(uTexture,vR).rgb,tc=texture2D(uTexture,vT).rgb,bc=texture2D(uTexture,vB).rgb;
      float dx=length(rc)-length(lc),dy=length(tc)-length(bc);vec3 n=normalize(vec3(dx,dy,length(texelSize)));vec3 l=vec3(0.,0.,1.);float diff=clamp(dot(n,l)+.7,.7,1.);c*=diff;
      #endif
      float a=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c,a);}`;

    // ── Programs ──────────────────────────────────────────────────────────────
    const copyProg  = createProgram(baseVS, copyFS)!;
    const clearProg = createProgram(baseVS, clearFS)!;
    const splatProg = createProgram(baseVS, splatFS)!;
    const advProg   = createProgram(baseVS, advFS)!;
    const divProg   = createProgram(baseVS, divFS)!;
    const curlProg  = createProgram(baseVS, curlFS)!;
    const vortProg  = createProgram(baseVS, vortFS)!;
    const pressProg = createProgram(baseVS, pressFS)!;
    const gradProg  = createProgram(baseVS, gradFS)!;

    const dispKws  = config.SHADING ? ['SHADING'] : [];
    const dispFS   = compile(gl.FRAGMENT_SHADER, dispSrc, dispKws);
    const dispProg = createProgram(baseVS, dispFS);
    const dispUniforms = dispProg ? getUniforms(dispProg) : {};

    const u = (p: WebGLProgram, n: string) => gl!.getUniformLocation(p, n);

    // ── Geometry ──────────────────────────────────────────────────────────────
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    const ebuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO|null, doClear=false) => {
      if (!target) { gl!.viewport(0,0,gl!.drawingBufferWidth,gl!.drawingBufferHeight); gl!.bindFramebuffer(gl!.FRAMEBUFFER,null); }
      else { gl!.viewport(0,0,target.width,target.height); gl!.bindFramebuffer(gl!.FRAMEBUFFER,target.fbo); }
      if (doClear) { gl!.clearColor(0,0,0,1); gl!.clear(gl!.COLOR_BUFFER_BIT); }
      gl!.drawElements(gl!.TRIANGLES,6,gl!.UNSIGNED_SHORT,0);
    };

    function createFBO(w: number, h: number, inF: number, fmt: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D,tex);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MIN_FILTER,param);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_MAG_FILTER,param);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_S,gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D,gl!.TEXTURE_WRAP_T,gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D,0,inF,w,h,0,fmt,type,null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER,fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER,gl!.COLOR_ATTACHMENT0,gl!.TEXTURE_2D,tex,0);
      gl!.viewport(0,0,w,h); gl!.clear(gl!.COLOR_BUFFER_BIT);
      return { texture:tex, fbo, width:w, height:h, texelSizeX:1/w, texelSizeY:1/h,
               attach(id){ gl!.activeTexture(gl!.TEXTURE0+id); gl!.bindTexture(gl!.TEXTURE_2D,tex); return id; } };
    }
    function createDoubleFBO(w: number, h: number, inF: number, fmt: number, type: number, param: number): DoubleFBO {
      let r=createFBO(w,h,inF,fmt,type,param), wr=createFBO(w,h,inF,fmt,type,param);
      return { width:w, height:h, texelSizeX:r.texelSizeX, texelSizeY:r.texelSizeY, read:r, write:wr,
               swap(){ const t=this.read; this.read=this.write; this.write=t; } };
    }

    function getRes(res: number) {
      const w=gl!.drawingBufferWidth, h=gl!.drawingBufferHeight;
      const ar=w/h, asp=ar<1?1/ar:ar;
      const mn=Math.round(res), mx=Math.round(res*asp);
      return w>h ? {width:mx,height:mn} : {width:mn,height:mx};
    }

    let dye: DoubleFBO, velocity: DoubleFBO, divergence: FBO, curl_: FBO, pressure_: DoubleFBO;
    const tt = halfFloatTexType;
    const filt = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    function initFBOs() {
      const simRes=getRes(config.SIM_RESOLUTION), dyeRes=getRes(config.DYE_RESOLUTION);
      gl!.disable(gl!.BLEND);
      dye       = createDoubleFBO(dyeRes.width,  dyeRes.height,  formatRGBA!.internalFormat, formatRGBA!.format, tt, filt);
      velocity  = createDoubleFBO(simRes.width,  simRes.height,  formatRG!.internalFormat,   formatRG!.format,   tt, filt);
      divergence= createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl!.NEAREST);
      curl_     = createFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl!.NEAREST);
      pressure_ = createDoubleFBO(simRes.width, simRes.height, formatR!.internalFormat, formatR!.format, tt, gl!.NEAREST);
    }
    initFBOs();

    // ── Color ─────────────────────────────────────────────────────────────────
    // Multiplier 0.082 → visible atmospheric crimson smoke, balanced density
    function hexToRGB(hex: string): ColorRGB {
      let v = hex.replace('#','');
      if (v.length===3) v=v[0]+v[0]+v[1]+v[1]+v[2]+v[2];
      return { r:parseInt(v.slice(0,2),16)/255*0.082,
               g:parseInt(v.slice(2,4),16)/255*0.082,
               b:parseInt(v.slice(4,6),16)/255*0.082 };
    }
    function generateColor(): ColorRGB {
      return hexToRGB(config.COLOR);
    }

    function correctRadius(r: number){ const ar=canvas!.width/canvas!.height; if(ar>1) r*=ar; return r; }
    function correctDx(d: number){ const ar=canvas!.width/canvas!.height; if(ar<1) d*=ar; return d; }
    function correctDy(d: number){ const ar=canvas!.width/canvas!.height; if(ar>1) d/=ar; return d; }

    function splat(x: number, y: number, dx: number, dy: number, color: ColorRGB) {
      gl!.useProgram(splatProg);
      gl!.uniform1i(u(splatProg,'uTarget'), velocity.read.attach(0));
      gl!.uniform1f(u(splatProg,'aspectRatio')!, canvas!.width/canvas!.height);
      gl!.uniform2f(u(splatProg,'point')!, x, y);
      gl!.uniform3f(u(splatProg,'color')!, dx, dy, 0);
      gl!.uniform1f(u(splatProg,'radius')!, correctRadius(config.SPLAT_RADIUS/100));
      blit(velocity.write); velocity.swap();
      gl!.uniform1i(u(splatProg,'uTarget'), dye.read.attach(0));
      gl!.uniform3f(u(splatProg,'color')!, color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    function splatPointer(p: Pointer) {
      splat(p.texcoordX, p.texcoordY, p.deltaX*config.SPLAT_FORCE, p.deltaY*config.SPLAT_FORCE, p.color);
    }

    // ── Physics step ──────────────────────────────────────────────────────────
    function step(dt: number) {
      gl!.disable(gl!.BLEND);
      gl!.useProgram(curlProg);
      gl!.uniform2f(u(curlProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      gl!.uniform1i(u(curlProg,'uVelocity'),velocity.read.attach(0));
      blit(curl_);
      gl!.useProgram(vortProg);
      gl!.uniform2f(u(vortProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      gl!.uniform1i(u(vortProg,'uVelocity'),velocity.read.attach(0));
      gl!.uniform1i(u(vortProg,'uCurl'),curl_.attach(1));
      gl!.uniform1f(u(vortProg,'curl')!,config.CURL);
      gl!.uniform1f(u(vortProg,'dt')!,dt);
      blit(velocity.write); velocity.swap();
      gl!.useProgram(divProg);
      gl!.uniform2f(u(divProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      gl!.uniform1i(u(divProg,'uVelocity'),velocity.read.attach(0));
      blit(divergence);
      gl!.useProgram(clearProg);
      gl!.uniform1i(u(clearProg,'uTexture'),pressure_.read.attach(0));
      gl!.uniform1f(u(clearProg,'value')!,config.PRESSURE);
      blit(pressure_.write); pressure_.swap();
      gl!.useProgram(pressProg);
      gl!.uniform2f(u(pressProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      gl!.uniform1i(u(pressProg,'uDivergence'),divergence.attach(0));
      for(let i=0;i<config.PRESSURE_ITERATIONS;i++){
        gl!.uniform1i(u(pressProg,'uPressure'),pressure_.read.attach(1));
        blit(pressure_.write); pressure_.swap();
      }
      gl!.useProgram(gradProg);
      gl!.uniform2f(u(gradProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      gl!.uniform1i(u(gradProg,'uPressure'),pressure_.read.attach(0));
      gl!.uniform1i(u(gradProg,'uVelocity'),velocity.read.attach(1));
      blit(velocity.write); velocity.swap();
      gl!.useProgram(advProg);
      gl!.uniform2f(u(advProg,'texelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      if(!supportLinearFiltering) gl!.uniform2f(u(advProg,'dyeTexelSize')!,velocity.texelSizeX,velocity.texelSizeY);
      const vId=velocity.read.attach(0);
      gl!.uniform1i(u(advProg,'uVelocity'),vId);
      gl!.uniform1i(u(advProg,'uSource'),vId);
      gl!.uniform1f(u(advProg,'dt')!,dt);
      gl!.uniform1f(u(advProg,'dissipation')!,config.VELOCITY_DISSIPATION);
      blit(velocity.write); velocity.swap();
      if(!supportLinearFiltering) gl!.uniform2f(u(advProg,'dyeTexelSize')!,dye.texelSizeX,dye.texelSizeY);
      gl!.uniform1i(u(advProg,'uVelocity'),velocity.read.attach(0));
      gl!.uniform1i(u(advProg,'uSource'),dye.read.attach(1));
      gl!.uniform1f(u(advProg,'dissipation')!,config.DENSITY_DISSIPATION);
      blit(dye.write); dye.swap();
    }

    function render() {
      if (!dispProg) return;
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA); gl!.enable(gl!.BLEND);
      gl!.useProgram(dispProg);
      if (config.SHADING && dispUniforms.texelSize)
        gl!.uniform2f(dispUniforms.texelSize, 1/gl!.drawingBufferWidth, 1/gl!.drawingBufferHeight);
      if (dispUniforms.uTexture) gl!.uniform1i(dispUniforms.uTexture, dye.read.attach(0));
      blit(null, false);
    }

    // ── Smooth cursor + RAF loop ──────────────────────────────────────────────
    // mousemove ONLY stores raw position — all fluid logic is in the RAF loop
    let rawX = -1, rawY = -1;
    let smoothX = -1, smoothY = -1;
    let lastTime = Date.now(), colorTimer = 0;
    const dpr = () => Math.floor(window.devicePixelRatio || 1);

    function frame() {
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.016666);
      lastTime = now;

      // Resize
      const pw = Math.floor(canvas!.clientWidth  * (window.devicePixelRatio || 1));
      const ph = Math.floor(canvas!.clientHeight * (window.devicePixelRatio || 1));
      if (canvas!.width !== pw || canvas!.height !== ph) { canvas!.width = pw; canvas!.height = ph; initFBOs(); }

      // Color cycling
      colorTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorTimer >= 1) { colorTimer %= 1; pointers.forEach(p => { p.color = generateColor(); }); }

      // ── Smooth cursor lerp — runs every frame regardless of mousemove ──────
      if (rawX >= 0) {
        if (smoothX < 0) { smoothX = rawX; smoothY = rawY; }
        const p = pointers[0];
        p.prevTexcoordX = p.texcoordX;
        p.prevTexcoordY = p.texcoordY;
        // 0.08 lerp = responsive with slight physical inertia
        smoothX += (rawX - smoothX) * 0.14;
        smoothY += (rawY - smoothY) * 0.14;
        p.texcoordX = (smoothX * dpr()) / canvas!.width;
        p.texcoordY = 1 - (smoothY * dpr()) / canvas!.height;
        p.deltaX = correctDx(p.texcoordX - p.prevTexcoordX);
        p.deltaY = correctDy(p.texcoordY - p.prevTexcoordY);
        // Only inject if cursor actually moved — no static cloud when idle
        p.moved = Math.abs(p.deltaX) > 0.0001 || Math.abs(p.deltaY) > 0.0001;
      }

      // deltaX/deltaY magnitude naturally scales force:
      //   slow cursor → small lerp delta → soft injection
      //   fast cursor → larger delta    → stronger trail (capped by lerp max)
      pointers.forEach(p => { if (p.moved) { p.moved = false; splatPointer(p); } });
      step(dt);
      render();
      requestAnimationFrame(frame);
    }

    // ── Event listeners ───────────────────────────────────────────────────────
    const onFirstMove = (e: MouseEvent) => {
      rawX = e.clientX; rawY = e.clientY;
      smoothX = rawX; smoothY = rawY;
      const p = pointers[0];
      p.texcoordX = (rawX * dpr()) / canvas!.width;
      p.texcoordY = 1 - (rawY * dpr()) / canvas!.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY;
      p.color = generateColor();
      requestAnimationFrame(frame);
      window.removeEventListener('mousemove', onFirstMove);
    };
    window.addEventListener('mousemove', onFirstMove);
    window.addEventListener('mousemove', (e: MouseEvent) => { rawX = e.clientX; rawY = e.clientY; });

    // Click: gentle soft pulse — not an explosion
    window.addEventListener('mousedown', (e: MouseEvent) => {
      const p = pointers[0]; p.color = generateColor();
      const c = { ...p.color }; c.r *= 3; c.g *= 3; c.b *= 3;
      splat((e.clientX * dpr()) / canvas!.width, 1 - (e.clientY * dpr()) / canvas!.height,
            3 * (Math.random() - 0.5), 3 * (Math.random() - 0.5), c);
    });
    // ── Cursor dot + ring ─────────────────────────────────────────────────────
    const dot  = dotRef.current;
    const ring = ringRef.current;
    let rx = -100, ry = -100; // lerped ring

    const onMouseMoveDot = (e: MouseEvent) => {
      if (dot)  dot.style.transform  = `translate(${e.clientX}px, ${e.clientY}px)`;
      rawX = e.clientX; rawY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMoveDot, { passive: true });

    // Ring lerp loop (separate from fluid RAF)
    let ringRaf: number;
    const lerpRing = () => {
      rx += (rawX - rx) * 0.12;
      ry += (rawY - ry) * 0.12;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      ringRaf = requestAnimationFrame(lerpRing);
    };
    lerpRing();

    // Click flash on dot
    const onDown = () => { if (dot) { dot.style.transform = dot.style.transform.replace('scale(1)','') + ' scale(2.5)'; dot.style.opacity='1'; } };
    const onUp   = () => { if (dot) { dot.style.transform = dot.style.transform.replace(' scale(2.5)',''); dot.style.opacity='0.85'; } };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);

    // Expand ring on interactive elements
    const expand = () => { if(ring){ ring.style.width='34px'; ring.style.height='34px'; ring.style.marginLeft='-17px'; ring.style.marginTop='-17px'; } };
    const shrink = () => { if(ring){ ring.style.width='20px'; ring.style.height='20px'; ring.style.marginLeft='-10px'; ring.style.marginTop='-10px'; } };
    const els = document.querySelectorAll<HTMLElement>('a,button,[role="button"],input,textarea');
    els.forEach(el => { el.addEventListener('mouseenter', expand); el.addEventListener('mouseleave', shrink); });

    return () => {
      cancelAnimationFrame(ringRaf);
      window.removeEventListener('mousemove', onMouseMoveDot);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      els.forEach(el => { el.removeEventListener('mouseenter', expand); el.removeEventListener('mouseleave', shrink); });
    };
  }, []);

  return (
    <>
      {/* Fluid canvas — behind text */}
      <div style={{ position:'fixed', inset:0, zIndex:7, pointerEvents:'none', mixBlendMode:'screen' }}>
        <canvas ref={canvasRef} id="fluid" style={{ width:'100vw', height:'100vh', display:'block' }} />
      </div>

      {/* Cursor ring — lerped, slightly behind */}
      <div ref={ringRef} aria-hidden="true" style={{
        position:'fixed', top:0, left:0, zIndex:99999, pointerEvents:'none',
        width:'20px', height:'20px', marginLeft:'-10px', marginTop:'-10px',
        borderRadius:'50%', border:'1px solid rgba(255,255,255,0.55)',
        willChange:'transform',
        mixBlendMode:'difference',
        transition:'width .18s ease, height .18s ease, margin .18s ease',
      }} />

      {/* Cursor dot — exact raw position, no lag */}
      <div ref={dotRef} aria-hidden="true" style={{
        position:'fixed', top:0, left:0, zIndex:99999, pointerEvents:'none',
        width:'5px', height:'5px', marginLeft:'-2.5px', marginTop:'-2.5px',
        borderRadius:'50%', background:'#c8102e',
        opacity:0.85, willChange:'transform',
        transition:'opacity .1s, transform .08s ease',
      }} />

      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
