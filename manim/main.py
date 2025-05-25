from manim import *

class Main(Scene):
	def construct(self):
		text = Circle(radius = 3, stroke_width = 15)
		self.add(text)
		self.play(Blink(text, blinks = 3))
		self.wait(1)