from manim import *

config.background_color = "#05070B"
config.frame_rate = 30
config.pixel_width = 1080
config.pixel_height = 1920


class RemotiveV5(MovingCameraScene):
    """
    V5: storyboard-first explanatory video.
    The visuals are concrete metaphors rather than a generic node graph:
    broken prompt -> structured brief -> context split -> constraints -> examples
    -> action -> finished result.
    """

    C = {
        "bg": "#05070B",
        "white": "#F8FAFC",
        "muted": "#94A3B8",
        "cyan": "#38BDF8",
        "violet": "#A78BFA",
        "amber": "#F59E0B",
        "green": "#34D399",
        "red": "#FB7185",
        "blue": "#60A5FA",
        "panel": "#0D141F",
        "panel2": "#111B29",
        "line": "#334155",
    }

    BEATS = [0, 3.4, 7.5, 12.0, 16.5, 21.0, 26.0, 30.0]

    def txt(self, s, size=30, color=None, bold=True):
        return Text(
            s,
            font_size=size,
            color=color or self.C["white"],
            weight=BOLD if bold else NORMAL,
        )

    def card(self, w, h, title=None, accent=None, fill=None):
        box = RoundedRectangle(
            corner_radius=0.18,
            width=w,
            height=h,
            stroke_color=accent or self.C["line"],
            stroke_width=2.5,
            fill_color=fill or self.C["panel"],
            fill_opacity=1,
        )
        if title:
            t = self.txt(title, 22, accent or self.C["white"])
            t.move_to(box.get_top() + DOWN * 0.38)
            return VGroup(box, t)
        return box

    def pill(self, label, color, w=2.0):
        box = RoundedRectangle(
            corner_radius=0.18,
            width=w,
            height=0.62,
            stroke_color=color,
            stroke_width=2,
            fill_color=color,
            fill_opacity=0.12,
        )
        t = self.txt(label, 20, color)
        t.move_to(box.get_center())
        return VGroup(box, t)

    def word_token(self, label, point, color):
        box = RoundedRectangle(
            corner_radius=0.12,
            width=max(1.25, 0.13 * len(label) + 0.75),
            height=0.58,
            stroke_color=color,
            stroke_width=2,
            fill_color=self.C["panel2"],
            fill_opacity=1,
        ).move_to(point)
        t = self.txt(label, 19, color)
        t.move_to(box.get_center())
        return VGroup(box, t)

    def tiny_line(self, x, y, width, color=None):
        return Line(
            [x, y, 0],
            [x + width, y, 0],
            color=color or self.C["line"],
            stroke_width=4,
            stroke_opacity=0.85,
        )

    def flow_dot(self, start, end, color, run_time=0.35):
        d = Dot(start, radius=0.075, color=color)
        self.add(d)
        self.play(d.animate.move_to(end), run_time=run_time, rate_func=smooth)
        self.remove(d)

    def construct(self):
        self.camera.frame.set_width(10.5)
        elapsed = 0.0

        def play(*anims, run_time):
            nonlocal elapsed
            self.play(*anims, run_time=run_time)
            elapsed += run_time

        def wait_until(target):
            nonlocal elapsed
            if target > elapsed:
                self.wait(target - elapsed)
                elapsed = target

        # ---------------------------------------------------------------
        # 0.0–3.4 — HOOK: show the problem as an object, not a diagram.
        # ---------------------------------------------------------------
        eyebrow = self.txt("THE HIDDEN PROBLEM", 21, self.C["muted"])
        eyebrow.move_to([0, 8.0, 0])

        hook = self.txt("Most prompts fail\nbefore AI answers.", 55)
        hook.set_width(8.9)
        hook.move_to([0, 5.9, 0])

        sheet = RoundedRectangle(
            corner_radius=0.22, width=7.5, height=4.2,
            stroke_color=self.C["red"], stroke_width=3,
            fill_color=self.C["panel"], fill_opacity=1,
        ).move_to([0, -1.0, 0]).rotate(-0.035)

        messy = VGroup(
            self.word_token("goal?", [-2.4, 0.0, 0], self.C["muted"]),
            self.word_token("context", [0.5, 0.8, 0], self.C["violet"]),
            self.word_token("do this", [-1.2, -1.0, 0], self.C["white"]),
            self.word_token("maybe", [2.1, -0.2, 0], self.C["amber"]),
            self.word_token("examples...", [0.8, -1.7, 0], self.C["muted"]),
        )
        mess = VGroup(sheet, messy)

        x1 = Line([-3.0, -2.55, 0], [3.0, 0.65, 0], color=self.C["red"], stroke_width=7)
        x2 = Line([-3.0, 0.65, 0], [3.0, -2.55, 0], color=self.C["red"], stroke_width=7)

        play(FadeIn(eyebrow, shift=DOWN * .2), FadeIn(hook, shift=UP * .25), run_time=0.8)
        play(FadeIn(mess, shift=UP * .25), run_time=0.8)
        play(Create(x1), Create(x2), run_time=0.55)
        wait_until(3.4)

        # ---------------------------------------------------------------
        # 3.4–7.5 — TRANSFORMATION: chaos becomes a usable brief.
        # ---------------------------------------------------------------
        title = self.txt("Turn words into a brief.", 40)
        title.move_to([0, 7.2, 0])

        brief = RoundedRectangle(
            corner_radius=0.22, width=8.7, height=8.4,
            stroke_color=self.C["cyan"], stroke_width=3,
            fill_color=self.C["panel"], fill_opacity=1,
        ).move_to([0, -0.5, 0])

        header = self.txt("PROMPT / BRIEF", 25, self.C["cyan"])
        header.move_to([-2.7, 3.15, 0])

        sections = VGroup(
            self.pill("GOAL", self.C["cyan"], 1.65),
            self.pill("CONTEXT", self.C["violet"], 2.0),
            self.pill("CONSTRAINTS", self.C["amber"], 2.35),
            self.pill("EXAMPLES", self.C["green"], 2.0),
        ).arrange(DOWN, buff=0.48).move_to([-2.65, 0.3, 0])

        details = VGroup(
            self.tiny_line(-0.9, 2.0, 4.3, self.C["cyan"]),
            self.tiny_line(-0.9, 1.2, 3.7),
            self.tiny_line(-0.9, 0.4, 4.0),
            self.tiny_line(-0.9, -0.4, 3.2),
            self.tiny_line(-0.9, -1.2, 4.2),
            self.tiny_line(-0.9, -2.0, 3.5),
        )

        output = RoundedRectangle(
            corner_radius=0.18, width=6.4, height=1.2,
            stroke_color=self.C["green"], stroke_width=2.5,
            fill_color=self.C["green"], fill_opacity=.10,
        ).move_to([0, -3.25, 0])
        output_text = self.txt("CLEAR INPUT → BETTER OUTPUT", 25, self.C["green"])
        output_text.move_to(output.get_center())

        play(
            FadeOut(eyebrow), FadeOut(hook), FadeOut(mess), FadeOut(x1), FadeOut(x2),
            FadeIn(title, shift=DOWN*.2), FadeIn(brief, scale=.94),
            run_time=.85,
        )
        play(FadeIn(header), FadeIn(sections, shift=RIGHT*.25), FadeIn(details), run_time=.75)
        play(FadeIn(output, shift=UP*.2), FadeIn(output_text), run_time=.5)

        # Animate information entering the brief.
        for src, dst, col in [
            ([-3.7, -6.0, 0], [-1.8, 1.5, 0], self.C["cyan"]),
            ([3.7, -6.0, 0], [-1.8, .0, 0], self.C["violet"]),
            ([-3.7, 6.0, 0], [-1.8, -1.5, 0], self.C["amber"]),
        ]:
            self.flow_dot(src, dst, col, .25)
        wait_until(7.5)

        # ---------------------------------------------------------------
        # 7.5–12.0 — CONTEXT: same request, different world.
        # ---------------------------------------------------------------
        context_title = self.txt("Context changes the answer.", 40)
        context_title.move_to([0, 7.25, 0])

        question = RoundedRectangle(
            corner_radius=.16, width=8.2, height=1.15,
            stroke_color=self.C["white"], stroke_width=2,
            fill_color=self.C["panel2"], fill_opacity=1,
        ).move_to([0, 5.3, 0])
        qtext = self.txt("“Write a launch post for this product.”", 25)
        qtext.move_to(question.get_center())

        left = self.card(3.9, 5.6, "STARTUP", self.C["violet"])
        left.move_to([-2.35, 0.6, 0])
        left_body = VGroup(
            self.txt("audience: founders", 19, self.C["muted"]),
            self.txt("tone: technical", 19, self.C["muted"]),
            self.txt("goal: sign-ups", 19, self.C["violet"]),
        ).arrange(DOWN, aligned_edge=LEFT, buff=.38).move_to(left.get_center()+DOWN*.2)

        right = self.card(3.9, 5.6, "CONSUMER", self.C["amber"])
        right.move_to([2.35, 0.6, 0])
        right_body = VGroup(
            self.txt("audience: gamers", 19, self.C["muted"]),
            self.txt("tone: energetic", 19, self.C["muted"]),
            self.txt("goal: clicks", 19, self.C["amber"]),
        ).arrange(DOWN, aligned_edge=LEFT, buff=.38).move_to(right.get_center()+DOWN*.2)

        out_l = self.pill("technical / precise", self.C["violet"], 3.0).move_to([-2.35, -3.15, 0])
        out_r = self.pill("visual / punchy", self.C["amber"], 2.7).move_to([2.35, -3.15, 0])

        play(
            FadeOut(title), FadeOut(brief), FadeOut(header), FadeOut(sections),
            FadeOut(details), FadeOut(output), FadeOut(output_text),
            FadeIn(context_title, shift=DOWN*.2), FadeIn(question, shift=UP*.15),
            run_time=.8,
        )
        play(FadeIn(left, shift=RIGHT*.25), FadeIn(right, shift=LEFT*.25),
             FadeIn(left_body), FadeIn(right_body), run_time=.8)
        play(FadeIn(out_l, shift=UP*.2), FadeIn(out_r, shift=UP*.2), run_time=.5)
        self.flow_dot(question.get_right(), right.get_top(), self.C["amber"], .3)
        self.flow_dot(question.get_left(), left.get_top(), self.C["violet"], .3)
        wait_until(12.0)

        # ---------------------------------------------------------------
        # 12.0–16.5 — CONSTRAINTS: narrow the infinite answer space.
        # ---------------------------------------------------------------
        ctitle = self.txt("Constraints remove noise.", 40)
        ctitle.move_to([0, 7.25, 0])

        funnel = VGroup(
            Polygon(
                [-3.5, 3.4, 0], [3.5, 3.4, 0], [1.25, -1.8, 0], [-1.25, -1.8, 0],
                color=self.C["amber"], stroke_width=3, fill_color=self.C["panel"], fill_opacity=1,
            ),
            self.txt("INFINITE OPTIONS", 24, self.C["muted"]).move_to([0, 2.55, 0]),
            self.txt("FORMAT", 20, self.C["amber"]).move_to([0, 1.2, 0]),
            self.txt("LENGTH", 20, self.C["amber"]).move_to([0, .3, 0]),
            self.txt("AUDIENCE", 20, self.C["amber"]).move_to([0, -.6, 0]),
        )

        constraints = VGroup(
            self.pill("9:16", self.C["cyan"], 1.45),
            self.pill("30 sec", self.C["violet"], 1.65),
            self.pill("ONE IDEA", self.C["green"], 2.0),
        ).arrange(RIGHT, buff=.35).move_to([0, -3.25, 0])

        result = self.card(7.2, 1.65, None, self.C["green"], self.C["panel2"])
        result.move_to([0, -5.0, 0])
        result_text = self.txt("ONE CLEAR DELIVERABLE", 27, self.C["green"])
        result_text.move_to(result.get_center())

        play(
            FadeOut(context_title), FadeOut(question), FadeOut(left), FadeOut(right),
            FadeOut(left_body), FadeOut(right_body), FadeOut(out_l), FadeOut(out_r),
            FadeIn(ctitle, shift=DOWN*.2), FadeIn(funnel, shift=UP*.2), run_time=.8,
        )
        play(FadeIn(constraints, shift=UP*.2), run_time=.5)
        play(FadeIn(result, shift=UP*.2), FadeIn(result_text), run_time=.55)
        for p in [constraints[0].get_center(), constraints[1].get_center(), constraints[2].get_center()]:
            self.flow_dot(p, [0, -4.15, 0], self.C["green"], .22)
        wait_until(16.5)

        # ---------------------------------------------------------------
        # 16.5–21.0 — EXAMPLES: show, don't merely describe.
        # ---------------------------------------------------------------
        etitle = self.txt("Examples teach the behavior.", 40)
        etitle.move_to([0, 7.25, 0])

        refs = VGroup(
            self.card(2.65, 3.2, "REFERENCE A", self.C["cyan"]),
            self.card(2.65, 3.2, "REFERENCE B", self.C["violet"]),
            self.card(2.65, 3.2, "REFERENCE C", self.C["green"]),
        ).arrange(RIGHT, buff=.35).move_to([0, 2.2, 0])

        # Each reference contains a distinct visual rhythm.
        for i, r in enumerate(refs):
            y = r.get_center()[1]
            x = r.get_center()[0]
            bars = VGroup(
                Rectangle(width=.28, height=1.0 + .25*i, fill_opacity=1,
                          fill_color=[self.C["cyan"], self.C["violet"], self.C["green"]][i],
                          stroke_width=0),
                Rectangle(width=.28, height=.55 + .18*i, fill_opacity=1,
                          fill_color=self.C["white"], stroke_width=0),
                Rectangle(width=.28, height=.82, fill_opacity=1,
                          fill_color=self.C["muted"], stroke_width=0),
            ).arrange(RIGHT, buff=.18).move_to([x, y-.35, 0])
            r.add(bars)

        arrows = VGroup(
            Arrow([-3.0, -1.0, 0], [3.0, -1.0, 0], color=self.C["line"], stroke_width=5),
        )
        learned = self.card(6.6, 2.0, "LEARNED PATTERN", self.C["green"], self.C["panel2"])
        learned.move_to([0, -3.2, 0])
        learned_text = self.txt("STYLE + STRUCTURE + RHYTHM", 25, self.C["green"])
        learned_text.move_to(learned.get_center())

        play(
            FadeOut(ctitle), FadeOut(funnel), FadeOut(constraints), FadeOut(result), FadeOut(result_text),
            FadeIn(etitle, shift=DOWN*.2), FadeIn(refs, shift=UP*.25), run_time=.85,
        )
        play(GrowArrow(arrows[0]), run_time=.45)
        play(FadeIn(learned, shift=UP*.25), FadeIn(learned_text), run_time=.6)
        for r in refs:
            self.flow_dot(r.get_bottom(), learned.get_top(), self.C["green"], .25)
        wait_until(21.0)

        # ---------------------------------------------------------------
        # 21.0–26.0 — ACTION: turn the brief into a decision and result.
        # ---------------------------------------------------------------
        atitle = self.txt("Now the system can act.", 40)
        atitle.move_to([0, 7.25, 0])

        spec = self.card(8.0, 2.1, "SPECIFICATION", self.C["white"])
        spec.move_to([0, 4.3, 0])
        spec_lines = VGroup(
            self.txt("goal + context + constraints + examples", 23, self.C["white"]),
            self.txt("→ a sequence of deliberate actions", 23, self.C["green"]),
        ).arrange(DOWN, buff=.35).move_to(spec.get_center()+DOWN*.1)

        actions = VGroup(
            self.card(2.25, 2.4, "RESEARCH", self.C["blue"]),
            self.card(2.25, 2.4, "EXPLAIN", self.C["violet"]),
            self.card(2.25, 2.4, "BUILD", self.C["amber"]),
        ).arrange(RIGHT, buff=.45).move_to([0, .55, 0])

        result2 = self.card(7.4, 1.65, "RESULT", self.C["green"], self.C["green"])
        result2.move_to([0, -3.15, 0])
        result2_text = self.txt("A SPECIFIC, USEFUL OUTPUT", 26, self.C["green"])
        result2_text.move_to(result2.get_center())

        play(
            FadeOut(etitle), FadeOut(refs), FadeOut(arrows), FadeOut(learned), FadeOut(learned_text),
            FadeIn(atitle, shift=DOWN*.2), FadeIn(spec, shift=UP*.2), FadeIn(spec_lines),
            run_time=.85,
        )
        play(FadeIn(actions, shift=UP*.25), run_time=.65)
        # Selection is visual: research lights, then the output is produced.
        play(actions[0].animate.scale(1.12), actions[1].animate.set_opacity(.35),
             actions[2].animate.set_opacity(.35), run_time=.45)
        self.flow_dot(spec.get_bottom(), actions[0].get_top(), self.C["blue"], .3)
        play(FadeIn(result2, shift=UP*.2), FadeIn(result2_text), run_time=.55)
        self.flow_dot(actions[0].get_bottom(), result2.get_top(), self.C["green"], .3)
        wait_until(26.0)

        # ---------------------------------------------------------------
        # 26.0–30.0 — HERO ENDING: the result is the visual payoff.
        # ---------------------------------------------------------------
        final_kicker = self.txt("THE DIFFERENCE", 21, self.C["muted"])
        final_kicker.move_to([0, 7.95, 0])

        final = self.txt("Don't animate the words.\nAnimate the idea.", 54)
        final.set_width(9.1)
        final.move_to([0, 5.55, 0])

        hero = RoundedRectangle(
            corner_radius=.25, width=8.7, height=5.6,
            stroke_color=self.C["cyan"], stroke_width=3,
            fill_color=self.C["panel"], fill_opacity=1,
        ).move_to([0, -1.2, 0])

        hero_title = self.txt("INPUT → THINKING → RESULT", 27, self.C["cyan"])
        hero_title.move_to([0, .85, 0])

        hero_steps = VGroup(
            self.pill("IDEA", self.C["violet"], 1.55),
            self.txt("→", 28, self.C["muted"]),
            self.pill("STRUCTURE", self.C["amber"], 2.05),
            self.txt("→", 28, self.C["muted"]),
            self.pill("ACTION", self.C["green"], 1.8),
        ).arrange(RIGHT, buff=.22).move_to([0, -.55, 0])

        hero_result = RoundedRectangle(
            corner_radius=.16, width=6.5, height=1.2,
            stroke_color=self.C["green"], stroke_width=2,
            fill_color=self.C["green"], fill_opacity=.10,
        ).move_to([0, -2.45, 0])
        hero_result_text = self.txt("A RESULT THE VIEWER CAN FEEL.", 24, self.C["green"])
        hero_result_text.move_to(hero_result.get_center())

        play(
            FadeOut(atitle), FadeOut(spec), FadeOut(spec_lines), FadeOut(actions),
            FadeOut(result2), FadeOut(result2_text),
            FadeIn(final_kicker, shift=DOWN*.2), FadeIn(final, shift=UP*.2),
            FadeIn(hero, scale=.94), FadeIn(hero_title), FadeIn(hero_steps, shift=UP*.2),
            run_time=.9,
        )
        play(FadeIn(hero_result, shift=UP*.2), FadeIn(hero_result_text), run_time=.55)

        # Camera is part of the final beat, not an afterthought.
        self.play(self.camera.frame.animate.set_width(9.65), run_time=.55)
        elapsed += .55
        wait_until(30.0)
