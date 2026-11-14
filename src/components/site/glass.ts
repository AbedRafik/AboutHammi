/**
 * Pointer-tracked specular for glass surfaces. Writes the cursor position
 * into --spot-x / --spot-y on the element, and the .lg::before layer in
 * globals.css renders a soft internal illumination there, the way Liquid
 * Glass lights up from the point of contact. Reduced-motion and touch
 * users simply never see the glow, nothing depends on it.
 */
export function trackGlassPointer(event: React.MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

/**
 * 3D tilt for cards: the panel rotates toward the pointer around X and Y
 * (max ~5deg, perspective 900px) while the spotlight follows, so every
 * card answers the cursor like a physical glass slab held in the hand.
 * The tilt carries a magnetic pull: the panel also drifts a few pixels
 * toward the pointer, which makes large cards feel weightless.
 *
 * The transform is written inline (never as a class): entrance animations
 * use backwards fill, so once they finish nothing holds `transform` and
 * the inline tilt takes over cleanly. The `.tilt` class eases it with a
 * short transition for a floating feel. On leave the element settles
 * back to flat with a softer, longer ease (the "release" half of the
 * gesture), so the card glides home instead of snapping.
 */
export function tiltGlass(event: React.MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    trackGlassPointer(event);
    return;
  }
  const rect = el.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  const max = 5;
  const rx = Math.max(-max, Math.min(max, -py * max * 1.6));
  const ry = Math.max(-max, Math.min(max, px * max * 1.6));
  /* The magnetic drift: up to ~7px toward the pointer. */
  const mx = Math.max(-7, Math.min(7, px * 14));
  const my = Math.max(-7, Math.min(7, py * 14));
  /* Inline transition replaces the class-level one, so it must carry
     the tilt, the hover fog halo's box-shadow, AND the .lift hover
     translate - otherwise the lift snaps while the halo eases. */
  el.style.transition =
    "transform 0.16s var(--ease-out), translate 0.35s var(--ease-spring), box-shadow 0.45s var(--ease-out)";
  el.style.transform = `perspective(900px) translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

/** Settles a tilted card back to flat with a slow, springy release. */
export function untiltGlass(event: React.MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.transition =
    "transform 0.5s var(--ease-spring), translate 0.35s var(--ease-spring), box-shadow 0.45s var(--ease-out)";
  el.style.transform = "";
}

/**
 * Magnetic pull for smaller controls (CTA pills, social tiles): the
 * element leans toward the pointer while it hovers, then springs home
 * on leave. Optional extra arguments let a caller fold its own hover
 * transform (a scale, say) into the same string, so nothing fights for
 * `transform`. Pointer devices only in practice: touch never fires
 * mousemove-hover, and reduced-motion visitors never see a thing.
 */
export function magnetPull(
  event: React.MouseEvent<HTMLElement>,
  strength = 10,
  extra = "",
) {
  const el = event.currentTarget;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    trackGlassPointer(event);
    return;
  }
  const rect = el.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  const mx = Math.max(-strength, Math.min(strength, px * strength * 2));
  const my = Math.max(-strength * 0.8, Math.min(strength * 0.8, py * strength * 1.6));
  el.style.transition = "transform 0.18s var(--ease-out)";
  el.style.transform = `translate3d(${mx.toFixed(1)}px, ${my.toFixed(1)}px, 0)${extra}`;
  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

/** Releases a magnetized control back to its natural place. */
export function magnetRelease(event: React.MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.transition = "transform 0.55s var(--ease-spring)";
  el.style.transform = "";
}
