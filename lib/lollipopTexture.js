import * as THREE from "three";

/*
 * ── THE TEXTURING SWAP POINT ─────────────────────────────────────────
 * Everything painted onto the lollipop's surfaces lives in this module,
 * deliberately separated from the geometry in LollipopScene.jsx.
 *
 * The geometry is a fixed 3D replica of the logo file and should not
 * change. The texturing WILL evolve — when a baked swirl map, painted
 * texture, or scanned asset lands, replace createSwirlTexture() with a
 * TextureLoader load (same return type: THREE.Texture) and nothing else
 * in the scene needs to move. Material parameters stay in the scene;
 * pixels stay here.
 * ─────────────────────────────────────────────────────────────────────
 */

// Logo hexes, exact.
const RED = [0xfc, 0x24, 0x18];
const BURNT = [0xfc, 0x78, 0x18];
const GOLD = [0xfc, 0xa8, 0x18];
const PINK = [0xfc, 0x54, 0x84];
const DARK = [0xc0, 0x14, 0x00]; // the thin swirl outline in the logo

/*
 * Single-arm Archimedean spiral, matching the logo's swirl: one wide
 * red band and one gold-orange band winding to a curl at the centre,
 * separated by thin dark-red lines, with the coral-pink band riding the
 * outer windings the way it does in the logo file.
 *
 * Drawn in the sphere's UV space assuming the north pole faces the
 * camera: u is the angle around the pole, (1 - v) the distance from it,
 * so face-on the pattern reads as the logo's flat spiral while still
 * wrapping believably over the 3D edge.
 */
export function createSwirlTexture({ coils = 3, size = 1024 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(size, size);

  // One spiral period: red | line | gold | line | burnt | line
  const bandAt = (t, outer) => {
    t = ((t % 1) + 1) % 1;
    if (t < 0.4) return RED;
    if (t < 0.43) return DARK;
    if (t < 0.68) return outer ? PINK : GOLD; // pink rides the outer windings
    if (t < 0.71) return DARK;
    if (t < 0.97) return BURNT;
    return DARK;
  };

  for (let y = 0; y < size; y++) {
    const v = y / size;
    const s = 1 - v; // 0 at the front pole, 1 at the back
    const outer = s > 0.26 && s < 0.58; // outer windings of the visible face
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const [r, g, b] = bandAt(u + coils * s * 2, outer);
      const i = (y * size + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/*
 * Striped gobo for the key light — the diagonal "window blinds" shafts
 * from the deck's hero photography. Lighting texture, not surface
 * texture, but it lives here with the rest of the painted pixels.
 */
export function createBlindsTexture({ size = 512 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.42);
  const stripe = 46;
  ctx.fillStyle = "#fff";
  for (let y = -size; y < size; y += stripe * 2) {
    ctx.fillRect(-size, y, size * 2, stripe * 1.15);
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
