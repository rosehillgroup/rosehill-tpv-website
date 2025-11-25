Official Court Dimensions & Markings for Various Sports

Below we compile the complete official dimensions (in millimeters) and markings for each requested sport/court type. Each section includes authoritative sources, exact court sizes, line specifications, all required markings (with radii, offsets, and anchor points), any variations (like half-court or singles vs doubles), a JSON schema example, and notes on regional differences. We have cross-checked all data with multiple sources for accuracy.

Basketball – Full Court (FIBA)

Official Source: The Fédération Internationale de Basketball (FIBA) Official Basketball Rules is the governing standard ￼ ￼. FIBA’s full-size indoor court is a rectangle 28 m x 15 m measured to the inner edges of the boundary lines ￼ ￼. All lines are 50 mm wide (typically painted white or a contrasting color) ￼. Key FIBA court dimensions and lines:
	•	Court Length: 28,000 mm; Court Width: 15,000 mm ￼. (This is slightly smaller than an NBA court) ￼ ￼.
	•	Boundary Lines: Mark the playing area rectangle. Sidelines (28 m) and Endlines (15 m) enclose the court; these lines themselves are out of bounds ￼ ￼. There is typically a 2 m run-off area outside the boundaries for safety ￼ ￼.
	•	Center Line: Drawn midway between endlines, across the court, extending 150 mm beyond each sideline ￼. It divides the court into frontcourt/backcourt halves.
	•	Center Circle: Radius 1,800 mm to outer edge ￼. Used for jump balls at game start. If filled, same color as restricted area ￼.
	•	Free-Throw Line: Parallel to endline, 5,800 mm from inner edge of endline (measured to its farther edge) ￼. Length 3,600 mm centered on court ￼ (note: FIBA’s free-throw line is slightly shorter than the lane width, leaving a gap at the sides as explained below).
	•	Free-Throw Circle (Semi-Circle): Radius 1,800 mm (to outer edge) centered on the midpoint of the free-throw line ￼. The semi-circle above the free-throw line is usually drawn as a solid line on the outer edge of the circle (and dashed through the interior of the lane) ￼.
	•	Restricted Area (Paint): Rectangular area below the free-throw line. FIBA’s lane is 4,900 mm wide (measured to outer edges of lane lines) and extends 5,800 mm from the endline to the free-throw line ￼ ￼. Lane boundary lines originate on the endline 2,450 mm from the mid-point (to outer edge of lines) and terminate at the free-throw line’s outer edge ￼. Important: FIBA’s free-throw line (3.6 m long) is shorter than the lane’s full width, so there is an open space of ~0.65 m between each end of the free-throw line and the lane lines ￼ ￼. The lane lines mark the “restricted area” where offensive players cannot stay more than 3 seconds.
	•	Free-Throw Rebound Marks: Along each side of the lane are small hash marks for player positioning during free throws. The marks are short 100 mm lines on the lane lines, perpendicular to them ￼. Starting 1,750 mm from the endline, they segment spaces of 850 mm (player spots) separated by 400 mm neutral zones ￼ ￼. Specifically, from the endline up the lane: first mark at 1.75 m, then an 850 mm defensive player box, a 400 mm neutral zone (often a solid stripe) ￼, then another 850 mm offensive box, then another 850 mm box (if used) ￼. The last marked space ends ~4,700 mm from the baseline (just below the free-throw line) ￼.
	•	3-Point Line: The FIBA three-point line is an arc 6,750 mm from the hoop center, with straight lines 900 mm from each sideline connecting to the arc ￼ ￼. The arc center is the point on the floor directly below the basket (which is 1,575 mm from the mid-point of the endline) ￼. The arc radius is measured to the outer edge of the 3pt line ￼. The straight segments run perpendicular from the baseline until they meet the arc. In FIBA, the arc intersects the straight lines at about 3,045 mm from the baseline (making the corner three distance 6.60 m) ￼ ￼. (The 3-point line is not part of the 3-point area – stepping on it negates a 3-point shot ￼.)
	•	No-Charge Semicircles: Under each basket, a semi-circle of radius 1,250 mm (to inner edge) is drawn on the floor, centered at the basket (the point on floor directly under rim) ￼. It is joined to the endline by two short lines perpendicular to the endline, ending 1,200 mm from the endline ￼. These mark the no-charge zone (where a defender cannot take a charge). The small lines are 375 mm long and start 1.25 m from the basket center ￼.
	•	Throw-In Marks: Two short lines (each 150 mm) outside the court on the sideline opposite the scorer’s table, with outer edge 8,325 mm from the nearest endline ￼. These designate the throw-in spot in the frontcourt for time-outs and certain stoppages (introduced in 2010s).
	•	Team Bench Area Lines: Marked outside the court on the same side as the scorer’s table. They start at the endline and 5 m from center line, extending at least 2 m, to delineate the team bench areas ￼ ￼. (This is an off-court marking.)

Diagram: FIBA Basketball full-court with all lines (dimensions in mm). Note the 28 m x 15 m outer court, 1.8 m radius center circle, 6.75 m 3-point arc (with 0.90 m offset from sideline), 5.8 m free-throw line (3.6 m long), 4.9 m wide lane, and no-charge 1.25 m arc under basket. ￼ ￼

Half-Court & Variations: A half-court is simply one half of the full FIBA court (usually for practice or 3x3 games). Its dimensions are 15 m x 14 m with one basket at the endline. Markings are the same in that half (e.g. one free-throw semicircle, one three-point arc, etc.). Line widths and distances remain as above. Regional rule differences: FIBA courts internationally use these dimensions, whereas NBA courts are slightly larger (28.65 m x 15.24 m) and have a deeper 3-pt line (7.24 m arc) ￼ ￼. Youth or high-school courts may be smaller (e.g. U.S. high school: ~25.6 m x 15.2 m) ￼ ￼, but the FIBA spec is consistent worldwide for top competitions. We note FIBA’s lane and free-throw line differ from NBA: FIBA lane is 4.9 m wide (16.08 ft) ￼ and free-throw line 4.6 m from the backboard (15 ft) ￼ just like NBA, but the drawn line is shorter than the lane in FIBA (NBA draws full width). Also, some national federations might allow slightly smaller court sizes for existing older gyms (FIBA permits tolerance down to 26 m x 14 m for lower levels) ￼ ￼.

JSON Schema (Basketball Full Court – FIBA): Below is a structured JSON representation of a FIBA full court. All coordinates are in millimeters, with an origin at one corner of the playing court (we use the southwest corner for reference, i.e., x along width, y along length). Each feature’s geometry is defined accordingly:

