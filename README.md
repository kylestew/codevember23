# Uber Sketch Repo

Ideas for the web start here and spin out if they get large enough

Planning on making this a web site with "experimental" sketches for my portfolio

## Making a new SKETCH
Sketches use self contained library, all code written by me
Vite is used as a build tool, but no packages are required (except TS for now, need ot remove)

## Making a new PROJECT
Projects are more sizable, and can include a modern bundling system.
Most things are projects these days.
I've made a nice template with a Sketch class and some light UI for params

> Copy `projects/_template` and modify as needed    

## Shared Libraries
As I begin to reuse code, I'll lift them up into the lib directory at the root of this project
Eventually some of its should be spun out into its own Node packages
python list_exports.py tools

## Updating Documentation

    $ python list_exports.py tools >> TOOLS.md