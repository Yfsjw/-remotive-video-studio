from manim import *
import numpy as np

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_rate = 30
config.background_color = "#07070A"

class Scene01(Scene):
    def make_document(self, x, y, scale=1.0, rotation=0):
        paper = RoundedRectangle(
            corner_radius=0.08, width=1.45, height=1.9,
            stroke_width=2, stroke_color=WHITE,
            fill_color="#15171D", fill_opacity=1
        ).scale(scale).rotate(rotation)
        paper.move_to([x, y, 0])
        lines = VGroup(
            Line(LEFT * 0.43, RIGHT * 0.43, stroke_width=3),
            Line(LEFT * 0.43, RIGHT * 0.43, stroke_width=3),
            Line(LEFT * 0.30, RIGHT * 0.30, stroke_width=3),
        ).arrange(DOWN, buff=0.18).scale(scale)
        lines.set_stroke(opacity=0.45)
        lines.move_to(paper.get_center() + DOWN * 0.1)
        return VGroup(paper, lines)

    def construct(self):
        docs = VGroup()
        positions = [
            (-3.9,4.9,.72,-.18),(-1.9,5.7,.62,.12),(0.1,4.6,.68,-.10),
            (2.0,5.5,.58,.18),(3.8,4.4,.70,-.14),(-3.2,2.5,.60,.14),
            (-.8,2.9,.65,-.16),(1.5,2.4,.58,.10),(3.6,2.7,.63,-.20),
            (-4.0,.3,.56,.16),(-1.8,.2,.66,-.10),(.5,.6,.60,.15),
            (2.6,.1,.64,-.12),(4.0,.8,.54,.18)
        ]
        for x,y,s,r in positions:
            docs.add(self.make_document(x,y,s,r))

        signal_lines = VGroup()
        rng = np.random.default_rng(7)
        for _ in range(34):
            start = np.array([rng.uniform(-5.2,5.2), rng.uniform(-7.0,7.0), 0])
            end = start + np.array([rng.uniform(-.35,.35), rng.uniform(-.35,.35), 0])
            signal_lines.add(Line(start,end,stroke_width=rng.uniform(1,2.5),color=WHITE).set_opacity(.18))

        self.play(
            LaggedStart(*[FadeIn(d,shift=UP*.18) for d in docs],lag_ratio=.035,run_time=1.15),
            Create(signal_lines,run_time=1.0)
        )

        filter_ring = Circle(radius=1.35,stroke_color="#38BDF8",stroke_width=5).move_to(DOWN*.15)
        filter_glow = Circle(radius=1.62,stroke_color="#38BDF8",stroke_width=2,stroke_opacity=.18).move_to(filter_ring)
        self.play(Create(filter_ring),Create(filter_glow),run_time=.65)

        targets=[]
        for i in range(len(docs)):
            angle=(i/len(docs))*TAU
            targets.append(filter_ring.get_center()+2.05*np.array([np.cos(angle),np.sin(angle),0]))

        self.play(
            *[d.animate.move_to(target).scale(.72).rotate((-.15 if i%2 else .15))
              for i,(d,target) in enumerate(zip(docs,targets))],
            signal_lines.animate.set_opacity(.05),
            run_time=1.15, rate_func=smooth
        )

        self.play(
            *[FadeOut(d,scale=.7) for d in docs],
            FadeOut(signal_lines), FadeOut(filter_glow), run_time=.55
        )

        core=Circle(radius=.72,fill_color="#38BDF8",fill_opacity=1,stroke_color=WHITE,stroke_width=3)
        inner=Circle(radius=.34,fill_color=WHITE,fill_opacity=1,stroke_width=0)
        core_group=VGroup(core,inner)
        rays=VGroup()
        for angle in np.linspace(0,TAU,12,endpoint=False):
            start=.98*np.array([np.cos(angle),np.sin(angle),0])
            end=1.42*np.array([np.cos(angle),np.sin(angle),0])
            rays.add(Line(start,end,stroke_color="#38BDF8",stroke_width=5))

        self.play(FadeOut(filter_ring),GrowFromCenter(core_group),Create(rays),run_time=.7)
        self.play(core.animate.scale(1.08),rays.animate.scale(1.12),run_time=.45,rate_func=there_and_back)
        self.wait(.2)
