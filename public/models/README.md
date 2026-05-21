# Assistant model asset

Place the user-provided GLB at:

```text
public/models/ai-assistant.glb
```

The assistant loader requests it as `/models/ai-assistant.glb` by default. Set `NEXT_PUBLIC_AI_ASSISTANT_MODEL_PATH` only if the public path changes.

This GLB references extracted texture assets in the same folder:

```text
public/models/ai-assistant-basecolor.jpg
public/models/ai-assistant-normal.jpg
public/models/ai-assistant-roughness-metallic.jpg
```

If the GLB is absent or fails to load, the component renders a neutral `AI` fallback instead of showing the old robot placeholder.
