# Scripted Objects

Manim interactive allows scripting custom objects in Python using the underlying `manim` library.

## Basics of Object Scripting

Scripts must have a member called `scripted_object` that can be imported from elsewhere. For example, your script might simply be:

```python
scripted_object = Circle(radius = 2, stroke_color = RED)
```

## Utility Functions

All scripts can import from `manim_interactive`, including the `get_object` function, which returns the object with the given name:

```python
from manim import *
from manim_interactive import get_object

scripted_object = Circle(radius = get_object("Other Circle").radius, stroke_color = RED)
```

Another useful function is `get_variable`, which returns the value of the variable with the given name:

```python
from manim import *
from manim_interactive import get_variable

scripted_object = Circle(radius = get_variable("Special Radius"), stroke_color = RED)
```

Variables and objects should not be modified in object scripts, because they are loaded in an unpredictable order, before the animation even begins. To modify them, use a scripted animation.

## Libraries

Object scripts can use external libraries. First, add the library to the project in the project's settings. Then they can be safely used in object scripts.