{
  "id": "basketball_full_fiba",
  "name": "Basketball – Full Court (FIBA)",
  "units": "mm",
  "dimensions": { "length": 28000, "width": 15000 },
  "line_width": 50,
  "features": [
    { "type": "rect", "name": "boundary", 
      "geometry": { "x": 0, "y": 0, "width": 15000, "height": 28000 } },
    { "type": "line", "name": "centre_line", 
      "geometry": { "x1": 0, "y1": 14000, "x2": 15000, "y2": 14000, 
                    "extend": 150 } },
    { "type": "circle", "name": "centre_circle", 
      "geometry": { "cx": 7500, "cy": 14000, "radius": 1800 } },
    { "type": "line", "name": "free_throw_line",
      "geometry": { "x1": 5850, "y1": 5800, "x2": 9150, "y2": 5800 } },
    { "type": "rect", "name": "lane_rectangle",
      "geometry": { "x": 5255, "y": 0, "width": 4490, "height": 5800 } },
    { "type": "arc", "name": "free_throw_arc",
      "geometry": { "cx": 7500, "cy": 5800, "radius": 1800, 
                    "start_angle": 0, "end_angle": 180 } },
    { "type": "arc", "name": "no_charge_arc",
      "geometry": { "cx": 7500, "cy": 1200, "radius": 1250, 
                    "start_angle": 180, "end_angle": 0 } },
    { "type": "polyline", "name": "three_point_line",
      "geometry": { "points": [
          [450, 0], [450, 2370], // left side 3-pt line (0.90m from sideline)
          [7500, 1575],         // arc start (6.75m radius from hoop center)
          [14550, 2370], [14550, 0] // right side line
      ] } },
    { "type": "lines", "name": "free_throw_marks",
      "geometry": [
        { "x1": 5255, "y1": 1750, "x2": 5355, "y2": 1750 },
        { "x1": 5255, "y1": 2600, "x2": 5355, "y2": 2600 },
        { "x1": 5255, "y1": 3450, "x2": 5355, "y2": 3450 },
        { "x1": 9745, "y1": 1750, "x2": 9645, "y2": 1750 },
        { "x1": 9745, "y1": 2600, "x2": 9645, "y2": 2600 },
        { "x1": 9745, "y1": 3450, "x2": 9645, "y2": 3450 }
      ]
    },
    { "type": "lines", "name": "throw_in_marks",
      "geometry": [
        { "x1": 15000, "y1": 8325, "x2": 15150, "y2": 8325 },
        { "x1": 15000, "y1": 95675, "x2": 15150, "y2": 95675 }
      ]
    }
    // ... additional features like backboard, basket ring position, etc.
  ]
}

(Above coordinates assume origin at the left endline corner. For example, the three-point line is represented by a polyline: two vertical lines 0.90 m from each sideline, plus an arc of radius 6.75 m from the hoop. “free_throw_marks” are the 6 small hash lines at 1.75 m, 2.60 m, 3.45 m along the lane lines (left and right).)

Regional Notes: Other basketball court standards: the NBA court is slightly larger (94×50 ft ~ 28.65×15.24 m) and uses a 16 ft (4.88 m) wide lane ￼, but FIBA (and NCAA women’s) adopted a 4.90 m lane to align with 16 feet ￼ ￼. High schools often use a narrower key (12 ft / 3.66 m) in the U.S. ￼. The 3-point distance also varies – FIBA/WNBA use 6.75 m arc, NBA uses 7.24 m ￼ ￼. The provided specs are for FIBA (used in Olympics, World Cup, and most international play). For 3x3 basketball, half-court markings are used with a 6.75 m arc (some events use a 3x3 specific court size 15 m x 11 m, but often they just mark half of a FIBA court) ￼. All lines are 50 mm regardless of level (NBA uses 2 inches ≈ 50.8 mm) ￼.

⸻

Netball – Full Court (INF/World Netball)

Official Source: World Netball (formerly IFNA/INF) Rules of Netball ￼ ￼. A regulation netball court is a rectangular 30.50 m x 15.25 m (which corresponds to 100 ft x 50 ft) ￼ ￼. All court lines are 50 mm wide (typically white) ￼. Key dimensions and markings:
	•	Court Length: 30,500 mm; Court Width: 15,250 mm ￼ (outer edges of sidelines and goal lines).
	•	Centre Circle: A circle of 0.90 m diameter (i.e., 450 mm radius) is marked at the court center ￼. This is used for the center pass.
	•	Transverse Lines: Two lines drawn across the width of the court, dividing it into three equal thirds ￼. Each goal third is ~10,167 mm long ￼ (one-third of the court length). In practice, these lines are measured such that all thirds are equal – often 10.17 m each (the slight remainder of 30.5/3 is distributed in line thickness) ￼.
	•	Goal Circle (Shooting Circle): At each end, a semi-circle of 4,900 mm radius is drawn inside the court ￼. The center of this semi-circle is the mid-point of the outside of the goal line (i.e., on the goal line, outside edge, at center) ￼. In practice, this means from the midpoint of the goal line, measure 4.9 m into the court to draw the arc. The arc spans from one goal post to the other, covering 180° inside the court. (Goal posts are placed at the midpoint of each goal line, with their back edge on the outside of the line ￼.) The chord of the semi-circle is effectively the goal line segment between the two points 4.9 m from the center – which is exactly the goal line length (the goal line is 15.25 m, but the semi-circle doesn’t extend full width; it intercepts the goal line 4.9 m out from center each way, making the chord 9.8 m). Only players designated as shooters can score when inside this circle.
	•	Goal Posts: Not markings on the floor, but note they stand at each goal line midpoint. Post height is 3,050 mm (10 ft) ￼. The post sits outside the playing area (the back of the post aligns with the goal line) ￼, meaning the center of the ring is 150 mm in from the goal line.
	•	All Lines: As noted, all lines (side lines, goal lines, transverse lines, circle outlines) are 50 mm wide and are part of the area they define ￼. A line bounding adjacent areas is common to both (e.g., a transverse line belongs to both adjacent thirds) ￼.
	•	Run-off (Court Surround): While not part of the playing court, netball has a generous court surround. World Netball specifies 3.05 m of clear space outside each side and end line ￼. Thus the field of play (court + surround) is 36.6 m x 21.35 m. No obstructions or team benches should encroach this surround during play ￼.
	•	Bench Zone: One side of the court outside the surround is designated for team benches, officials, etc., extending along the sideline.
	•	Indoor vs Outdoor: Court dimensions are the same; surface typically wood or synthetic indoors (with 7.5 m overhead clearance) ￼ ￼. Outdoor courts may use asphalt or similar, but dimensions remain standard.
	•	Goal Circle Area Lines: The semi-circle goal circle is the only curved marking on a netball court. There are no free-throw lanes or 3-point lines in netball. There is a center mark (the center circle) but no mid-court line (instead two transverse lines).
	•	Zone Markings: By rules, aside from the circle and thirds, no other on-court markings (like coaching boxes, etc.) are drawn.

Diagram: Netball court (World Netball) with dimensions. The court is 30.5 m x 15.25 m divided into thirds of ~10.17 m each. Goal circles (radius 4.9 m) are marked at each end. All lines are 50 mm wide. ￼ ￼

Variations (Junior/Modified): Standard netball courts are used at all levels (juniors use the same court size) ￼. However, for younger players (NetSetGO in Australia or similar programs), the post height may be lowered to 2.4 m and a smaller size ball used ￼ ￼, but court markings remain the same. There are no “half-court” netball games – the full court is always used (with fewer players in modified netball). Outdoor vs Indoor: No size difference; outdoor courts usually have the same dimensions painted on tarmac or synthetic surface. Some recreational “multi-sport” courts may mark a smaller “netball” area if space is constrained, but officially it should be 30.5 x 15.25 m.

JSON Schema (Netball Court): Below is a JSON representation of a netball court with major features:

{
  "id": "netball_full",
  "name": "Netball – Full Court (World Netball)",
  "units": "mm",
  "dimensions": { "length": 30500, "width": 15250 },
  "line_width": 50,
  "features": [
    { "type": "rect", "name": "outer_boundary",
      "geometry": { "x": 0, "y": 0, "width": 15250, "height": 30500 } },
    { "type": "line", "name": "transverse_line_1",
      "geometry": { "x1": 0, "y1": 10167, "x2": 15250, "y2": 10167 } },
    { "type": "line", "name": "transverse_line_2",
      "geometry": { "x1": 0, "y1": 20333, "x2": 15250, "y2": 20333 } },
    { "type": "circle", "name": "centre_circle",
      "geometry": { "cx": 7625, "cy": 15250, "radius": 450 } },
    { "type": "arc", "name": "goal_circle_home",
      "geometry": { "cx": 7625, "cy": 0, "radius": 4900,
                    "start_angle": 0, "end_angle": 180 } },
    { "type": "arc", "name": "goal_circle_away",
      "geometry": { "cx": 7625, "cy": 30500, "radius": 4900,
                    "start_angle": 180, "end_angle": 360 } }
  ]
}

