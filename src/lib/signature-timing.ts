/**
 * One playback clock for both the live preview and GIF export.
 * In the reference recording, the logo and angular portrait assemble, remain
 * complete for several seconds, then dismantle before restarting.
 * A complete first GIF frame is added separately as an Outlook fallback.
 */
export const SIGNATURE_TIMING={
 introMs:150,
 forwardMs:1870,
 holdMs:5750,
 reverseMs:1080,
 emptyMs:420
} as const;

export const SIGNATURE_LOOP_MS=
 SIGNATURE_TIMING.introMs+SIGNATURE_TIMING.forwardMs+SIGNATURE_TIMING.holdMs+
 SIGNATURE_TIMING.reverseMs+SIGNATURE_TIMING.emptyMs;

export function signatureProgressAt(elapsedMs:number,loop:boolean):number {
 const {introMs,forwardMs,holdMs,reverseMs}=SIGNATURE_TIMING;
 const total=SIGNATURE_LOOP_MS;
 const elapsed=loop?((Math.max(0,elapsedMs)%total)+total)%total:Math.max(0,elapsedMs);
 if(elapsed<=introMs)return 0;
 if(elapsed<introMs+forwardMs)return (elapsed-introMs)/forwardMs;
 if(elapsed<introMs+forwardMs+holdMs)return 1;
 if(!loop)return 1;
 if(elapsed<introMs+forwardMs+holdMs+reverseMs)
  return 1-(elapsed-introMs-forwardMs-holdMs)/reverseMs;
 return 0;
}

export type SignatureFrameStage={p:number;delay:number};
export function signatureGifStages(loop:boolean):SignatureFrameStage[] {
 const {introMs,forwardMs,holdMs,reverseMs,emptyMs}=SIGNATURE_TIMING;
 const fwd=18,back=9;
 const steps:SignatureFrameStage[]=[
  // Full fallback: non-animated versions of Outlook show a complete card.
  {p:1,delay:60},
  {p:0,delay:introMs},
  ...Array.from({length:fwd},(_,i)=>({p:(i+1)/fwd,delay:Math.round(forwardMs/fwd)})),
  {p:1,delay:holdMs}
 ];
 if(loop){
  for(let i=1;i<=back;i++)steps.push({p:1-i/back,delay:Math.round(reverseMs/back)});
  steps.push({p:0,delay:emptyMs});
 }
 return steps;
}
