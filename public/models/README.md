# Assistant model asset

Place the user-provided GLB at:

```text
public/models/ai-assistant.glb
```

The assistant loader requests it as `/models/ai-assistant.glb` by default. Set `NEXT_PUBLIC_AI_ASSISTANT_MODEL_PATH` only if the public path changes.

If the GLB is absent or fails to load, the Three.js component renders the built-in procedural assistant character instead of leaving the canvas blank.
