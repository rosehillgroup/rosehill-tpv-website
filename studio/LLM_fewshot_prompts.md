# TPV Studio — LLM Planner Few-shot Prompts
Model: Llama 3.1 70B Instruct (JSON mode)
Return: Strict JSON matching LayoutSpec schema. No extra fields. No prose.

## System message (concise)
You are a senior playground surface designer. Convert the brief into LayoutSpec JSON using grammars and motifs that express the mood. Limit to 3 colours unless requested. Use TPV codes. Use realistic parameters. Always include seeds.

## Example 1
User:
Surface 5x5 m. Theme "ocean energy". Calm, flowing, playful. Colours auto. Add fish.

Assistant (JSON only):
{
  "meta":{"title":"Ocean Energy","theme":"ocean","mood":["calm","flowing","playful"]},
  "surface":{"width_m":5,"height_m":5,"border_mm":100},
  "seeds":{"global":41721,"placement":9182,"colour":1123},
  "palette":[
    {"code":"TPV08","role":"base","target_ratio":0.55},
    {"code":"TPV11","role":"accent","target_ratio":0.30},
    {"code":"TPV21","role":"highlight","target_ratio":0.15}
  ],
  "grammar":[
    {"name":"Bands","weight":0.6,"params":{"bands":3,"amplitude_m":[0.3,0.8],"smoothness":0.8}},
    {"name":"Clusters","weight":0.4,"params":{"count":3,"spread":0.6}}
  ],
  "motifs":[
    {"id":"marine/fish-simple","count":6,"size_m":[0.5,0.9],"rotation":"follow_flow","layer":"accent"},
    {"id":"marine/starfish","count":3,"size_m":[0.4,0.6],"layer":"highlight"}
  ],
  "rules":{"min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,"max_colours":3,"max_pieces_per_colour":25,"no_acute_angles":true}
}

## Example 2
User:
Surface 8x4 m. Theme "jungle play". Energetic, lively. Use 3 specific colours: TPV05, TPV14, TPV18.

Assistant:
{
  "meta":{"title":"Jungle Play","theme":"jungle","mood":["energetic","lively"]},
  "surface":{"width_m":8,"height_m":4,"border_mm":100},
  "seeds":{"global":90211,"placement":1234,"colour":3456},
  "palette":[
    {"code":"TPV05","role":"base","target_ratio":0.5},
    {"code":"TPV14","role":"accent","target_ratio":0.35},
    {"code":"TPV18","role":"highlight","target_ratio":0.15}
  ],
  "grammar":[
    {"name":"Bands","weight":0.5,"params":{"bands":4,"amplitude_m":[0.2,0.6],"smoothness":0.7}},
    {"name":"Islands","weight":0.5,"params":{"count":5,"size_m":[0.6,1.2],"roundness":0.8}}
  ],
  "motifs":[
    {"id":"nature/leaf-simple","count":6,"size_m":[0.5,0.8],"rotation":"free","layer":"accent"},
    {"id":"geo/star-5-rounded","count":3,"size_m":[0.4,0.6],"rotation":"free","layer":"highlight"}
  ],
  "rules":{"min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,"max_colours":3,"max_pieces_per_colour":25,"no_acute_angles":true}
}

## Example 3
User:
Surface 10x6 m. Theme "numbers and letters". Calm, educational. Allow 4 colours.

Assistant:
{
  "meta":{"title":"Learning Zone","theme":"education","mood":["calm","structured"]},
  "surface":{"width_m":10,"height_m":6,"border_mm":100},
  "seeds":{"global":55121,"placement":4321,"colour":7766},
  "palette":[
    {"code":"TPV02","role":"base","target_ratio":0.55},
    {"code":"TPV10","role":"accent","target_ratio":0.25},
    {"code":"TPV15","role":"highlight","target_ratio":0.15},
    {"code":"TPV21","role":"highlight","target_ratio":0.05}
  ],
  "grammar":[
    {"name":"Symmetry","weight":0.4,"params":{"axis":"y","offset":0}},
    {"name":"Islands","weight":0.6,"params":{"count":8,"size_m":[0.6,1.0],"roundness":0.7}}
  ],
  "motifs":[
    {"id":"play/hopscotch-10","count":1,"size_m":[2.0,3.0],"rotation":"free","layer":"accent"},
    {"id":"play/number-giant-1","count":3,"size_m":[0.8,1.2],"rotation":"free","layer":"highlight"},
    {"id":"play/letter-giant-a","count":2,"size_m":[0.8,1.2],"rotation":"free","layer":"highlight"}
  ],
  "rules":{"min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,"max_colours":4,"max_pieces_per_colour":25,"no_acute_angles":true}
}

## Example 4
User:
Surface 6x6 m. Theme "space discovery". Wonder, contrast. Colours auto.

Assistant:
{
  "meta":{"title":"Space Discovery","theme":"space","mood":["wonder","contrast"]},
  "surface":{"width_m":6,"height_m":6,"border_mm":100},
  "seeds":{"global":33009,"placement":88,"colour":990},
  "palette":[
    {"code":"TPV01","role":"base","target_ratio":0.6},
    {"code":"TPV15","role":"accent","target_ratio":0.25},
    {"code":"TPV18","role":"highlight","target_ratio":0.15}
  ],
  "grammar":[
    {"name":"Rays","weight":0.4,"params":{"spokes":10,"sweep_deg":300,"jitter":0.15}},
    {"name":"Clusters","weight":0.6,"params":{"count":4,"spread":0.5,"island_size_m":[0.5,1.0]}}
  ],
  "motifs":[
    {"id":"geo/star-5-rounded","count":5,"size_m":[0.4,0.8],"rotation":"free","layer":"highlight"}
  ],
  "rules":{"min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,"max_colours":3,"max_pieces_per_colour":25,"no_acute_angles":true}
}

## Example 5
User:
Surface 12x4 m. Theme "calm sensory path". Low contrast, gentle.

Assistant:
{
  "meta":{"title":"Sensory Path","theme":"sensory","mood":["calm","gentle"]},
  "surface":{"width_m":12,"height_m":4,"border_mm":100},
  "seeds":{"global":71234,"placement":555,"colour":999},
  "palette":[
    {"code":"TPV11","role":"base","target_ratio":0.65},
    {"code":"TPV08","role":"accent","target_ratio":0.25},
    {"code":"TPV21","role":"highlight","target_ratio":0.10}
  ],
  "grammar":[
    {"name":"Bands","weight":0.7,"params":{"bands":3,"amplitude_m":[0.2,0.5],"smoothness":0.9}},
    {"name":"Islands","weight":0.3,"params":{"count":4,"size_m":[0.6,1.1],"roundness":0.9}}
  ],
  "motifs":[],
  "rules":{"min_feature_mm":120,"min_radius_mm":600,"min_gap_mm":80,"min_island_area_m2":0.3,"max_colours":3,"max_pieces_per_colour":25,"no_acute_angles":true}
}

## Notes
- If a requested motif is missing, use {"id":"__generate__","tags":[...]}.
- Do not exceed 3 colours unless explicitly allowed.
- Always include seeds.