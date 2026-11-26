import type { Body } from "./discoveries";

type Sound = "horn" | "find" | "warp" | "rumble" | "ufo" | "launch";
const specs: Record<Sound, [OscillatorType, number, number, number]> = {
  horn: ["triangle", 222, 195, .27], find: ["sine", 523, 784, .35],
  warp: ["triangle", 135, 765, .85], rumble: ["sawtooth", 54, 28, 1.6],
  ufo: ["sine", 610, 190, .74], launch: ["sawtooth", 62, 160, .95],
};
const ambient: Partial<Record<Body, number>> = { home: 98, starcars: 61, motomizer: 48, "b-crm": 110, ai: 155, reenergy: 123, "isto-kebab": 141, moon: 70, signal: 57 };
export function createWorldSound() {
  let context: AudioContext | undefined, master: GainNode | undefined;
  let drone: OscillatorNode | undefined, droneGain: GainNode | undefined;
  let active = false;
  let body: Body | null = "home";
  let style = 0, nextBeat = 0, counter = 0;
  function setEnabled(next: boolean) {
    active = next;
    if (!next) {
      if (master && context) master.gain.setTargetAtTime(0, context.currentTime, .045);
      return;
    }
    if (!window.AudioContext) return;
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
      const filter = context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 155;
      drone = context.createOscillator();
      drone.type = "triangle";
      droneGain = context.createGain();
      droneGain.gain.value = 0;
      drone.connect(filter).connect(droneGain).connect(master);
      drone.start();
    }
    void context.resume().catch(() => {});
    master!.gain.setTargetAtTime(.29, context.currentTime, .09);
  }
  function note(shape: OscillatorType, first: number, last: number, duration: number, volume: number) {
    if (!active || !context || !master || context.state !== "running") return;
    const time = context.currentTime;
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.type = shape;
    oscillator.frequency.setValueAtTime(first, time);
    oscillator.frequency.exponentialRampToValueAtTime(last, time + duration * .90);
    gain.gain.setValueAtTime(.001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + .022);
    gain.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(time);
    oscillator.stop(time + duration);
  }
  function tick(worldTime: number) {
    if (!active || !context || !drone || !droneGain) return;
    const time = context.currentTime;
    const pitch = body && ambient[body];
    drone.frequency.setTargetAtTime((pitch || 45) + Math.sin(worldTime * .82) * 3.9, time, .16);
    droneGain.gain.setTargetAtTime(pitch ? .027 + Math.sin(worldTime * 2.3) * .009 : 0, time, .14);
    if (body !== "beatmarket" || time < nextBeat) return;
    counter++;
    nextBeat = time + [.365, .31, .43][style];
    const melody = [98, 117, 147, 130][(counter + style) % 4];
    note(counter % 2 ? "sine" : "triangle", counter % 2 ? 102 : melody, counter % 2 ? 36 : melody * .995, .22, .16);
  }
  return {
    setEnabled, tick,
    setScene(destination: Body | null) { body = destination; nextBeat = 0; counter = 0; },
    beat(value: number) { style = value; },
    play(sound: Sound) { note(...specs[sound], sound === "rumble" ? .09 : .25); },
    dispose() { if (context) void context.close().catch(() => {}); },
  };
}
