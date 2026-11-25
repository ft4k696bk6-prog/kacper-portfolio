type Sound = "horn" | "find" | "warp" | "rumble" | "ufo";
export function createWorldSound() {
  let context: AudioContext | undefined;
  let master: GainNode | undefined;
  let engine: OscillatorNode | undefined;
  let engineGain: GainNode | undefined;
  let active = false;
  function setEnabled(value: boolean) {
    active = value;
    if (!value) {
      if (master && context) master.gain.setTargetAtTime(0, context.currentTime, .05);
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
      filter.frequency.value = 170;
      engine = context.createOscillator();
      engine.type = "sawtooth";
      engine.frequency.value = 44;
      engineGain = context.createGain();
      engineGain.gain.value = 0;
      engine.connect(filter).connect(engineGain).connect(master);
      engine.start();
    }
    void context.resume().catch(() => {});
    master!.gain.setTargetAtTime(.32, context.currentTime, .09);
  }
  function tick(speed: number, driving: boolean) {
    if (!active || !engine || !engineGain || !context) return;
    const time = context.currentTime;
    engine.frequency.setTargetAtTime(39 + Math.abs(speed) * 7.4, time, .06);
    engineGain.gain.setTargetAtTime(driving ? .045 + Math.abs(speed) * .007 : 0, time, .10);
  }
  function play(sound: Sound) {
    if (!active || !context || !master || context.state !== "running") return;
    const time = context.currentTime;
    const specs: Record<Sound, [OscillatorType, number, number, number]> = {
      horn: ["triangle", 222, 195, .27],
      find: ["sine", 523, 784, .35],
      warp: ["triangle", 135, 765, .85],
      rumble: ["sawtooth", 54, 28, 1.6],
      ufo: ["sine", 610, 190, .74],
    };
    const [shape, first, last, duration] = specs[sound];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = shape;
    oscillator.frequency.setValueAtTime(first, time);
    oscillator.frequency.exponentialRampToValueAtTime(last, time + duration * .80);
    gain.gain.setValueAtTime(.001, time);
    gain.gain.exponentialRampToValueAtTime(sound === "rumble" ? .09 : .28, time + .035);
    gain.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(time);
    oscillator.stop(time + duration);
  }
  return { setEnabled, tick, play, dispose() { if (context) void context.close().catch(() => {}); } };
}
