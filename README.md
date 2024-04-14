# Uber Sketch Repo

Ideas for the web start here and spin out if they get large enough

Planning on making this a web site with "experimental" sketches for my portfolio

## Making a new SKETCH
Sketches are small ideas that don't need thi.ng or other such libraries

    $ cd sketches
    $ npx canvas-sketch-cli sketches/sketch.js --new --open

## Making a new PROJECT
Projects are more sizable, and can include a modern bundling system.
Most things are projects these days.
I've made a nice template with a Sketch class and some light UI for params

> Copy `projects/_template` and modify as needed    

## Shared Libraries
As I begin to reuse code, I'll lift them up into the lib directory at the root of this project
Eventually some of its should be spun out into its own Node packages
