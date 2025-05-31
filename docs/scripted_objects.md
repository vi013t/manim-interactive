# Scripted Objects

Manim interactive allows scripting custom objects.

## Basics of Object Scripting

Each object script will be injected into a function body that returns the object. That means you should write your script as if it's in a function, and `return` the object you create, i.e, this is a valid entire script file:

```python
circle = Circle(radius = 2, stroke_color = RED)

return circle
```

## Getting Other Objects

All object scripts are exposed to an `object()` function that can get an object from the project by it's name. For example:

```python
circle = Circle(radius = object("Other Circle").radius, stroke_color = RED)

return circle
```

## Libraries

Object scripts can use external libraries. First, add the library to the project in the project's settings.