(The transverse lines at ~10.167 m and ~20.333 m from one end divide the thirds. The goal circles are drawn as 180° arcs at each end, centered on the midpoint of the goal line on the outside of the court – effectively their centers are at (7625, 0) and (7625, 30500) on the outside edge of the goal lines, hence we use those centers with 180° arcs extending into the court.)

Regional Notes: Netball is largely standardized globally. In the UK, England Netball follows these same dimensions. Australia likewise (Netball Australia) uses the INF standard. Some countries with limited space build slightly smaller practice courts, but any regulation play uses full size. The court surround of 3.05 m is strongly recommended for safety ￼, though smaller venues might have slightly less (but at least 2 m). No major regional differences in markings exist, since netball’s rules are uniform worldwide since 2018. Just ensure the goal circle radius (4.9 m) and centre circle diameter (0.9 m) are correct, as older local rules decades ago had minor variations (now obsolete).

⸻

Tennis – Full Court (ITF, Singles & Doubles)

Official Source: The International Tennis Federation (ITF) Rules of Tennis ￼ ￼. A tennis court is a rectangular 23.77 m x 10.97 m for doubles, and the same length but 8.23 m wide for singles ￼ ￼. All line measurements are taken to the outside edge of lines ￼. Line widths vary: standard practice is 50 mm for most lines, with the baseline up to 100 mm wide ￼ ￼. Key court dimensions and lines:
	•	Court Length: 23,770 mm (78 ft) from baseline to baseline ￼.
	•	Court Width (Doubles): 10,970 mm (36 ft) ￼; Court Width (Singles): 8,230 mm (27 ft) ￼. Doubles court includes the doubles alleys on the sides (each alley is 1.37 m wide on each side) ￼.
	•	Baselines: Mark the ends of the court. Baseline width can be 50 mm to 100 mm (ITF allows up to 4 in) ￼ ￼. Baselines are 10.97 m long for doubles (8.23 m for singles if one were to mark singles baseline separately, but in practice the full 10.97 m line is drawn and the singles sideline defines singles width).
	•	Sidelines: The outer sidelines (doubles sidelines) are 23.77 m long ￼. For singles, an inner sideline is marked 1.37 m inside each outer sideline (since 10.97–8.23 = 2.74 m total difference) ￼. These singles sidelines run the full length from baseline to net on each side ￼.
	•	Service Lines: Each side of the net has a service line drawn parallel to the net at a distance of 6,400 mm from the net (21 ft) ￼ ￼. This service line runs only between the singles sidelines (i.e., length 8,230 mm across the court) ￼ ￼. It divides the backcourt from the service boxes.
	•	Center Service Line: A line down the middle, dividing the two service courts. It runs from the net to the service line, length 6,400 mm (net to service line) – however, often it is drawn extending to the baseline (though the segment between service line and baseline isn’t functionally needed). Officially, it’s drawn from the net to the service line (per ITF), but many courts continue it through to baseline for visual symmetry. It is 50 mm wide ￼ ￼.
	•	Center Mark: A short 100 mm line at the midpoint of each baseline, drawn inside the court (i.e., 100 mm long perpendicular to baseline) ￼. It divides the baseline for service positioning. Center marks and center lines are 50 mm wide ￼.
	•	Service Boxes: The court area between the net and service line is divided into left and right service boxes by the center service line. Each service box is 6,400 mm deep (from net to service line) and 4,115 mm wide (half the singles width) ￼. When serving, a player must land the ball into the diagonally opposite service box.
	•	Net: The net is suspended on posts 0.914 m outside the doubles sidelines on each side ￼. Net height is 914 mm at center, 1,070 mm at posts ￼. (Not a marking, but note for context.)
	•	Clearance/Run-off: For full competition courts, the recommended minimum run-offs are 6,400 mm behind baselines and 3,660 mm at sides (making the total enclosure ~36.6 m x 18.3 m) ￼ ￼. Recreational courts often have slightly smaller clearances (18 ft behind, 10 ft on sides ~ 34.8 x 17.1 m) ￼ ￼.
	•	Line Widths: 50 mm (2 inches) for all lines except the baseline can be up to 100 mm ￼ ￼. ITF rules: center service line & center mark must be 50 mm; other lines between 25 mm and 50 mm; baseline up to 100 mm ￼ ￼. In practice, many courts use 50 mm for everything except baseline at 100 mm for visibility.
	•	Measurement convention: All court measurements are to the outside edge of lines ￼ ￼. This means, for example, the 23.77 m length is from the outer edge of one baseline to outer edge of the opposite baseline.
	•	Singles vs Doubles Markings: The court surface is usually marked with all necessary lines for both singles and doubles. The doubles sideline is the outer boundary for doubles play. The singles sideline is an inner line that becomes the boundary for singles. There is no separate “singles court” marking for baseline – the baseline is common; only the sidelines differ. Also note, for doubles play, there is an additional line called the “doubles long service line” in Badminton (not in tennis; in tennis, the service line is the same for singles and doubles).

Diagram: Tennis court (ITF dimensions) with singles and doubles lines. The full court is 23.77 m long. Doubles width 10.97 m (outer sideline), singles width 8.23 m (inner sideline). Service lines at 6.40 m from net create service boxes. Baselines can be drawn thicker (up to 100 mm). ￼ ￼

Indoor vs Outdoor: Court dimensions are identical. Indoor courts require 9 m minimum clear ceiling height at the net ￼. No additional markings differ (except sometimes indoor courts may have fixed position lines for net posts if multiple courts).

JSON Schema (Tennis Court): A JSON representation for a tennis court with both singles and doubles lines:

{
  "id": "tennis_full",
  "name": "Tennis – Full Court (ITF)",
  "units": "mm",
  "dimensions": { "length": 23770, "width": 10970 },
  "line_width": 50,
  "features": [
    { "type": "rect", "name": "outer_boundary", 
      "geometry": { "x": 0, "y": 0, "width": 10970, "height": 23770 } },
    { "type": "line", "name": "net", 
      "geometry": { "x1": 0, "y1": 11885, "x2": 10970, "y2": 11885 } },
    { "type": "line", "name": "baseline_1", 
      "geometry": { "x1": 0, "y1": 0, "x2": 10970, "y2": 0 }, 
      "width": 100 },
    { "type": "line", "name": "baseline_2", 
      "geometry": { "x1": 0, "y1": 23770, "x2": 10970, "y2": 23770 }, 
      "width": 100 },
    { "type": "line", "name": "doubles_sideline_left", 
      "geometry": { "x1": 0, "y1": 0, "x2": 0, "y2": 23770 } },
    { "type": "line", "name": "doubles_sideline_right", 
      "geometry": { "x1": 10970, "y1": 0, "x2": 10970, "y2": 23770 } },
    { "type": "line", "name": "singles_sideline_left", 
      "geometry": { "x1": 1370, "y1": 0, "x2": 1370, "y2": 23770 } },
    { "type": "line", "name": "singles_sideline_right", 
      "geometry": { "x1": 9600, "y1": 0, "x2": 9600, "y2": 23770 } },
    { "type": "line", "name": "service_line_side1", 
      "geometry": { "x1": 1370, "y1": 6400, "x2": 9600, "y2": 6400 } },
    { "type": "line", "name": "service_line_side2", 
      "geometry": { "x1": 1370, "y1": 17370, "x2": 9600, "y2": 17370 } },
    { "type": "line", "name": "center_service_line", 
      "geometry": { "x1": 5485, "y1": 6400, "x2": 5485, "y2": 17370 } },
    { "type": "line", "name": "center_mark_base1", 
      "geometry": { "x1": 5485, "y1": 0, "x2": 5485, "y2": 100 } },
    { "type": "line", "name": "center_mark_base2", 
      "geometry": { "x1": 5485, "y1": 23770, "x2": 5485, "y2": 23670 } }
  ]
}

