from manim import *

config.background_color = "#05070B"
config.frame_rate = 30
config.pixel_width = 1080
config.pixel_height = 1920


class RemotiveV42(MovingCameraScene):
    """
    V4.2: narration-driven explanatory animation.
    The visual beats are locked to the eight narration beats rendered by CI.
    """

    C = {
        "cyan": "#38BDF8",
        "violet": "#A78BFA",
        "amber": "#F59E0B",
        "green": "#34D399",
        "blue": "#60A5FA",
        "white": "#F8FAFC",
        "muted": "#94A3B8",
        "line": "#334155",
        "panel": "#0B111A",
    }

    BEATS = [0.0, 2.6, 4.3, 8.2, 15.4, 19.7, 24.9, 27.4, 30.0]

    def node(self, label, color, point, radius=0.62, size=24):
        c = Circle(
            radius=radius,
            stroke_color=color,
            stroke_width=4,
            fill_color=self.C["panel"],
            fill_opacity=1,
        ).move_to(point)
        t = Text(label, font_size=size, weight=BOLD, color=color).move_to(point)
        return VGroup(c, t)

    def link(self, a, b, color=None, width=3, opacity=0.72):
        return Line(
            a.get_center(),
            b.get_center(),
            color=color or self.C["line"],
            stroke_width=width,
            stroke_opacity=opacity,
        )

    def dot_flow(self, a, b, color):
        d = Dot(a.get_center(), radius=0.09, color=color)
        self.play(MoveAlongPath(d, Line(a.get_center(), b.get_center()), rate_func=smooth), run_time=0.38)
        self.remove(d)

    def caption(self, text, color=None):
        t = Text(
            text,
            font_size=23,
            weight=BOLD,
            color=color or self.C["muted"],
        )
        t.set_width(9.0)
        t.move_to([0, -8.25, 0])
        return t

    def construct(self):
        self.camera.frame.set_width(10.5)
        elapsed = 0.0

        def play(*anims, run_time):
            nonlocal elapsed
            self.play(*anims, run_time=run_time)
            elapsed += run_time

        def wait_until(target):
            nonlocal elapsed
            gap = target - elapsed
            if gap > 0:
                self.wait(gap)
                elapsed = target

        # ------------------------------------------------------------------
        # Beat 1 — 0.0–2.6
        # "A prompt is not a sentence."
        # ------------------------------------------------------------------
        kicker = Text("THE PROBLEM", font_size=24, weight=BOLD, color=self.C["muted"])
        kicker.move_to([0, 7.9, 0])

        hook = Text("A prompt is not a sentence.", font_size=54, weight=BOLD, color=self.C["white"])
        hook.set_width(9.2)
        hook.move_to([0, 5.7, 0])

        underline = Line([-4.0, 4.85, 0], [4.0, 4.85, 0], color=self.C["cyan"], stroke_width=5)

        play(FadeIn(kicker, shift=DOWN * 0.2), FadeIn(hook, shift=UP * 0.25), run_time=0.85)
        play(Create(underline), run_time=0.35)
        wait_until(2.6)

        # ------------------------------------------------------------------
        # Beat 2 — 2.6–4.3
        # "It is a system."
        # ------------------------------------------------------------------
        system = Text("It is a SYSTEM.", font_size=64, weight=BOLD, color=self.C["white"])
        system.move_to([0, 5.8, 0])

        orbit = Circle(radius=2.15, color=self.C["cyan"], stroke_width=3).move_to([0, 0.6, 0])
        core = Circle(radius=0.82, color=self.C["white"], stroke_width=4, fill_color=self.C["panel"], fill_opacity=1).move_to([0, 0.6, 0])
        core_text = Text("INPUT", font_size=22, weight=BOLD, color=self.C["white"]).move_to(core.get_center())

        play(
            FadeOut(kicker),
            Transform(hook, system),
            FadeOut(underline),
            Create(orbit),
            FadeIn(core, scale=0.7),
            FadeIn(core_text, scale=0.7),
            run_time=0.9,
        )
        wait_until(4.3)

        # ------------------------------------------------------------------
        # Beat 3 — 4.3–8.2
        # "You start with a goal, context, constraints, and examples."
        # ------------------------------------------------------------------
        goal = self.node("GOAL", self.C["cyan"], [-3.25, 2.55, 0], 0.72, 22)
        context = self.node("CONTEXT", self.C["violet"], [3.25, 2.55, 0], 0.78, 20)
        limits = self.node("LIMITS", self.C["amber"], [-3.25, -1.45, 0], 0.72, 22)
        examples = self.node("EXAMPLES", self.C["green"], [3.25, -1.45, 0], 0.80, 19)

        for n in [goal, context, limits, examples]:
            n.set_opacity(0)

        play(
            FadeOut(system, shift=UP * 0.25),
            FadeOut(orbit),
            FadeOut(core),
            FadeOut(core_text),
            *[FadeIn(n, shift=UP * 0.25) for n in [goal, context, limits, examples]],
            run_time=1.0,
        )

        links = VGroup(
            self.link(goal, context),
            self.link(context, examples),
            self.link(examples, limits),
            self.link(limits, goal),
        )
        play(Create(links), run_time=0.45)

        for a, b, c in [
            (goal, context, self.C["cyan"]),
            (context, examples, self.C["violet"]),
            (examples, limits, self.C["green"]),
            (limits, goal, self.C["amber"]),
        ]:
            self.dot_flow(a, b, c)

        wait_until(8.2)

        # ------------------------------------------------------------------
        # Beat 4 — 8.2–15.4
        # "When those pieces connect ... usable specification."
        # ------------------------------------------------------------------
        spec = self.node("SPEC", self.C["white"], [0, 0.55, 0], 1.08, 30)
        spec.set_opacity(0)

        spec_label = Text("CONNECTED → USABLE", font_size=25, weight=BOLD, color=self.C["muted"])
        spec_label.move_to([0, 6.9, 0])

        play(FadeIn(spec_label, shift=DOWN * 0.2), FadeIn(spec, scale=0.65), run_time=0.7)

        destinations = {
            goal: [-3.15, 3.25, 0],
            context: [3.15, 3.25, 0],
            limits: [-3.15, -2.05, 0],
            examples: [3.15, -2.05, 0],
        }
        play(
            *[n.animate.move_to(p).scale(0.9) for n, p in destinations.items()],
            run_time=0.9,
        )

        causal = VGroup(
            self.link(goal, spec, self.C["cyan"], 4, 0.85),
            self.link(context, spec, self.C["violet"], 4, 0.85),
            self.link(limits, spec, self.C["amber"], 4, 0.85),
            self.link(examples, spec, self.C["green"], 4, 0.85),
        )
        play(Create(causal), run_time=0.65)

        for n, col in [(goal, self.C["cyan"]), (context, self.C["violet"]), (limits, self.C["amber"]), (examples, self.C["green"])]:
            self.dot_flow(n, spec, col)

        # Turn the specification into a structured decision point.
        research = self.node("RESEARCH", self.C["blue"], [-3.15, -5.0, 0], 0.82, 19)
        explain = self.node("EXPLAIN", self.C["violet"], [0, -6.05, 0], 0.80, 20)
        build = self.node("BUILD", self.C["amber"], [3.15, -5.0, 0], 0.76, 21)

        branch = VGroup(
            self.link(spec, research, self.C["blue"], 3, 0.75),
            self.link(spec, explain, self.C["violet"], 3, 0.75),
            self.link(spec, build, self.C["amber"], 3, 0.75),
        )
        play(
            FadeIn(research, shift=UP * 0.35),
            FadeIn(explain, shift=UP * 0.35),
            FadeIn(build, shift=UP * 0.35),
            Create(branch),
            run_time=1.0,
        )
        wait_until(15.4)

        # ------------------------------------------------------------------
        # Beat 5 — 15.4–19.7
        # "That structure determines what happens next: research, explanation, or building."
        # ------------------------------------------------------------------
        next_label = Text("THE NEXT ACTION IS A CONSEQUENCE.", font_size=28, weight=BOLD, color=self.C["white"])
        next_label.set_width(9.3)
        next_label.move_to([0, 7.25, 0])

        play(FadeIn(next_label, shift=DOWN * 0.2), run_time=0.45)

        # Focus on RESEARCH and dim alternatives.
        play(
            research.animate.scale(1.18),
            explain.animate.set_opacity(0.28),
            build.animate.set_opacity(0.28),
            run_time=0.55,
        )

        evidence = VGroup(
            Dot([-2.55, -6.55, 0], radius=0.13, color=self.C["blue"]),
            Dot([-1.85, -6.9, 0], radius=0.13, color=self.C["blue"]),
            Dot([-1.15, -6.55, 0], radius=0.13, color=self.C["blue"]),
        )
        evidence_title = Text("EVIDENCE", font_size=21, weight=BOLD, color="#BFDBFE").move_to([-1.85, -7.35, 0])
        evidence_links = VGroup(
            self.link(research, evidence[0], self.C["blue"], 2, 0.7),
            self.link(research, evidence[1], self.C["blue"], 2, 0.7),
            self.link(research, evidence[2], self.C["blue"], 2, 0.7),
        )
        play(FadeIn(evidence, scale=0.4), FadeIn(evidence_title, shift=UP * 0.2), Create(evidence_links), run_time=0.75)

        for d in evidence:
            self.play(MoveAlongPath(Dot(research.get_center(), radius=0.07, color=self.C["blue"]),
                                    Line(research.get_center(), d.get_center()), rate_func=smooth), run_time=0.3)

        wait_until(19.7)

        # ------------------------------------------------------------------
        # Beat 6 — 19.7–24.9
        # "And the plan can keep transforming until it becomes a real result."
        # ------------------------------------------------------------------
        play(
            FadeOut(next_label),
            FadeOut(causal),
            FadeOut(branch),
            FadeOut(goal),
            FadeOut(context),
            FadeOut(limits),
            FadeOut(examples),
            FadeOut(explain),
            FadeOut(build),
            FadeOut(spec_label),
            FadeOut(research),
            run_time=0.65,
        )

        action = self.node("ACTION", self.C["green"], [0, -1.0, 0], 1.12, 27)
        action_title = Text("EVIDENCE → ACTION", font_size=34, weight=BOLD, color=self.C["white"])
        action_title.move_to([0, 6.6, 0])

        play(FadeIn(action_title, shift=DOWN * 0.2), FadeIn(action, scale=0.7), run_time=0.6)

        play(
            evidence[0].animate.move_to([-1.35, 2.0, 0]),
            evidence[1].animate.move_to([0, 2.55, 0]),
            evidence[2].animate.move_to([1.35, 2.0, 0]),
            evidence_title.animate.move_to([0, 3.4, 0]),
            run_time=0.9,
        )

        action_links = VGroup(
            self.link(evidence[0], action, self.C["green"], 3, 0.8),
            self.link(evidence[1], action, self.C["green"], 3, 0.8),
            self.link(evidence[2], action, self.C["green"], 3, 0.8),
        )
        play(Create(action_links), run_time=0.55)

        action_words = VGroup(
            Text("compare", font_size=25, color="#A7F3D0"),
            Text("decide", font_size=25, color="#A7F3D0"),
            Text("build", font_size=25, color="#A7F3D0"),
        ).arrange(RIGHT, buff=0.5).move_to([0, -3.0, 0])

        play(FadeIn(action_words, shift=UP * 0.2), run_time=0.45)

        self.play(
            evidence[1].animate.scale(1.25),
            action.animate.scale(1.08),
            run_time=0.5,
        )
        elapsed += 0.5

        wait_until(24.9)

        # ------------------------------------------------------------------
        # Beat 7 — 24.9–27.4
        # "The important part is not decoration."
        # ------------------------------------------------------------------
        play(
            FadeOut(action_title),
            FadeOut(action_words),
            FadeOut(action_links),
            FadeOut(evidence),
            FadeOut(evidence_title),
            run_time=0.5,
        )

        principle = Text("NOT DECORATION.", font_size=56, weight=BOLD, color=self.C["amber"])
        principle.move_to([0, 5.8, 0])

        causal_text = Text("CAUSE  →  TRANSFORMATION  →  RESULT", font_size=29, weight=BOLD, color=self.C["white"])
        causal_text.set_width(9.2)
        causal_text.move_to([0, 1.2, 0])

        arrow1 = Arrow([-3.5, -0.4, 0], [-0.7, -0.4, 0], color=self.C["cyan"], stroke_width=5)
        arrow2 = Arrow([0.7, -0.4, 0], [3.5, -0.4, 0], color=self.C["green"], stroke_width=5)

        play(FadeIn(principle, shift=UP * 0.2), FadeIn(causal_text, shift=UP * 0.2), GrowArrow(arrow1), GrowArrow(arrow2), run_time=0.8)
        wait_until(27.4)

        # ------------------------------------------------------------------
        # Beat 8 — 27.4–30.0
        # "Every movement should explain a relationship."
        # ------------------------------------------------------------------
        closing = Text(
            "Every movement should explain a relationship.",
            font_size=42,
            weight=BOLD,
            color=self.C["white"],
        )
        closing.set_width(9.4)
        closing.move_to([0, 6.0, 0])

        chain = VGroup(
            Text("INPUT", font_size=24, weight=BOLD, color=self.C["muted"]),
            Text("→", font_size=29, color=self.C["line"]),
            Text("STRUCTURE", font_size=24, weight=BOLD, color=self.C["white"]),
            Text("→", font_size=29, color=self.C["line"]),
            Text("ACTION", font_size=24, weight=BOLD, color=self.C["green"]),
            Text("→", font_size=29, color=self.C["line"]),
            Text("RESULT", font_size=24, weight=BOLD, color=self.C["cyan"]),
        ).arrange(RIGHT, buff=0.18).move_to([0, -2.3, 0])

        play(FadeOut(principle), FadeOut(causal_text), FadeOut(arrow1), FadeOut(arrow2), FadeIn(closing, shift=DOWN * 0.2), FadeIn(chain, shift=UP * 0.2), run_time=0.8)

        pulse = Dot([-3.9, -2.3, 0], radius=0.11, color=self.C["cyan"])
        self.add(pulse)
        play(MoveAlongPath(pulse, Line([-3.9, -2.3, 0], [3.9, -2.3, 0]), rate_func=smooth), run_time=0.9)
        self.remove(pulse)

        self.camera.frame.animate.set_width(10.0)
        play(action.animate.scale(1.08), run_time=0.3)
        wait_until(30.0)
