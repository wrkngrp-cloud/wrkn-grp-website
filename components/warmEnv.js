import * as THREE from "three";

/*
 * A tiny hand-painted equirect environment, run through PMREM:
 * true black with a few horizontal ember streaks and a warm floor
 * pool, so glossy materials pick up highlights that read as streaks
 * of studio light rather than a daylight HDRI. Shared by the
 * lollipop (Home hero) and the control room (Studio band).
 */
export function makeWarmEnv(gl) {
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, w, h);

  // warm pool rising from the floor
  const floor = ctx.createLinearGradient(0, h * 0.6, 0, h);
  floor.addColorStop(0, "rgba(84, 28, 0, 0)");
  floor.addColorStop(1, "rgba(84, 28, 0, 0.5)");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 0, w, h);

  // a horizontal ember streak: soft vertical falloff, hard warm core
  const streak = (x0, x1, y, sh, core, alpha) => {
    const g = ctx.createLinearGradient(0, y - sh, 0, y + sh);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.5, core);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.fillRect(x0, y - sh, x1 - x0, sh * 2);
    ctx.globalAlpha = 1;
  };

  streak(w * 0.1, w * 0.62, h * 0.3, 10, "#FCA818", 0.95); // key streak, gold
  streak(w * 0.2, w * 0.55, h * 0.42, 6, "#FC7818", 0.7); // burnt echo
  streak(w * 0.58, w * 0.96, h * 0.34, 5, "#A8460E", 0.8); // ember, far side
  streak(w * 0.66, w * 0.9, h * 0.26, 3, "#FC2418", 0.35); // the one hot note

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(gl);
  const rt = pmrem.fromEquirectangular(tex);
  pmrem.dispose();
  tex.dispose();
  return rt;
}
