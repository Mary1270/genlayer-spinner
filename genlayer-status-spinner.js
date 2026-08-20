/**
 * GenLayer Transaction Status Spinner
 * ------------------------------------
 * A GenLayer-native loading spinner whose visual state is driven by the
 * REAL consensus status of an Intelligent Contract transaction, using the
 * official genlayer-js SDK. This is not decorative-only: the ring's motion
 * and color directly reflect what the GenLayer network is doing.
 *
 * States:
 *   PENDING / ACCEPTED -> ring spins (validators are still reaching consensus)
 *   FINALIZED           -> ring stops, turns Success green (#00FF66)
 *   UNDETERMINED         -> ring stops, turns Error red (#FF2B2B)
 *
 * Usage:
 *   import { createClient } from "genlayer-js";
 *   import { testnet } from "genlayer-js/chains";
 *   import { attachGenLayerStatusSpinner } from "./genlayer-status-spinner.js";
 *
 *   const client = createClient({ chain: testnet });
 *   attachGenLayerStatusSpinner(document.getElementById("status"), {
 *     client,
 *     hash: txHash,
 *   });
 */

import { TransactionStatus } from "genlayer-js/types";

const COLORS = {
  blue: "#110FFF",
  green: "#00FF66",
  red: "#FF2B2B",
};

const SPINNER_MARKUP = `
<svg viewBox="0 0 44 44" width="28" height="28" role="img" aria-label="Transaction status">
  <style>
    .gl-ring { transform-origin: 22px 22px; }
    .gl-ring.spinning { animation: gl-spin 1.15s linear infinite; }
    @keyframes gl-spin { to { transform: rotate(360deg); } }
  </style>
  <g class="gl-ring" data-role="ring">
    <path d="M22 6 A16 16 0 0 1 36.14 14" fill="none" stroke="${COLORS.blue}"
          stroke-width="4.2" stroke-linecap="round" opacity="1" data-role="arc1" />
    <path d="M38.5 20 A16 16 0 0 1 33 34.7" fill="none" stroke="${COLORS.blue}"
          stroke-width="4.2" stroke-linecap="round" opacity="0.5" data-role="arc2" />
    <path d="M28.6 37.6 A16 16 0 0 1 9.4 30.6" fill="none" stroke="${COLORS.blue}"
          stroke-width="4.2" stroke-linecap="round" opacity="0.22" data-role="arc3" />
  </g>
  <circle cx="22" cy="6" r="3.1" fill="${COLORS.green}" data-role="node" />
</svg>`;

/**
 * Mounts a live GenLayer transaction-status spinner into `container`.
 *
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {import("genlayer-js").GenLayerClient} options.client - a genlayer-js client
 * @param {string} options.hash - the transaction hash to track
 * @param {number} [options.pollIntervalMs=3000]
 * @returns {{ stop: () => void }}
 */
export function attachGenLayerStatusSpinner(container, { client, hash, pollIntervalMs = 3000 }) {
  container.innerHTML = SPINNER_MARKUP;

  const ring = container.querySelector('[data-role="ring"]');
  const node = container.querySelector('[data-role="node"]');
  const arcs = [1, 2, 3].map((i) => container.querySelector(`[data-role="arc${i}"]`));

  let stopped = false;
  ring.classList.add("spinning");

  function setState(state) {
    if (state === "finalized") {
      ring.classList.remove("spinning");
      arcs.forEach((a) => a.setAttribute("stroke", COLORS.green));
      node.setAttribute("fill", COLORS.green);
    } else if (state === "undetermined") {
      ring.classList.remove("spinning");
      arcs.forEach((a) => a.setAttribute("stroke", COLORS.red));
      node.setAttribute("fill", COLORS.red);
    } else {
      ring.classList.add("spinning");
    }
  }

  async function poll() {
    if (stopped) return;
    try {
      const tx = await client.getTransaction({ hash });
      const status = tx?.status;

      if (status === TransactionStatus.FINALIZED) {
        setState("finalized");
        return; // reached a final state, stop polling
      }
      if (status === TransactionStatus.UNDETERMINED) {
        setState("undetermined");
        return;
      }

      // PENDING, ACCEPTED, or anything still in-flight: keep spinning
      setState("pending");
      setTimeout(poll, pollIntervalMs);
    } catch (err) {
      // Network hiccup or tx not yet indexed — retry rather than error out
      setTimeout(poll, pollIntervalMs);
    }
  }

  poll();

  return {
    stop() {
      stopped = true;
    },
  };
}