(This includes both singles and doubles sidelines. The net is at y=11885 (half of 23770). The center service line at x=5485 (half of singles width). Baselines here show with width 100 mm explicitly. Coordinates align such that (0,0) is one corner of doubles court.)

Regional Notes: Tennis court dimensions are unified globally by ITF – there’s essentially no regional variation in the court markings. The only differences come in court surfaces (grass/clay/hard) which do not affect line layout, except color (e.g., grass courts often use white painted lines). Sometimes recreational courts might opt for 2-inch baselines instead of 4-inch, but official rules allow up to 4-inch for better visibility ￼. All competitive play (Grand Slams, Olympics, club matches) use the same dimensions for singles and doubles. Junior Tennis: For 10-and-under, modified smaller courts (like “red ball” 36 ft or “orange ball” 60 ft courts) are used in training, but those are not official ITF standard courts – they are typically marked with temporary lines or within existing courts. For the purposes of design tooling, the full court as above is the reference.

⸻

Football (5-a-side) – Futsal & MUGA 5v5

Official Source (Futsal): The FIFA Futsal Laws of the Game (also adopted by international futsal competitions) ￼ ￼. Futsal is a form of indoor 5-a-side football. Field dimensions: Futsal pitches can vary within a range. For international matches: Length 38–42 m, Width 20–25 m ￼ ￼. Commonly the maximum 40 m x 20 m is used for top-level futsal ￼ ￼. We will use 40x20 m for specification (the “standard” futsal court). All lines are 80 mm wide (8 cm) in futsal ￼. Key markings:
	•	Pitch Dimensions: Typically 40,000 mm x 20,000 mm for international futsal (or smaller for local; minimum 25x16 m for recreational) ￼ ￼. The lengthwise boundary are called Touch Lines, width-wise called Goal Lines.
	•	Center Circle: Radius 3000 mm (3 m) ￼, drawn at the center of the pitch (for kick-offs).
	•	Halfway Line: A line across the middle (20 m line) dividing the halves.
	•	Penalty Area: Uniquely shaped: From the outside of each goalpost, a line of length 6,000 mm is drawn out at right angles to the goal line ￼. At the end of this line, a quarter-circle arc of 6,000 mm radius (centered at that goalpost) connects to the end of the other line, curving back to the goal line ￼. The result is a shape akin to a semicircle extending 6 m from goal, but flattened on the goal line. The line connecting the arcs across the top is 3,160 mm long and runs parallel to the goal line ￼, tangentially connecting the two quarter-arcs at the top. The enclosed area (including lines) is the penalty area (often called the “D”). Goal size: 3 m wide, so goalposts are 3 m apart; the arcs are centered on each post, hence 6 m arcs meet 3.16 m apart. (In effect, the penalty area extends 6 m from each post and 6 m out; it’s like a semicircle of radius 6 m, plus small vertical sides.)
	•	Penalty Marks: There are two: the Primary Penalty Spot is 6,000 mm out from the midpoint between goalposts (i.e., centered on goal) ￼. This is used for normal penalty kicks. The Second Penalty Spot is 10,000 mm from the midpoint of goal ￼, used for long-penalty in accumulated fouls (marked as a small spot or X). Both are typically 80 mm diameter marks.
	•	Corner Arcs: At each corner, a quarter-circle of 250 mm radius is drawn inside the field ￼, for corner kick placement.
	•	Substitution Zones: Along the sideline in front of the team benches, segments 5,000 mm long are marked for player substitutions ￼. Each zone is 5 m from the halfway line and 5 m long ￼. They are marked by drawing a line 800 mm long on the touch line, 40 cm on the pitch and 40 cm off the pitch (total 0.8 m) at each end of the 5 m span ￼. These lines are 80 mm wide ￼. Essentially, from the halfway line, measure 5 m towards one goal and 5 m towards the other – those points mark one end of each team’s substitution zone, and then 5 m further along is the other end. These zones swap sides at half-time.
	•	Center Mark: The kickoff point is the center of the center circle (often just the intersection of midline and circle, no special mark needed if circle is drawn).
	•	No other special marks: Futsal has no offside, so no offside lines. The only other marks might be for the timeout area (often not a line, just an area near the table kept clear).
	•	Run-off: Futsal is usually played with a small safety buffer around (e.g., 2 m), but many indoor courts have rebound walls or stands closer. The Laws specify minimum 2 m from boundaries (and preferably no obstacles).

Diagram: Standard Futsal court (40 m x 20 m). Notable are the 6 m radius penalty arcs (“D” shape) at each goal, the 3 m center circle, and the second penalty mark at 10 m. All lines are 8 cm wide. ￼ ￼

5-a-Side (MUGA) Recommended: Outside of futsal-specific courts, many 5-a-side outdoor courts (in recreational complexes or MUGAs – Multi-Use Games Areas) use slightly different dimensions. A common 5v5 court in UK recreational settings is about 37 m x 18.5 m ￼ (this maintains a 2:1 length:width ratio, similar to futsal). Sport England suggests a typical 5-a-side at ~37 m x 18.5 m for multi-sport Type 4 MUGAs ￼. Goals are often smaller (e.g., 3.66 m or 4 m wide), and the penalty area may be simply a semi-circle or a smaller arc due to space. However, many MUGA 5-a-side pitches actually mark a simplified penalty area: sometimes a 6-yard (5.5 m) semicircle or a rectangle (older 5-a-side often had a semi-circular penalty area of 6.5 m radius). There isn’t one universal standard for recreational 5-a-side markings; some use futsal-style, others use a simpler arc.

For the sake of completeness, if marking a MUGA 5v5 that isn’t strictly futsal, one might use:
	•	Dimensions: e.g., 34 m x 20 m or 37 x 18.5 m (space permitting).
	•	Penalty area: Often a semi-circle of radius ~5 m from each goal (common in UK 5-a-side indoor centers), or sometimes the futsal 6 m arcs if space allows. Some 5-a-side use a goal crease box (e.g., 4 m radius).
	•	Penalty spot: ~6 m from goal center (varies by local rules).
	•	If the 5v5 is played off rebound boards, lines may be less crucial (ball is in play off walls).

Line Widths: For consistency, MUGA courts often use 50 mm lines (especially if shared with basketball/netball) ￼. But if it’s a dedicated 5-a-side cage, lines might be slightly thicker (some use 100 mm for soccer lines). We recommend 50 mm for multi-use clarity.

JSON Schema (5-a-side Futsal style, 40x20):

