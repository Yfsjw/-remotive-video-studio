from manim import *

config.background_color = "#07070A"
config.frame_rate = 30
config.pixel_width = 1080
config.pixel_height = 1920


class RemotiveV4(Scene):
    def make_word(self, text, color=WHITE, size=0.62):
        return Text(text, font_size=int(size * 100), color=color, weight=BOLD)

    def construct(self):
        # 0–4s: hook — words are deliberately scattered, then organized.
        hook = Text("A good prompt starts as a mess.", font_size=64, weight=BOLD)
        hook.set_width(8.7)
        hook.to_edge(UP, buff=1.15)
        self.play(Write(hook), run_time=1.0)

        words = VGroup(
            self.make_word("goal", "#38BDF8").move_to([-2.8, 1.0, 0]),
            self.make_word("context", "#A78BFA").move_to([2.3, 0.8, 0]),
            self.make_word("constraints", "#F59E0B").move_to([-1.8, -0.8, 0]),
            self.make_word("examples", "#22C55E").move_to([2.2, -1.1, 0]),
            self.make_word("questions", "#FB7185").move_to([0.1, 0.1, 0]),
        )
        for mob in words:
            mob.set_opacity(0)
        self.play(
            LaggedStart(*[FadeIn(w, shift=0.35 * UP) for w in words], lag_ratio=0.12),
            run_time=1.8,
        )

        target = VGroup(
            SurroundingRectangle(
                VGroup(
                    words[0].copy().scale(0.78),
                    words[1].copy().scale(0.78),
                    words[2].copy().scale(0.78),
                    words[3].copy().scale(0.78),
                ),
                color="#38BDF8",
                corner_radius=0.18,
                buff=0.32,
            )
        )
        target[0].move_to([0, -0.1, 0])
        self.play(
            words[0].animate.move_to([-1.65, 0.65, 0]).scale(0.78),
            words[1].animate.move_to([1.65, 0.65, 0]).scale(0.78),
            words[2].animate.move_to([-1.65, -0.65, 0]).scale(0.78),
            words[3].animate.move_to([1.65, -0.65, 0]).scale(0.78),
            words[4].animate.move_to([0, 2.1, 0]).set_opacity(0),
            run_time=1.3,
        )
        self.play(Create(target[0]), run_time=0.7)
        self.wait(1.0)

        # 4–11s: transform the idea into a structured plan.
        plan_title = Text("STRUCTURE", font_size=48, color="#38BDF8", weight=BOLD)
        plan_title.move_to([0, 3.25, 0])
        self.play(
            FadeOut(hook, shift=UP * 0.25),
            Transform(target[0], SurroundingRectangle(
                VGroup(words[0], words[1], words[2], words[3]),
                color="#38BDF8",
                corner_radius=0.18,
                buff=0.30,
            )),
            FadeIn(plan_title, shift=DOWN * 0.25),
            run_time=0.9,
        )

        steps = VGroup(
            Text("1. Define the goal", font_size=43),
            Text("2. Add the context", font_size=43),
            Text("3. Set the constraints", font_size=43),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.34)
        steps.set_width(8.2)
        steps.move_to([0, -0.15, 0])

        self.play(
            LaggedStart(
                *[TransformFromCopy(words[i], steps[j]) for j, i in enumerate([0, 1, 2])],
                lag_ratio=0.28,
            ),
            run_time=2.6,
        )

        arrow = Arrow(
            start=[0, -2.0, 0],
            end=[0, -2.85, 0],
            color="#38BDF8",
            stroke_width=5,
        )
        result = Text("NOW IT CAN ACT", font_size=54, color=WHITE, weight=BOLD)
        result.move_to([0, -3.35, 0])
        self.play(GrowArrow(arrow), FadeIn(result, shift=UP * 0.2), run_time=1.0)
        self.wait(2.5)

        # 11–18s: camera-like reframing and transformation into output.
        frame_box = RoundedRectangle(
            width=8.7, height=4.2, corner_radius=0.25,
            stroke_color="#A78BFA", stroke_width=3,
            fill_color="#11111A", fill_opacity=0.92,
        )
        frame_box.move_to([0, 0.0, 0])
        header = Text("RESEARCH PLAN", font_size=42, color="#A78BFA", weight=BOLD)
        header.move_to([0, 1.45, 0])
        bullets = VGroup(
            Text("Compare options", font_size=35),
            Text("Find missing evidence", font_size=35),
            Text("Choose the next action", font_size=35),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.28)
        bullets.move_to([0, -0.2, 0])
        check = VGroup(*[
            Circle(radius=0.10, color="#22C55E", fill_opacity=1).next_to(b, LEFT, buff=0.25)
            for b in bullets
        ])

        self.play(
            FadeOut(VGroup(target, plan_title, steps, arrow, result), shift=DOWN * 0.2),
            Create(frame_box),
            FadeIn(header, shift=UP * 0.25),
            run_time=1.0,
        )
        self.play(
            LaggedStart(
                *[FadeIn(m, shift=RIGHT * 0.3) for m in bullets],
                lag_ratio=0.18,
            ),
            LaggedStart(
                *[Create(c) for c in check],
                lag_ratio=0.18,
            ),
            run_time=2.4,
        )
        self.wait(4.0)

        # 18–24s: transform plan into a concrete artifact.
        code_box = RoundedRectangle(
            width=9.0, height=4.6, corner_radius=0.25,
            stroke_color="#F59E0B", stroke_width=3,
            fill_color="#0D0E12", fill_opacity=0.96,
        )
        code_header = Text("WORKING DRAFT", font_size=42, color="#F59E0B", weight=BOLD)
        code_header.move_to([0, 1.55, 0])
        code = VGroup(
            Text("input  →  plan", font_size=34, font="DejaVu Sans Mono"),
            Text("plan   →  draft", font_size=34, font="DejaVu Sans Mono"),
            Text("draft  →  result", font_size=34, font="DejaVu Sans Mono"),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.32)
        code.move_to([0, -0.25, 0])

        self.play(
            Transform(frame_box, code_box),
            Transform(header, code_header),
            Transform(bullets, code),
            FadeOut(check),
            run_time=1.4,
        )
        self.wait(2.5)

        # 24–30s: pull back and reveal the whole pipeline.
        pipeline = VGroup(
            Text("MESS", font_size=42, color="#FB7185", weight=BOLD),
            Text("→", font_size=48),
            Text("STRUCTURE", font_size=42, color="#38BDF8", weight=BOLD),
            Text("→", font_size=48),
            Text("DRAFT", font_size=42, color="#F59E0B", weight=BOLD),
            Text("→", font_size=48),
            Text("RESULT", font_size=42, color="#22C55E", weight=BOLD),
        ).arrange(RIGHT, buff=0.20)
        pipeline.set_width(10.0)
        pipeline.move_to([0, -2.9, 0])

        caption = Text("The visual should explain the idea — not decorate it.", font_size=40)
        caption.set_width(9.3)
        caption.move_to([0, 3.0, 0])

        self.play(
            FadeOut(code_header),
            FadeOut(code),
            FadeOut(frame_box),
            FadeIn(pipeline, shift=UP * 0.3),
            FadeIn(caption, shift=DOWN * 0.3),
            run_time=1.2,
        )
        self.play(
            pipeline.animate.scale(1.08),
            run_time=0.8,
        )
        self.wait(3.9)
