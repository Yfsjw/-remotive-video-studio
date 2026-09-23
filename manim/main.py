from manim import *

config.background_color = "#05070B"
config.frame_rate = 30
config.pixel_width = 1080
config.pixel_height = 1920


class RemotiveV6(MovingCameraScene):
    """
    V6: cinematic explanatory language.
    Principle: do not present information as UI cards.
    Every beat has a visual metaphor, a transformation, and camera motion.
    """

    C = {
        "bg": "#05070B",
        "white": "#F8FAFC",
        "muted": "#7F8EA3",
        "cyan": "#38BDF8",
        "violet": "#A78BFA",
        "amber": "#F59E0B",
        "green": "#34D399",
        "red": "#FB7185",
        "blue": "#60A5FA",
        "line": "#263447",
    }

    def t(self, text, size=30, color=None, weight=BOLD):
        return Text(text, font_size=size, color=color or self.C["white"], weight=weight)

    def stroke_box(self, w, h, color, fill="#0B111A", opacity=.96, radius=.18):
        return RoundedRectangle(
            corner_radius=radius, width=w, height=h,
            stroke_color=color, stroke_width=2.5,
            fill_color=fill, fill_opacity=opacity,
        )

    def dot(self, p, color, r=.07):
        return Dot(p, radius=r, color=color)

    def line(self, a, b, color=None, width=3, opacity=1):
        return Line(a, b, color=color or self.C["line"], stroke_width=width, stroke_opacity=opacity)

    def token(self, text, color, p, scale=1):
        w = max(1.15, .11 * len(text) + .72) * scale
        box = self.stroke_box(w, .58 * scale, color, "#0D141F", .98, .12 * scale).move_to(p)
        label = self.t(text, int(18 * scale), color).move_to(p)
        return VGroup(box, label)

    def ring(self, r, color, width=3, opacity=.8):
        return Circle(radius=r, color=color, stroke_width=width, stroke_opacity=opacity, fill_opacity=0)

    def particle_stream(self, count, x0, x1, yspread, color):
        pts = VGroup()
        for i in range(count):
            x = x0 + (x1-x0) * (i/(count-1))
            y = ((i*1.73) % 1.0 - .5) * yspread
            pts.add(self.dot([x, y, 0], color, .045 + .015*(i%3)))
        return pts

    def flow(self, start, end, color, run=.3):
        d = self.dot(start, color, .075)
        self.add(d)
        self.play(d.animate.move_to(end), run_time=run, rate_func=smooth)
        self.remove(d)

    def construct(self):
        self.camera.frame.set_width(10.5)
        elapsed = 0.0

        def play(*anims, run_time):
            nonlocal elapsed
            self.play(*anims, run_time=run_time)
            elapsed += run_time

        def until(target):
            nonlocal elapsed
            if target > elapsed:
                self.wait(target - elapsed)
                elapsed = target

        # ================================================================
        # 0.0–3.4  HOOK — the prompt is a physical mass of information.
        # ================================================================
        kicker = self.t("THE HIDDEN PROBLEM", 20, self.C["muted"]).to_edge(UP, buff=.45)
        headline = self.t("Most prompts fail\nbefore AI answers.", 58)
        headline.set_width(9.0).move_to([0, 5.65, 0])

        core = self.t("PROMPT", 42, self.C["white"])
        core.move_to([0, -.25, 0])
        core_ring = self.ring(1.15, self.C["red"], 3)
        core_ring.move_to(core)

        words = [
            ("goal?", self.C["muted"], [-3.0, 1.9, 0]),
            ("context", self.C["violet"], [2.7, 1.45, 0]),
            ("do this", self.C["white"], [-3.1, -.8, 0]),
            ("maybe", self.C["amber"], [3.0, -.85, 0]),
            ("examples...", self.C["muted"], [-1.9, -2.25, 0]),
            ("tone", self.C["cyan"], [1.7, -2.15, 0]),
        ]
        tokens = VGroup(*[self.token(a, c, p) for a,c,p in words])
        orbit = VGroup(*[
            self.line([0,0,0], p, self.C["line"], 2, .5) for _,_,p in words
        ])

        play(FadeIn(kicker, shift=DOWN*.2), FadeIn(headline, shift=UP*.2), run_time=.7)
        play(FadeIn(core, scale=.8), Create(core_ring), FadeIn(tokens, shift=UP*.15), Create(orbit), run_time=1.0)

        # The camera moves into the idea instead of changing to a new card.
        self.play(
            self.camera.frame.animate.move_to([0, 0.0, 0]).set_width(8.7),
            tokens.animate.scale(.93),
            run_time=.65,
        )
        elapsed += .65
        until(3.4)

        # ================================================================
        # 3.4–7.5  TRANSFORMATION — semantic structure emerges from chaos.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        new_title = self.t("Structure is the first transformation.", 36).set_width(8.8).to_edge(UP, buff=.55)
        center = self.t("PROMPT", 34, self.C["white"]).move_to([0, .5, 0])
        center_ring = self.ring(.72, self.C["cyan"], 2.5).move_to(center)

        anchors = VGroup(
            self.t("GOAL", 27, self.C["cyan"]),
            self.t("CONTEXT", 27, self.C["violet"]),
            self.t("CONSTRAINTS", 27, self.C["amber"]),
            self.t("EXAMPLES", 27, self.C["green"]),
        )
        positions = [[-3.0, 2.0, 0], [3.0, 2.0, 0], [-3.0, -1.9, 0], [3.0, -1.9, 0]]
        for a,p in zip(anchors,positions):
            a.move_to(p)

        anchor_lines = VGroup(*[
            self.line(center.get_center(), a.get_center(), c, 3, .75)
            for a,c in zip(anchors,[self.C["cyan"],self.C["violet"],self.C["amber"],self.C["green"]])
        ])

        micro = VGroup()
        for a,p,c in zip(anchors,positions,[self.C["cyan"],self.C["violet"],self.C["amber"],self.C["green"]]):
            for j in range(3):
                y = p[1] - .52 - j*.38
                micro.add(self.line([p[0]-.85,y,0],[p[0]+.85,y,0],c,3,.65))

        play(FadeIn(new_title, shift=DOWN*.2), FadeIn(center, scale=.8),
             Create(center_ring), run_time=.75)

        # Tokens physically fly toward their semantic destination.
        for old, new in zip(tokens, anchors):
            self.play(
                old.animate.move_to(new.get_center()).scale(.75).set_opacity(.15),
                new.animate.scale(1.08),
                run_time=.32,
            )
        play(Create(anchor_lines), FadeIn(anchors), FadeIn(micro), run_time=.65)

        # Brief becomes a coherent geometry, then camera drifts across it.
        self.play(
            self.camera.frame.animate.move_to([0, .1, 0]).set_width(11.2),
            run_time=.55,
        )
        elapsed += .55
        until(7.5)

        # ================================================================
        # 7.5–12.0  CONTEXT — one request splits into two worlds.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        title = self.t("Same words. Different world.", 38).set_width(8.8).to_edge(UP, buff=.55)
        request = self.t("LAUNCH POST", 34, self.C["white"]).move_to([0, 3.7, 0])
        request_ring = self.ring(.9, self.C["cyan"], 2.5).move_to(request)

        split = self.line([0,2.8,0],[0,-5.1,0],self.C["line"],3,.8)
        left_label = self.t("STARTUP", 28, self.C["violet"]).move_to([-2.65, 2.35, 0])
        right_label = self.t("CONSUMER", 28, self.C["amber"]).move_to([2.65, 2.35, 0])

        # Startup world: rising trajectory + milestone points.
        left_axis = VGroup(
            self.line([-4.0,-2.8,0],[-.8,-2.8,0],self.C["line"],2),
            self.line([-4.0,-2.8,0],[-4.0,1.8,0],self.C["line"],2),
        )
        left_curve = VMobject(color=self.C["violet"], stroke_width=5)
        left_curve.set_points_as_corners([
            [-3.8,-2.5,0],[-3.1,-1.8,0],[-2.4,-2.0,0],[-1.7,-.5,0],[-1.0,1.45,0]
        ])
        left_points = VGroup(*[self.dot(p,self.C["violet"],.08) for p in [
            [-3.1,-1.8,0],[-2.4,-2.0,0],[-1.7,-.5,0],[-1.0,1.45,0]
        ]])
        left_words = VGroup(
            self.t("founders",18,self.C["muted"]),
            self.t("technical",18,self.C["muted"]),
            self.t("sign-ups",20,self.C["violet"]),
        ).arrange(DOWN,aligned_edge=LEFT,buff=.28).move_to([-2.2,-3.65,0])

        # Consumer world: device + pulse/attention.
        phone = RoundedRectangle(corner_radius=.28,width=2.0,height=3.3,
                                 stroke_color=self.C["amber"],stroke_width=3,
                                 fill_color="#0D141F",fill_opacity=1).move_to([2.65,-.25,0])
        screen = RoundedRectangle(corner_radius=.12,width=1.55,height=2.35,
                                  stroke_color=self.C["line"],stroke_width=2,
                                  fill_color="#111B29",fill_opacity=1).move_to(phone.get_center())
        play_head = Triangle(fill_color=self.C["amber"],fill_opacity=1,stroke_width=0).scale(.23).move_to([2.65,.25,0])
        pulse = VGroup(*[
            self.ring(.7+i*.38,self.C["amber"],2,.65-i*.12).move_to([2.65,.25,0])
            for i in range(3)
        ])
        right_words = VGroup(
            self.t("gamers",18,self.C["muted"]),
            self.t("energetic",18,self.C["muted"]),
            self.t("clicks",20,self.C["amber"]),
        ).arrange(DOWN,aligned_edge=LEFT,buff=.28).move_to([2.65,-3.65,0])

        play(FadeIn(title,shift=DOWN*.2), FadeIn(request,scale=.9), Create(request_ring),
             Create(split), run_time=.8)
        play(FadeIn(left_label), FadeIn(right_label), Create(left_axis), Create(left_curve),
             FadeIn(left_points), FadeIn(left_words), FadeIn(phone), FadeIn(screen),
             FadeIn(play_head), FadeIn(right_words), Create(pulse), run_time=1.0)

        self.play(
            left_curve.animate.shift(UP*.12),
            pulse.animate.scale(1.16),
            request_ring.animate.scale(1.12),
            run_time=.5,
        )
        elapsed += .5
        until(12.0)

        # ================================================================
        # 12.0–16.5  CONSTRAINTS — an infinite stream is physically narrowed.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        title2 = self.t("Constraints turn infinity into a decision.", 35).set_width(8.8).to_edge(UP,buff=.55)

        stream = self.particle_stream(30,-4.8,-1.4,5.0,self.C["muted"])
        stream.shift(DOWN*.2)

        funnel_top = Polygon(
            [-4.5,2.6,0],[4.5,2.6,0],[1.2,-1.1,0],[-1.2,-1.1,0],
            color=self.C["amber"],stroke_width=4,fill_opacity=0
        )
        inner = VGroup(
            self.line([-3.9,1.9,0],[3.9,1.9,0],self.C["line"],2,.6),
            self.line([-3.2,.7,0],[3.2,.7,0],self.C["line"],2,.6),
            self.line([-2.2,-.35,0],[2.2,-.35,0],self.C["line"],2,.6),
        )
        labels = VGroup(
            self.t("FORMAT",22,self.C["cyan"]).move_to([-3.3,2.15,0]),
            self.t("LENGTH",22,self.C["violet"]).move_to([3.0,1.0,0]),
            self.t("AUDIENCE",22,self.C["amber"]).move_to([0,-.15,0]),
        )
        out = self.t("ONE CLEAR IDEA", 32, self.C["green"]).move_to([0,-2.0,0])
        out_ring = self.ring(1.0,self.C["green"],3).move_to(out)

        play(FadeIn(title2,shift=DOWN*.2),FadeIn(stream),Create(funnel_top),
             FadeIn(inner),FadeIn(labels),run_time=.9)

        # Camera follows the stream into the narrow exit.
        self.play(
            stream.animate.move_to([0,0,0]).scale(.42),
            self.camera.frame.animate.move_to([0,-.7,0]).set_width(8.9),
            run_time=1.0,
        )
        elapsed += 1.0
        play(FadeIn(out,scale=.8),Create(out_ring),run_time=.45)
        until(16.5)

        # ================================================================
        # 16.5–21.0  EXAMPLES — references become a learned visual rhythm.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        title3 = self.t("Examples teach what words cannot.", 37).set_width(8.8).to_edge(UP,buff=.55)

        # Three reference "windows", each is a different visual language.
        frameA = self.stroke_box(2.65,3.35,self.C["cyan"],"#0B111A",1).move_to([-3.0,1.7,0])
        frameB = self.stroke_box(2.65,3.35,self.C["violet"],"#0B111A",1).move_to([0,1.7,0])
        frameC = self.stroke_box(2.65,3.35,self.C["green"],"#0B111A",1).move_to([3.0,1.7,0])

        # A: analytical graph
        ax = VGroup(
            self.line([-3.9,.3,0],[-2.1,.3,0],self.C["line"],2),
            self.line([-3.9,.3,0],[-3.9,2.65,0],self.C["line"],2)
        )
        curveA = VMobject(color=self.C["cyan"],stroke_width=4)
        curveA.set_points_as_corners([[-3.75,.45,0],[-3.3,1.0,0],[-2.95,.75,0],[-2.55,1.75,0],[-2.2,2.35,0]])
        dotsA = VGroup(*[self.dot(p,self.C["cyan"],.06) for p in [[-3.3,1.0,0],[-2.95,.75,0],[-2.55,1.75,0],[-2.2,2.35,0]]])

        # B: composition/layout
        blocksB = VGroup(
            Rectangle(width=.65,height=1.55,fill_color=self.C["violet"],fill_opacity=.8,stroke_width=0),
            Rectangle(width=.65,height=.9,fill_color=self.C["white"],fill_opacity=.75,stroke_width=0),
            Rectangle(width=.65,height=1.2,fill_color=self.C["muted"],fill_opacity=.6,stroke_width=0),
        ).arrange(RIGHT,buff=.16).move_to([0,1.65,0])
        baselineB = self.line([-1.05,.2,0],[1.05,.2,0],self.C["violet"],3,.8)

        # C: rhythm
        dotsC = VGroup(*[
            self.dot([2.15+i*.34,1.55+(0.48 if i%2==0 else -.25),0],
                     self.C["green"],.075)
            for i in range(6)
        ])
        rhythmC = VGroup(
            self.line([2.15,2.35,0],[4.0,2.35,0],self.C["green"],3,.7),
            self.line([2.15,.65,0],[4.0,.65,0],self.C["line"],2,.5)
        )

        merge = self.line([-3.0,-.15,0],[3.0,-.15,0],self.C["line"],4,.7)
        learned = self.t("STYLE  +  STRUCTURE  +  RHYTHM", 29, self.C["green"]).move_to([0,-2.25,0])
        learned_ring = self.ring(1.0,self.C["green"],2.5).move_to([0,-2.25,0])

        play(FadeIn(title3,shift=DOWN*.2),FadeIn(frameA),FadeIn(frameB),FadeIn(frameC),
             Create(ax),Create(curveA),FadeIn(dotsA),FadeIn(blocksB),Create(baselineB),
             FadeIn(dotsC),Create(rhythmC),run_time=.9)
        play(Create(merge),FadeIn(learned,shift=UP*.2),Create(learned_ring),run_time=.7)

        # Each reference sends a distinct signal into one common pattern.
        for start,col in [([-3.0,.0,0],self.C["cyan"]),([0,.0,0],self.C["violet"]),([3.0,.0,0],self.C["green"])]:
            self.flow(start,[0,-2.25,0],col,.28)
        self.play(
            learned_ring.animate.scale(1.35).set_opacity(.15),
            self.camera.frame.animate.move_to([0,-.1,0]).set_width(9.8),
            run_time=.55,
        )
        elapsed += .55
        until(21.0)

        # ================================================================
        # 21.0–26.0  ACTION — a brief becomes an active system.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        title4 = self.t("Now the system can act.", 38).set_width(8.8).to_edge(UP,buff=.55)

        nucleus = self.t("SPEC", 31, self.C["white"]).move_to([0,3.3,0])
        nucleus_ring = self.ring(.78,self.C["white"],2.5).move_to(nucleus)

        nodes = VGroup(
            self.t("RESEARCH",24,self.C["blue"]).move_to([-3.0,.7,0]),
            self.t("EXPLAIN",24,self.C["violet"]).move_to([0,.7,0]),
            self.t("BUILD",24,self.C["amber"]).move_to([3.0,.7,0]),
        )
        node_rings = VGroup(*[
            self.ring(.72,c,3).move_to(p)
            for p,c in zip([[-3.0,.7,0],[0,.7,0],[3.0,.7,0]],
                           [self.C["blue"],self.C["violet"],self.C["amber"]])
        ])
        spokes = VGroup(*[
            self.line(nucleus.get_center(),r.get_center(),c,3,.7)
            for n,r,c in zip(nodes,node_rings,[self.C["blue"],self.C["violet"],self.C["amber"]])
        ])

        output_box = self.stroke_box(7.2,2.0,self.C["green"],"#0B111A",1).move_to([0,-2.5,0])
        output = self.t("SPECIFIC RESULT", 30, self.C["green"]).move_to(output_box)
        result_lines = VGroup(
            self.line([-2.2,-2.95,0],[2.2,-2.95,0],self.C["green"],3,.8),
            self.line([-1.6,-3.35,0],[1.6,-3.35,0],self.C["muted"],2,.5)
        )

        play(FadeIn(title4,shift=DOWN*.2),FadeIn(nucleus,scale=.85),Create(nucleus_ring),
             Create(spokes),FadeIn(nodes),Create(node_rings),run_time=.9)

        # The system selects a path instead of lighting everything equally.
        play(
            node_rings[0].animate.scale(1.22),
            nodes[0].animate.set_color(self.C["white"]),
            node_rings[1].animate.set_opacity(.25),
            node_rings[2].animate.set_opacity(.25),
            run_time=.45,
        )
        self.flow(nucleus.get_bottom(),node_rings[0].get_top(),self.C["blue"],.35)
        play(FadeIn(output_box,shift=UP*.2),FadeIn(output),Create(result_lines),run_time=.65)
        self.flow(node_rings[0].get_bottom(),output_box.get_top(),self.C["green"],.35)

        # Push in toward the result; this is the payoff, not a static card.
        play(
            self.camera.frame.animate.move_to([0,-.4,0]).set_width(8.7),
            output_box.animate.scale(1.05),
            run_time=.65,
        )
        until(26.0)

        # ================================================================
        # 26.0–30.0  HERO — one idea continuously transforms.
        self.clear()
        self.camera.frame.move_to([0,0,0])
        self.camera.frame.set_width(10.5)
        # ================================================================
        kicker2 = self.t("THE DIFFERENCE",20,self.C["muted"]).to_edge(UP,buff=.5)
        final = self.t("Don't animate the words.\nAnimate the idea.", 52)
        final.set_width(9.0).move_to([0,5.35,0])

        idea = self.t("IDEA", 32, self.C["violet"]).move_to([0,.3,0])
        idea_ring = self.ring(.9,self.C["violet"],3).move_to(idea)

        structure = VGroup(
            self.t("GOAL",20,self.C["cyan"]),
            self.t("CONTEXT",20,self.C["violet"]),
            self.t("CONSTRAINTS",20,self.C["amber"]),
            self.t("EXAMPLES",20,self.C["green"]),
        )
        structure.arrange(RIGHT,buff=.22).move_to([0,-1.0,0])
        structure_line = self.line([-3.5,-1.45,0],[3.5,-1.45,0],self.C["line"],3,.7)

        action = self.t("ACTION", 30, self.C["green"]).move_to([0,-2.75,0])
        action_ring = self.ring(.95,self.C["green"],3).move_to(action)
        payoff = self.t("RESULT", 25, self.C["white"]).move_to([0,-4.25,0])

        play(FadeIn(kicker2,shift=DOWN*.2),FadeIn(final,shift=UP*.2),
             FadeIn(idea,scale=.8),Create(idea_ring),run_time=.85)

        play(
            idea.animate.move_to([0,1.0,0]).scale(.86),
            idea_ring.animate.move_to([0,1.0,0]).scale(.86),
            FadeIn(structure,shift=UP*.15),Create(structure_line),
            run_time=.55,
        )
        play(
            structure.animate.shift(DOWN*.2).set_opacity(.8),
            FadeIn(action,scale=.85),Create(action_ring),
            run_time=.55,
        )
        self.flow(idea.get_center(),action.get_center(),self.C["green"],.3)
        play(FadeIn(payoff,shift=UP*.15),run_time=.35)

        # Final camera move gives the line a cinematic finish.
        play(
            self.camera.frame.animate.move_to([0,-.15,0]).set_width(9.55),
            run_time=.55,
        )
        until(30.0)