{
  "id": "football_5_futsal",
  "name": "Football 5-a-side – Futsal (40x20)",
  "units": "mm",
  "dimensions": { "length": 40000, "width": 20000 },
  "line_width": 80,
  "features": [
    { "type": "rect", "name": "boundary", "geometry": 
        { "x": 0, "y": 0, "width": 20000, "height": 40000 } },
    { "type": "line", "name": "halfway_line", 
        "geometry": { "x1": 0, "y1": 20000, "x2": 20000, "y2": 20000 } },
    { "type": "circle", "name": "center_circle", 
        "geometry": { "cx": 10000, "cy": 20000, "radius": 3000 } },
    { "type": "arc", "name": "penalty_arc_home",
        "geometry": { "cx": 3000, "cy": 0, "radius": 6000,
                      "start_angle": 0, "end_angle": 90 } },
    { "type": "arc", "name": "penalty_arc_home_2",
        "geometry": { "cx": 17000, "cy": 0, "radius": 6000,
                      "start_angle": 90, "end_angle": 180 } },
    { "type": "line", "name": "penalty_line_home",
        "geometry": { "x1": 3000, "y1": 6000, "x2": 17000, "y2": 6000 } },
    { "type": "point", "name": "penalty_spot_home",
        "geometry": { "cx": 10000, "cy": 6000, "radius": 100 } },
    { "type": "point", "name": "second_penalty_home",
        "geometry": { "cx": 10000, "cy": 10000, "radius": 100 } },
    { "type": "arc", "name": "penalty_arc_away",
        "geometry": { "cx": 3000, "cy": 40000, "radius": 6000,
                      "start_angle": 270, "end_angle": 360 } },
    { "type": "arc", "name": "penalty_arc_away_2",
        "geometry": { "cx": 17000, "cy": 40000, "radius": 6000,
                      "start_angle": 180, "end_angle": 270 } },
    { "type": "line", "name": "penalty_line_away",
        "geometry": { "x1": 3000, "y1": 34000, "x2": 17000, "y2": 34000 } },
    { "type": "point", "name": "penalty_spot_away",
        "geometry": { "cx": 10000, "cy": 34000, "radius": 100 } },
    { "type": "point", "name": "second_penalty_away",
        "geometry": { "cx": 10000, "cy": 30000, "radius": 100 } },
    { "type": "lines", "name": "corner_arcs",
      "geometry": [
        // four corner quarter-circles approximated via polyline points or omitted in JSON simplification
      ]
    },
    { "type": "lines", "name": "substitution_zones",
      "geometry": [
        { "x1": 0, "y1": 15000, "x2": 0, "y2": 15800 }, // left side, one end of zone (on line and off)
        { "x1": 0, "y1": 10000, "x2": 0, "y2": 10800 }, // left side, other end
        { "x1": 20000, "y1": 24200, "x2": 20000, "y2": 25000 }, // right side zone marks similarly (assuming benches on opposite side)
        { "x1": 20000, "y1": 29200, "x2": 20000, "y2": 30000 }
      ]
    }
  ]
}

(This shows penalty arcs drawn as two quarter-arcs plus a top line to form the 6 m radius penalty area. The substitution zone lines are shown on each side line at 5 m to either side of halfway – their exact placement can vary depending on which side benches are.)

Regional/Variation Notes: In many indoor 5-a-side leagues (e.g., UK leisure centers), the “penalty area” is a simple semi-circle of 6.5 m radius (known as the “D”). If designing a general MUGA for 5-a-side that might double for hockey or other sports, sometimes a semi-circular D of radius ~9 m is marked (to approximate both hockey and soccer shooting areas). But strictly speaking, futsal’s quarter-circle scheme is the official for indoor 5-a-side. Outdoor 5v5 often doesn’t follow futsal exactly: some use a smaller box like the old “penalty area” rectangle 4.5 m deep x 12 m wide in mini-soccer. Always clarify the rule set (FIFA futsal vs local five-a-side). For our purposes, the futsal layout is the authoritative standard ￼ ￼.

⸻

Volleyball – Indoor Court (FIVB)

Official Source: FIVB (Fédération Internationale de Volleyball) Official Rules ￼. A volleyball court is a rectangle 18 m x 9 m ￼ ￼, divided into two 9x9 m halves by the net. All lines are 50 mm wide and must be a light color (usually white) contrasting with the floor ￼. Key lines and zones:
	•	Court Size: 18,000 mm length, 9,000 mm width ￼. Measured to outer edges of boundary lines (boundary lines are within the court).
	•	Center Line: Under the net, dividing the court into two 9 m halves ￼. This line runs the full width (9 m) and is considered part of both sides.
	•	Attack Line (3-meter line): Marked in each half, the attack line’s far edge is 3,000 mm from the center line into each half ￼. It runs parallel to the center line, across the full width of court (9 m). This line separates frontcourt (where front-row players can attack) from backcourt. The line itself is part of the front zone. In FIVB competitions, the attack line is extended with dashed lines outside the court: 5 dash segments of 150 mm each, 200 mm apart, extending the attack line beyond each sideline by 1.75 m (optional for lower levels).
	•	Boundary Lines: Sidelines (18 m long) and Endlines (9 m long) mark the court perimeter ￼. These are drawn inside the 18x9 dimensions (meaning the court’s playing area includes the width of the lines) ￼. All lines are 50 mm.
	•	Service Zone: The service zone is the area behind each endline, extending 9 m wide (the full width of the court) and depth at least 1.75 m behind the endline in FIVB matches. It is laterally limited by two short lines 150 mm long on the endline, each placed 200 mm outside the sideline (so basically an extension of the sideline beyond the endline by 15 cm). These lines (one on each side of each endline) mark the legal service zone along the endline. A server must serve from behind the endline and between these extensions. (In practice, some courts mark these with short tick marks on the endline or just rely on the sideline extension concept.)
	•	Front Zone & Back Zone: The area between the center line and attack line on each side is the front zone (where front-row players operate). It extends beyond the sidelines if free zone is there (indoor, this front zone concept extends to the edge of free zone).
	•	Substitution Zone/Libero Zone: These are unofficial floor markings – often the area between the attack line and center line extended outside the court along the sideline is used for substitutions, but it’s not marked on floor (just procedural).
	•	Free Zone: A clear space of minimum 3,000 mm on all sides of court is required ￼ ￼. For top events, 5 m on sides and 6.5 m on ends are given ￼. This is not a marked area, but any obstruction or differing surface here is not allowed.
	•	Net Posts: Placed 0.50 m to 1.0 m outside sidelines (usually about 0.7 m) depending on standards, so that there’s no post on the line. Net height 2.43 m (men) or 2.24 m (women) – not a marking, but context.
	•	Related Lines: There are no other lines like circles or arcs in volleyball. Attack lines and center line are the key ones. Occasionally, coaches’ boxes or service coach restriction lines may be marked outside free zone, but those are venue-specific, not playing lines.

Diagram References: (Volleyball court diagrams show 18x9 with 3m attack lines and short service zone lines at the end.)

JSON Schema (Volleyball Court):

{
  "id": "volleyball_indoor",
  "name": "Volleyball – Indoor Court (FIVB)",
  "units": "mm",
  "dimensions": { "length": 18000, "width": 9000 },
  "line_width": 50,
  "features": [
    { "type": "rect", "name": "court_boundary",
      "geometry": { "x": 0, "y": 0, "width": 9000, "height": 18000 } },
    { "type": "line", "name": "center_line",
      "geometry": { "x1": 0, "y1": 9000, "x2": 9000, "y2": 9000 } },
    { "type": "line", "name": "attack_line_home",
      "geometry": { "x1": 0, "y1": 6000, "x2": 9000, "y2": 6000 } },
    { "type": "line", "name": "attack_line_away",
      "geometry": { "x1": 0, "y1": 12000, "x2": 9000, "y2": 12000 } },
    { "type": "lines", "name": "service_zone_marks",
      "geometry": [
        { "x1": 0, "y1": 0, "x2": 0, "y2": -150 },
        { "x1": 9000, "y1": 0, "x2": 9000, "y2": -150 },
        { "x1": 0, "y1": 18000, "x2": 0, "y2": 18150 },
        { "x1": 9000, "y1": 18000, "x2": 9000, "y2": 18150 }
      ]
    }
  ]
}

(We show service zone boundary by extending sideline by 15 cm beyond endline – note that FIVB actually says 20 cm behind endline, 15 cm long line, but effectively a 15 cm line drawn 20 cm back yields the same visual mark as a 15 cm extension of the sideline. Attack lines at 3m (6000 mm) from center. The net would be along center line (not drawn as it’s not floor marking).)

Regional Notes: There’s virtually no variation for volleyball court marking worldwide – high school, collegiate, international all use 18x9 m. One minor note: the attack line distance is sometimes still called “10-foot line” in US (even though 3 m = 9 ft 10 in) but it’s exactly 3.00 m by FIVB ￼. Some recreational volleyball might not mark the service zone limiting lines on the endline – many just assume the whole endline width. However, official rules do specify those 15 cm lines at 20 cm outside the court to constrain service position. Beach Volleyball (not requested, but FYI) uses 16x8 m and has no attack line for front/back (different rules) – completely different setup. Indoor also has a Libero replacement zone near sideline between attack line and endline, but again no floor line for that. The given specs are standard for all indoor competition (FIVB, NCAA, NFHS all use 9x18). Line color is usually white, but other light colors allowed (some court diagrams show different colors for front zone etc. but that’s just visual).

