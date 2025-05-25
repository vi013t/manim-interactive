from manim import *

class Main(Scene):
	def construct(self):
		circle = Circle(stroke_width = 15, radius = 3)
		self.add(circle)
		self.wait(1)
		self.remove(circle)
		self.wait(1)