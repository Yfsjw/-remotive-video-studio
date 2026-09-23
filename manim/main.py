from manim import *

config.background_color = "#07070A"
config.frame_rate = 30
config.pixel_width = 1080
config.pixel_height = 1920


class RemotiveV41(MovingCameraScene):
    """Continuous explanatory animation: the idea changes state instead of changing cards."""

    COLORS = {
        "goal": "#38BDF8",
        "context": "#A78BFA",
        "constraints": "#F59E0B",
        "examples": "#22C55E",
        "core": "#FFFFFF",
        "research": "#60A5FA",
        "explain": "#C084FC",
        "build": "#FBBF24",
        "result": "#34D399",
        "muted": "#64748B",
    }

    def node(self, label, color, position, radius=0.72, font_size=28):
        circle = Circle(
            radius=radius,
            stroke_color=color,
            stroke_width=4,
            fill_color="#0D1016",
            fill_opacity=1,
        )
        circle.move_to(position)
        text = Text(label, font_size=font_size, weight=BOLD)
        text.set_color(color)
        text.move_to(circle.get_center())
        return VGroup(circle, text)

    def connector(self, a, b, color="#475569", width=3, opacity=0.7):
        return always_redraw(
            lambda: Line(
                a.get_center(),
                b.get_center(),
                color=color,
                stroke_width=width,
                stroke_opacity=opacity,
            )
        )

    def pulse(self, position, color):
        return Dot(point=position, radius=0.10, color=color)

    def construct(self):
        # The portrait frame is intentionally used as a tall visual field.
        self.camera.frame.set_width(10.0)

        # ------------------------------------------------------------------
        # 0–5s — A messy input: pieces exist independently.
        # ------------------------------------------------------------------
        eyebrow = Text("THE INPUT", font_size=26, weight=BOLD, color="#94A3B8")
        eyebrow.move_to([0, 8.7, 0])

        hook = Text("A prompt is not a sentence.", font_size=58, weight=BOLD)
        hook.set_width(8.8)
        hook.move_to([0, 7.45, 0])

        sub = Text("It is a system.", font_size=44, weight=BOLD, color="#CBD5E1")
        sub.move_to([0, 6.55, 0])

        goal = self.node("GOAL", self.COLORS["goal"], [-3.5, 3.2, 0], 0.82, 25)
        context = self.node("CONTEXT", self.COLORS["context"], [3.2, 2.4, 0], 0.90, 23)
        constraints = self.node("LIMITS", self.COLORS["constraints"], [-2.6, 0.2, 0], 0.86, 23)
        examples = self.node("EXAMPLES", self.COLORS["examples"], [3.0, -0.6, 0], 0.90, 21)

        for mob in [goal, context, constraints, examples]:
            mob.set_opacity(0)

        self.play(FadeIn(eyebrow, shift=DOWN * 0.2), Write(hook), FadeIn(sub, shift=UP * 0.2), run_time=1.25)
        self.play(
            LaggedStart(
                *[FadeIn(m, shift=0.35 * UP) for m in [goal, context, constraints, examples]],
                lag_ratio=0.16,
            ),
            run_time=2.0,
        )

        loose_links = VGroup(
            self.connector(goal, context, "#334155", 2, 0.35),
            self.connector(context, examples, "#334155", 2, 0.35),
            self.connector(examples, constraints, "#334155", 2, 0.35),
        )
        self.play(Create(loose_links), run_time=0.65)
        self.wait(1.10)

        # ------------------------------------------------------------------
        # 5–11s — The pieces connect into a specification.
        # ------------------------------------------------------------------
        self.play(
            FadeOut(hook, shift=UP * 0.35),
            FadeOut(sub, shift=UP * 0.2),
            eyebrow.animate.move_to([0, 8.6, 0]),
            run_time=0.6,
        )

        center = self.node("SPEC", self.COLORS["core"], [0, 1.65, 0], 1.05, 29)
        center.set_opacity(0)

        target_positions = {
            goal: [-3.15, 3.55, 0],
            context: [3.15, 3.55, 0],
            constraints: [-3.15, -0.45, 0],
            examples: [3.15, -0.45, 0],
        }

        center.set_opacity(1)
        self.play(FadeIn(center, scale=0.7), run_time=0.45)
        self.play(
            *[
                mob.animate.move_to(pos).scale(0.92).set_opacity(1)
                for mob, pos in target_positions.items()
            ],
            run_time=1.15,
        )
        self.play(FadeOut(loose_links), run_time=0.25)

        links = VGroup(
            self.connector(goal, center, self.COLORS["goal"], 4, 0.82),
            self.connector(context, center, self.COLORS["context"], 4, 0.82),
            self.connector(constraints, center, self.COLORS["constraints"], 4, 0.82),
            self.connector(examples, center, self.COLORS["examples"], 4, 0.82),
        )
        self.play(Create(links), run_time=0.9)

        flow = self.pulse(goal.get_center(), self.COLORS["goal"])
        self.add(flow)
        self.play(MoveAlongPath(flow, Line(goal.get_center(), center.get_center()), rate_func=smooth), run_time=0.65)
        self.play(MoveAlongPath(flow, Line(context.get_center(), center.get_center()), rate_func=smooth), run_time=0.65)
        self.play(MoveAlongPath(flow, Line(constraints.get_center(), center.get_center()), rate_func=smooth), run_time=0.65)
        self.play(MoveAlongPath(flow, Line(examples.get_center(), center.get_center()), rate_func=smooth), run_time=0.65)
        self.remove(flow)

        label = Text("CONNECTED", font_size=27, weight=BOLD, color="#E2E8F0")
        label.move_to([0, -2.25, 0])
        self.play(FadeIn(label, shift=UP * 0.25), run_time=0.45)
        self.wait(0.80)

        # ------------------------------------------------------------------
        # 11–17s — The specification branches into possible actions.
        # ------------------------------------------------------------------
        self.play(
            label.animate.move_to([0, 7.1, 0]).scale(0.82),
            self.camera.frame.animate.set_width(11.5),
            run_time=0.8,
        )

        action_research = self.node("RESEARCH", self.COLORS["research"], [-3.45, -1.3, 0], 0.95, 21)
        action_explain = self.node("EXPLAIN", self.COLORS["explain"], [0, -3.4, 0], 0.90, 23)
        action_build = self.node("BUILD", self.COLORS["build"], [3.45, -1.3, 0], 0.88, 24)

        branch_links = VGroup(
            self.connector(center, action_research, self.COLORS["research"], 4, 0.8),
            self.connector(center, action_explain, self.COLORS["explain"], 4, 0.8),
            self.connector(center, action_build, self.COLORS["build"], 4, 0.8),
        )

        question = Text("WHAT DOES THE USER NEED NEXT?", font_size=27, weight=BOLD, color="#94A3B8")
        question.move_to([0, 5.75, 0])

        self.play(FadeIn(question, shift=DOWN * 0.2), run_time=0.4)
        self.play(
            LaggedStart(
                FadeIn(action_research, shift=0.4 * UP),
                FadeIn(action_explain, shift=0.4 * UP),
                FadeIn(action_build, shift=0.4 * UP),
                lag_ratio=0.18,
            ),
            run_time=1.0,
        )
        self.play(Create(branch_links), run_time=0.8)

        selector = self.pulse(center.get_center(), "#FFFFFF")
        self.add(selector)
        self.play(MoveAlongPath(selector, Line(center.get_center(), action_research.get_center()), rate_func=smooth), run_time=0.9)
        self.remove(selector)

        research_ring = Circle(radius=1.24, color=self.COLORS["research"], stroke_width=6)
        research_ring.move_to(action_research.get_center())
        self.play(Create(research_ring), action_research.animate.scale(1.12), run_time=0.65)

        evidence = VGroup(
            Dot([-2.9, -4.25, 0], radius=0.16, color="#93C5FD"),
            Dot([-1.95, -4.75, 0], radius=0.16, color="#BFDBFE"),
            Dot([-1.05, -4.25, 0], radius=0.16, color="#60A5FA"),
        )
        evidence_label = Text("EVIDENCE", font_size=24, weight=BOLD, color="#BFDBFE")
        evidence_label.move_to([-1.95, -5.25, 0])

        self.play(
            LaggedStart(*[FadeIn(d, scale=0.2) for d in evidence], lag_ratio=0.18),
            FadeIn(evidence_label, shift=UP * 0.2),
            run_time=0.9,
        )

        evidence_links = VGroup(
            Line(action_research.get_center(), evidence[0].get_center(), color="#60A5FA", stroke_width=3),
            Line(action_research.get_center(), evidence[1].get_center(), color="#60A5FA", stroke_width=3),
            Line(action_research.get_center(), evidence[2].get_center(), color="#60A5FA", stroke_width=3),
        )
        self.play(Create(evidence_links), run_time=0.5)
        self.wait(0.70)

        # ------------------------------------------------------------------
        # 17–24s — Evidence transforms into an artifact, not another card.
        # ------------------------------------------------------------------
        self.play(
            FadeOut(question, shift=UP * 0.25),
            FadeOut(label, shift=UP * 0.2),
            FadeOut(branch_links),
            FadeOut(research_ring),
            FadeOut(action_explain),
            FadeOut(action_build),
            FadeOut(context),
            FadeOut(constraints),
            FadeOut(examples),
            run_time=0.75,
        )

        # Move the remaining causal chain upward before the transformation.
        self.play(
            center.animate.move_to([0, 4.5, 0]).scale(0.82),
            goal.animate.move_to([-3.6, 2.6, 0]).scale(0.78),
            evidence.animate.shift(DOWN * 0.1),
            evidence_label.animate.shift(DOWN * 0.1),
            run_time=0.75,
        )

        artifact_title = Text("FROM EVIDENCE TO ACTION", font_size=31, weight=BOLD, color="#CBD5E1")
        artifact_title.move_to([0, 7.0, 0])

        action = self.node("ACTION", self.COLORS["result"], [0, -1.5, 0], 1.05, 27)
        action.set_opacity(0)

        action_lines = VGroup(
            Text("compare", font_size=28, color="#A7F3D0"),
            Text("decide", font_size=28, color="#A7F3D0"),
            Text("build", font_size=28, color="#A7F3D0"),
        ).arrange(RIGHT, buff=0.55)
        action_lines.move_to([0, -3.45, 0])
        action_lines.set_opacity(0)

        self.play(FadeIn(artifact_title, shift=DOWN * 0.2), run_time=0.4)
        self.play(
            evidence[0].animate.move_to([-1.25, -0.25, 0]),
            evidence[1].animate.move_to([0, 0.35, 0]),
            evidence[2].animate.move_to([1.25, -0.25, 0]),
            evidence_label.animate.move_to([0, 1.25, 0]),
            run_time=0.9,
        )

        result_links = VGroup(
            Line(evidence[0].get_center(), action.get_center(), color=self.COLORS["result"], stroke_width=3),
            Line(evidence[1].get_center(), action.get_center(), color=self.COLORS["result"], stroke_width=3),
            Line(evidence[2].get_center(), action.get_center(), color=self.COLORS["result"], stroke_width=3),
        )
        self.play(FadeIn(action), Create(result_links), run_time=0.85)
        self.play(
            FadeIn(action_lines, shift=UP * 0.3),
            action.animate.set_opacity(1).scale(1.10),
            run_time=0.75,
        )

        # The original pieces become a small provenance trail.
        provenance = VGroup(
            Text("GOAL", font_size=20, color=self.COLORS["goal"], weight=BOLD),
            Text("→", font_size=24, color="#64748B"),
            Text("SPEC", font_size=20, color="#E2E8F0", weight=BOLD),
            Text("→", font_size=24, color="#64748B"),
            Text("EVIDENCE", font_size=20, color="#93C5FD", weight=BOLD),
            Text("→", font_size=24, color="#64748B"),
            Text("ACTION", font_size=20, color=self.COLORS["result"], weight=BOLD),
        ).arrange(RIGHT, buff=0.16)
        provenance.move_to([0, 6.15, 0])

        self.play(FadeIn(provenance, shift=DOWN * 0.2), run_time=0.45)
        self.wait(0.95)

        # ------------------------------------------------------------------
        # 24–30s — Pull back: one connected system, one causal story.
        # ------------------------------------------------------------------
        self.play(
            self.camera.frame.animate.set_width(10.5).move_to([0, 0.2, 0]),
            run_time=1.25,
        )

        all_chain = VGroup(
            Text("INPUT", font_size=25, weight=BOLD, color="#94A3B8"),
            Text("→", font_size=30, color="#64748B"),
            Text("STRUCTURE", font_size=25, weight=BOLD, color="#E2E8F0"),
            Text("→", font_size=30, color="#64748B"),
            Text("ACTION", font_size=25, weight=BOLD, color=self.COLORS["result"]),
            Text("→", font_size=30, color="#64748B"),
            Text("RESULT", font_size=25, weight=BOLD, color="#F0FDFA"),
        ).arrange(RIGHT, buff=0.18)
        all_chain.move_to([0, -7.5, 0])

        closing = Text(
            "Every movement should explain a relationship.",
            font_size=42,
            weight=BOLD,
        )
        closing.set_width(9.8)
        closing.move_to([0, 8.0, 0])

        self.play(FadeIn(all_chain, shift=UP * 0.25), FadeIn(closing, shift=DOWN * 0.25), run_time=0.8)

        flow_dot = self.pulse(goal.get_center(), self.COLORS["goal"])
        self.add(flow_dot)
        self.play(
            MoveAlongPath(flow_dot, Line(goal.get_center(), center.get_center()), rate_func=smooth),
            run_time=0.55,
        )
        self.play(
            MoveAlongPath(flow_dot, Line(center.get_center(), evidence[1].get_center()), rate_func=smooth),
            run_time=0.55,
        )
        self.play(
            MoveAlongPath(flow_dot, Line(evidence[1].get_center(), action.get_center()), rate_func=smooth),
            run_time=0.55,
        )
        self.remove(flow_dot)

        self.play(
            action.animate.scale(1.08),
            run_time=0.6,
        )
        self.wait(1.55)