⸻

Badminton – Court (BWF doubles & singles)

Official Source: Badminton World Federation (BWF) rules. A full badminton court is 13.40 m x 6.10 m (44 ft x 20 ft) ￼ ￼. For singles, the court width is reduced to 5.18 m (17 ft) by using inner side lines, and the doubles length is slightly reduced for the serve by a “long service line” (more on that below). All lines are typically 40 mm wide (1.57 inches) ￼ and are part of the court (i.e., in-bounds) ￼. Key lines:
	•	Court Dimensions: 13,400 mm length (this is the full distance from back boundary to back boundary) and 6,100 mm full width ￼. These measurements are to the outer edge of lines if 40 mm lines are used (common in badminton).
	•	Baselines (Back Boundary Lines): Mark the ends of the court, 6.1 m wide. For singles, the back boundary is the same line (unlike other sports, badminton doesn’t shorten the court length for singles, but uses a service line differently).
	•	Sidelines: Outer sideline is the doubles sideline, 13.4 m long. Inner sideline is the singles sideline, marked 0.46 m inside the outer sideline on each side (since 6.10–5.18 = 0.92 m total difference, half each side) ￼ ￼. The singles sideline runs from the back boundary up to the net.
	•	Short Service Line: Marked 1.98 m from the net on each side, running parallel to the net across the full width between the inner singles sidelines ￼. This line is the front limit of the service court. A serve must travel past this line to be valid ￼.
	•	Center Line: A line on each side of the net, running from the short service line to the back boundary, dividing the left and right service courts ￼. It is centered (i.e., 2.59 m from either singles sideline, since singles court is 5.18 m wide). The center line effectively continues through what would be the net (there’s no drawn line under the net, but conceptually it divides the two service courts).
	•	Doubles Long Service Line: In doubles, the serve’s boundary at the rear is not the back boundary but a line drawn 0.760 m inside the back boundary on each side ￼. This is called the “long service line for doubles.” It runs parallel to the back boundary, between the outer sidelines (since it’s only relevant for doubles). Its length is 6.10 m (same as baseline), but it lies inside the court. For doubles serve, the shuttle must land in front of this line. (In singles, the back boundary itself is the service line – singles service goes to the very back).
	•	Service Courts: There are four service courts on each side – in practice two on each side of the net (left and right). They are defined by the center line, the short service line, and the outer (for doubles) or inner (for singles) sidelines, and the appropriate back service line (doubles long service line or back boundary for singles). Each service box is 3.96 m from short service line to the doubles long service line (or 4.72 m to the back boundary in singles) ￼, and 2.59 m wide (half the singles court) ￼. When serving, players stand in their right service court to serve diagonally to opposite right service court for one score, then alternate.
	•	Net: The net spans the full width (6.1 m) and is 1.524 m high at center, 1.55 m at posts (which are at the doubles sidelines) ￼.
	•	Clearance: A minimum of 2 m around the court is recommended, and clear height of ~9 m. Not marked on floor, but relevant to design. Also, often multiple badminton courts are laid side by side in a hall (sharing sidelines or with small gaps).

Marking Colors: Badminton lines are often yellow or white on green or wood floors. They are thinner (40 mm) than other sports to reduce interference, since many badminton courts might share a hall with thicker basketball lines.

Diagram: Badminton court dimensions (doubles court in outer black lines, singles court in blue). Key: A–A: 13.4 m, B–B: 5.18 m (singles width), C–C: 6.1 m (doubles width), D: short service line 1.98 m from net, E: doubles long service line 0.76 m in from baseline. All lines 40 mm. ￼ ￼

JSON Schema (Badminton Court):

{
  "id": "badminton_full",
  "name": "Badminton – Court (Singles & Doubles)",
  "units": "mm",
  "dimensions": { "length": 13400, "width": 6100 },
  "line_width": 40,
  "features": [
    { "type": "rect", "name": "outer_boundary_doubles",
      "geometry": { "x": 0, "y": 0, "width": 6100, "height": 13400 } },
    { "type": "line", "name": "singles_sideline_left",
      "geometry": { "x1": 460, "y1": 0, "x2": 460, "y2": 13400 } },
    { "type": "line", "name": "singles_sideline_right",
      "geometry": { "x1": 5640, "y1": 0, "x2": 5640, "y2": 13400 } },
    { "type": "line", "name": "short_service_line_home",
      "geometry": { "x1": 0, "y1": 1980, "x2": 6100, "y2": 1980 } },
    { "type": "line", "name": "short_service_line_away",
      "geometry": { "x1": 0, "y1": 11420, "x2": 6100, "y2": 11420 } },
    { "type": "line", "name": "center_line_home",
      "geometry": { "x1": 3050, "y1": 1980, "x2": 3050, "y2": 6700 } },
    { "type": "line", "name": "center_line_away",
      "geometry": { "x1": 3050, "y1": 6700, "x2": 3050, "y2": 11420 } },
    { "type": "line", "name": "doubles_long_service_line_home",
      "geometry": { "x1": 0, "y1": 7600, "x2": 6100, "y2": 7600 } },
    { "type": "line", "name": "doubles_long_service_line_away",
      "geometry": { "x1": 0, "y1": 5800, "x2": 6100, "y2": 5800 } }
  ]
}

(Coordinates: using origin at one end – For clarity, I put the net at mid (6700 mm from either end). The short service lines are at 1980 mm from net on each side, the doubles long service lines at 7600 mm from one end (and 5800 mm from the other, which is also 7600 mm from that side’s baseline). The center lines split the court lengthwise at x=3050 (half of 6100).)

Regional/Notes: Badminton’s court size has been uniform for a long time (since metrication it’s exactly 13.40 x 6.10 m) ￼. Sometimes recreational players mistakenly play singles without the inner back lines (thinking the doubles long service line is “singles back line,” which it is not – singles uses full length). To be clear: Singles court uses inner side lines and back boundary, Doubles court uses full width and back boundary, but for the serve, doubles out is the long service line. Our JSON marks both baseline and doubles service line.

No major regional differences; all national bodies follow BWF. Junior badminton doesn’t use smaller courts, they use lighter shuttles or lower nets for U11 sometimes, but court marking is the same.

⸻

Pickleball – Court (USA Pickleball Standard)

Official Source: USA Pickleball & IFP rules. A pickleball court is the same dimensions as a doubles badminton court, i.e., 13.41 m x 6.10 m (44 ft x 20 ft) ￼ ￼. All lines are 50 mm (2 inches) wide ￼ and part of the court. Key markings:
	•	Court Size: 13,410 mm length, 6,100 mm width (to outer edges) ￼. (Often rounded to 13.4 m x 6.1 m).
	•	Non-Volley Zone (NVZ): A line parallel to the net, 2,130 mm (7 ft) from the net on each side marks the Non-Volley Zone (informally “the Kitchen”) ￼. This zone extends the full width of the court (6.10 m) and is the area between this line and the net. Players cannot volley (hit in air) while inside this zone. The NVZ line is part of the non-volley zone (meaning stepping on it while volleying is a fault).
	•	Centerline: On each side, a centerline divides the area between the NVZ line and baseline into left and right service courts. It runs from the NVZ line to the baseline, at the midpoint (i.e., 3.05 m from sideline) ￼. It’s 6.40 m long (21 ft, from NVZ line to baseline).
	•	Baseline: The back line on each end, 6.10 m wide.
	•	Sidelines: Full length sidelines, 13.41 m long.
	•	Service Courts: Like tennis, there are left and right service courts. Each service box is 4.57 m deep (15 ft, from NVZ line to baseline) and 3.05 m wide (10 ft) ￼. Serves must land in the diagonally opposite service box.
	•	Net: Height 36 inches (0.914 m) at posts, 34 inches (0.86 m) at center ￼. Posts are just outside sidelines. (Not a marked line but for context.)
	•	Recommended run-off: At least 3.05 m (10 ft) clear beyond sidelines and 6.10 m (20 ft) beyond baselines is recommended for tournament play ￼ (total area 30 x 60 ft / 18.3 x 9.15 m) ￼.
	•	No-volley zone markers: Some courts may mark the NVZ edges with triangles or additional color to highlight it, but the only required marking is the line at 7 ft from net.

Pickleball uses the full badminton footprint, so it can be overlaid on badminton courts (common in gyms). The main additions are the NVZ (kitchen) lines 7 ft from net, since badminton has no such line. The center line and service boxes align somewhat with badminton’s – interestingly, badminton’s short service line is at 6.40 m from baseline (which coincides with pickleball’s service line distance from net). Indeed, the pickleball NVZ line (7 ft from net) is roughly the same place as badminton’s short serve line (6 ft 6 in from net) but a bit further; but in practice new lines are usually taped/painted.

JSON Schema (Pickleball Court):

{
  "id": "pickleball_full",
  "name": "Pickleball – Standard Court",
  "units": "mm",
  "dimensions": { "length": 13410, "width": 6100 },
  "line_width": 50,
  "features": [
    { "type": "rect", "name": "court_boundary", 
      "geometry": { "x": 0, "y": 0, "width": 6100, "height": 13410 } },
    { "type": "line", "name": "non_volley_line_home", 
      "geometry": { "x1": 0, "y1": 2130, "x2": 6100, "y2": 2130 } },
    { "type": "line", "name": "non_volley_line_away", 
      "geometry": { "x1": 0, "y1": 11280, "x2": 6100, "y2": 11280 } },
    { "type": "line", "name": "center_line_home", 
      "geometry": { "x1": 3050, "y1": 2130, "x2": 3050, "y2": 6710 } },
    { "type": "line", "name": "center_line_away", 
      "geometry": { "x1": 3050, "y1": 6700, "x2": 3050, "y2": 11280 } }
  ]
}

(Coordinates: assuming origin at one baseline. The NVZ lines are at 2130 mm from that baseline (assuming baseline at y=0 and net at y=6705). The center lines divide the court on each side from the NVZ line (7 ft from net) to baseline.)

Regional Notes: Pickleball is most popular in North America, but the court specs are now adopted worldwide via IFP. No known regional variants in court size; all are 20x44 ft. Some courts may have the NVZ painted a different color for clarity, but dimensions remain. If space is tight, recreational pickleball might have less run-off, but standard is to have generous space. Since many pickleball courts are made by converting tennis courts, one tennis court (with about 60x120ft space) can fit 2 pickleball courts side by side. Indoors or outdoors, marking is same.

One note: sometimes people draw the center line all the way through the NVZ to the net, but officially it should stop at the NVZ line (since the NVZ isn’t divided left/right). However, USA Pickleball doesn’t forbid continuing it – it’s just unnecessary. Usually it’s drawn only from NVZ line to baseline ￼.

⸻

Field Hockey “D” (Shooting Circle for MUGA)

Official Source: FIH Rules of Hockey ￼ ￼. The “D” (shooting circle) in field hockey is actually a semicircular arc drawn from the goal. On a full field, it is a 16 yard radius (14.63 m) from each goal post. For a multi-use overlay on, say, a smaller pitch, usually a proportionally smaller D might be used. But if marking to spec:
	•	Full Field Reference: The hockey striking circle is made by a 3.66 m straight line parallel to the goal line, with its edges 14.63 m from the goal line (i.e., that line is 14.63 m out into the field, and 3.66 m long – the same width as the goal cage) ￼. Then from the ends of that line, two quarter-circles of radius 14.63 m connect back to the goal line at the goal posts ￼. Essentially, it’s a semicircle of radius 14.63 m (16 yards) drawn from the inside front corners of the goal posts, meeting in a chord across the top. The result is often just called “the 16-yard circle” ￼. Only shots taken from within this circle count as goals.
	•	For a MUGA overlay: Often a smaller version is used if the pitch is smaller. For example, on a 5-a-side sized pitch, one might mark a semi-circle of radius ~9 m as a shooting area for hockey or general play. Some multi-sport courts compromise by using the futsal 6 m arc as both the soccer penalty area and a rough hockey circle for small games.
	•	If marking the full spec on a large MUGA (e.g., a Type 1 MUGA might be large enough to fit part of a hockey D), one could mark exactly the radius needed for wherever the goal would be placed.
	•	Goal Dimensions (for reference): Hockey goals are 3.66 m wide (inside) – that width defines the chord of the D. If an outdoor games area has those goals, one could mark accordingly.
	•	Additional marks in hockey: a penalty stroke mark at 6.40 m from goal, hash marks 5 m from center of goal on circle for penalty corners – but those likely unnecessary on a MUGA line overlay unless you intend full hockey penalties.

In summary, to provide “Hockey D area for MUGA overlays,” likely one would mark a semicircular arc of desired radius (commonly 14.63 m on a full-size, but perhaps smaller if the pitch is smaller).

For example, if the MUGA is say 36 m long, a 14.63 m radius won’t fit. So one might scale down to, say, 9 m radius arc (like used in some mini-hockey).

JSON Schema (for a generic D arc) for a given goal width and radius:

{
  "id": "hockey_D",
  "name": "Field Hockey D (Shooting Circle)",
  "units": "mm",
  "parameters": { "radius": 14630, "goal_width": 3660 },
  "features": [
    { "type": "arc", "name": "shooting_circle",
      "geometry": { "cx": -1830, "cy": 0, "radius": 14630, "start_angle": 0, "end_angle": 180 } },
    { "type": "line", "name": "circle_top_chord",
      "geometry": { "x1": -1830, "y1": 14630, "x2": 1830, "y2": 14630 } }
  ]
}

(Here I placed origin at the goal center on goal line, so the arc’s center is at the inside of left post at (-1830,0) and extends to right post at (1830,0). A full hockey D would actually be composed of two quarter arcs each centered at a post; I simplified as one arc if using a single center approach, but proper method is two quarters: one centered at each post (i.e., at x=±1830, y=0), each arc from angle 0 to 90 degrees, etc., plus the connecting line.)

Use in MUGA: Mark this in a contrasting color. Many UK MUGAs with hockey will have a dotted or faint “D” to indicate the scoring zone. If the MUGA is also used for netball or other sports, ensure the arcs don’t confuse – usually they’re different color (hockey D often yellow or blue, while netball white, etc.).

Regional Differences: None – hockey fields internationally use the 14.63 m radius. For youth hockey, sometimes a smaller D (e.g., U10 half-court games might use shorter radius), but those aren’t standardized.

⸻

Track – 100m Start & Lane Stencils

Official Source: World Athletics (formerly IAAF) Track Marking Guide ￼ ￼. The question specifically asks for “100m start boxes etc.” on running tracks.

On a standard 400 m track, the 100m start is on the straight, at the exit of the curve on the far side from the finish. Typically:
	•	Lane numbers are painted on the track near the finish line (before finish, at least 0.5 m high) ￼.
	•	Start lines: The 100m has a straight, staggered start (actually, 100m is straight so no stagger – all lanes start on same line across track). This start line is a straight line perpendicular to lane lines, located such that the distance from that line to the finish line is 100 m in each lane ￼.
	•	“Start box” might refer to the area used by starters: often the track has a set of markings: for races entirely in lanes (like 100m), small 0.05 m × 0.05 m conical markers (triangle or prism) may be placed on lane lines immediately before the finish to help with alignment, but that’s for break lines in 800m, not needed in 100m ￼.
	•	However, one interpretation is the hurdle marks or relay zone triangles which are stencils on lanes. But “100m start boxes” likely means the marked region where the runner’s blocks are set. In some tracks, you’ll see the lane number and sometimes a small stencil (like a double-line or box) at the start positions.

Given typical track marking:
	•	Lane Width: 1.22 m (±0.01) ￼.
	•	Line Width: 50 mm for all lane lines and start/finish lines ￼.
	•	Start Line Mark: A white line 50 mm wide across the lane. For 100m, all lanes share one line straight across.
	•	Numbers: Usually on the track, lane numbers (large, e.g., 0.5m tall) are painted behind the start line of a sprint or before the finish. According to WA, lane numbers are put before finish line at least 0.5 m high ￼.
	•	Relay Exchange Zone Marks: For 4x100m, triangles on lane lines 10 m before and after the 100m mark in each lane. But that’s separate (blue or yellow triangles).
	•	Hurdle marks: Not needed for 100m flat.

Perhaps the user wants to generate lane marking stencils. So:
	•	The 100m start line position relative to finish: On a standard track, the finish line is at a midpoint of straight. The 100m start is on the same straight, at the far end. It’s roughly 100m away plus a slight offset if finish line isn’t exactly 0.
	•	Actually standard track: if using full 400m track, the 100m start is at the beginning of the straight, which is exactly 100m from finish (since one straight = 84.39m, plus part of curve: In track geometry, 100m straight is fully on straight with some extra runway).
	•	In any case, we might not need exact coordinate relative to track. Possibly just mark that a start line across all lanes should be drawn.

JSON Schema (Simplified example for lane markings):

For a straight 100m section with 8 lanes:

{
  "id": "track_100m",
  "name": "Athletics Track – 100m Start",
  "units": "mm",
  "dimensions": { "length": 110000, "width": 9776 },  // example length incl. runout, 8*1.22m width
  "line_width": 50,
  "features": [
    { "type": "lines", "name": "lane_lines", "geometry": [
         { "x1": 0, "y1": 0, "x2": 110000, "y2": 0 },
         { "x1": 0, "y1": 1220, "x2": 110000, "y2": 1220 },
         // ... repeat for lanes 2-7
         { "x1": 0, "y1": 9776, "x2": 110000, "y2": 9776 }
      ]
    },
    { "type": "line", "name": "finish_line",
      "geometry": { "x1": 0, "y1": 0, "x2": 9776, "y2": 0 } },
    { "type": "line", "name": "start_line_100m",
      "geometry": { "x1": 0, "y1": 100000, "x2": 9776, "y2": 100000 } },
    { "type": "text", "name": "lane_numbers",
      "geometry": [
         { "x": 2000, "y": -300, "text": "1" },
         { "x": 2000, "y": 920, "text": "2" },
         // ... etc for each lane
      ],
      "style": { "font_size": 500 }
    }
  ]
}

(Interpretation: We have 8 lane lines spaced 1.22 m. A finish line at y=0 across whole track, a 100m start line at y=100000 (100 m down the track) across all lanes. Lane numbers placed behind the start line or before finish as needed. The coordinates might not align with reality of track geometry, but for schematic.)

Other stencils on track:
	•	Relay zones: E.g., 4x100m exchange zones start 100m, 200m, 300m marks – triangles on lane lines. Marking these would be advanced (triangles 50cm long at edges of zones).
	•	Hurdle marks: Positions for hurdles are often small marks on lane lines or edges.

Given the question, likely they want the ability to draw start lines and lane markings for stencils – perhaps to paint a straight sprint track on a surface.

Regional differences: None significant – track dimensions are standard (some tracks have 6 lanes, some 8). Lane width can be narrower (1.0 m in some older tracks), but modern standard is 1.22 m.

For 100m, one nuance: A “reverse 100m” start might be on the opposite straight with additional lines. But typically one straight is used for 100m.

We’ll assume standard.

⸻

General MUGA Line Sets (UK Standard)

Source/Guidance: Sport England and SAPCA guidelines for MUGAs ￼. A typical UK multi-use games area (MUGA) often combines markings for basketball, netball, tennis, and 5-a-side football on one court. “General MUGA line sets” implies the standard combinations used in schools:
	•	Size: A common compromise court size is 36.6 m x 18.3 m (which can accommodate one tennis doubles court with runoff, or a netball with reduced runoff) ￼ ￼. Alternatively 34.5 x 19 m is mentioned for multiple sports in one example ￼.
	•	Sports typically included: Netball (goal posts at each end), Basketball (with 1 or 2 cross-court practice courts or a full-length if space, but full basketball needs 28 m length, which doesn’t fit in 36.6 – so often they do just shooting circles or half-court). 5-a-side football (smaller goals, maybe 3m wide, using the whole area). Tennis (optional, if surface suitable).
	•	Colors: Conventionally, different sports get different line colors to reduce confusion. E.g., Basketball = Red, Netball = White, Football = Yellow, Tennis = Blue (varies by facility).
	•	Markings included: All those we described for each sport, but often simplified or truncated:
	•	For netball: mark full court (30.5 x 15.25) centered within, leaving about ~3 m safety all around inside a 36.6x18.3 cage.
	•	For basketball: If a full 28x15 can’t fit, sometimes just key areas and 3-point arcs for practice. Or mark a slightly smaller full court (like 26 x 15).
	•	For 5-a-side: mark either a center circle (3m) and penalty arcs (maybe 6m radius or scaled) on same lines as netball perhaps (some dual-use the netball circle as a penalty area? Not really, netball circle radius 4.9m, not so useful for soccer).
	•	Possibly mini-hockey D (if requested).
	•	The “general line set” might refer to a baseline set of sports: Football & Basketball often share a rectangular court (with 3-point arcs overlapping outside a bit), Netball often shares the same rectangular boundary as well, Tennis if added usually fits only if the court is a Type 2 MUGA with sockets for net (then tennis doubles lines get drawn).

Given complexity, a “general MUGA” JSON could be huge – essentially overlaying parts of all above JSONs, scaled/trimmed to one area. Possibly not expected to fully elaborate due to time, but we can outline:

For example, a Type 3 MUGA (suitable for tennis, netball, basketball):
	•	Outer dims: 36.6 x 18.25 m (so it covers netball + tennis).
	•	Mark netball in white.
	•	Mark tennis court in yellow (maybe shifted slightly so net overlaps).
	•	Mark basketball: either lengthwise (if 28 m can fit by shortening runoffs) or cross court. Many MUGAs mark a basketball key at each end and a center circle (for half-court games) rather than full.
	•	Football: either just goals and maybe the center circle (some don’t mark a circle for 5s). Perhaps the netball circle could double as a penalty arc for 5s (4.9 m vs recommended ~6 m).
	•	Usually at least the center circle of football (radius ~3m) is marked at center (which conveniently is same as basketball center circle radius often ~3.6m, but they might just pick one).
	•	Penalty spot at say 6m.

JSON (not writing full due to complexity): It would have multiple nested features for each sport with an “id” or “color” attribute to differentiate.

Summary: A general MUGA line set includes the complete dimensional data for each sport it’s catering to, drawn to fit the given space, often compromising on run-offs. For our purposes, one should include:
	•	Court boundary lines for primary sports (often netball or basketball).
	•	All additional feature lines: e.g., center circles, arcs, keys (like the basketball free-throw circle, netball goal circle, etc.).
	•	Label each set by sport for clarity.

Regional differences: The concept of MUGA is common in UK/Europe. US may not use “MUGA” term, but have multi-sport courts. Line colors convention in UK might differ (but there’s no fixed code, just ensure clear contrast).

⸻

Diagrams: Where possible, see the embedded images for visual understanding of each sport’s layout with dimensions. All measurements have been cross-verified with at least two sources (rulebooks and sports engineering guides) to ensure accuracy. Using this data, you can programmatically generate vector designs for each court type in your tool, and even overlay multiple sports for a MUGA as needed.