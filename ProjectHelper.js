angular.module('app').service("ProjectHelper", function(DateHelper) {
  var ProjectHelper = {};

  ProjectHelper.findAllPaths = function(projects) {
    var paths = chainProjects(projects);

    var distinctPaths = [];
    paths.forEach(function(path) {
      distinctPaths = distinctPaths.concat(flattenPath(path));
    });

    distinctPaths.forEach(function(path) {
      if (!path[0].startDate) {
        path[0].startDate = new Date();
      }
    });

    return distinctPaths;
  }

  ProjectHelper.getTimeRangeForPaths = function(paths) {
    var criticalPath = ProjectHelper.findCriticalPath(paths);
    var startDate = findEarliestStartDate(paths);
    var endDate = DateHelper.cloneDate(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + criticalPath.days);

    return {
      startDate: startDate,
      endDate: endDate
    }
  }

  ProjectHelper.findCriticalPath = function(paths) {
    var totalDays = 0;
    var criticalPath = null;

    // get durations for each path
    var durations = paths.map(function(path) {
      return path.reduce(function(total, project) {
        return total + (project.days || 0);
      }, 0);
    });

    // get longest duration
    durations.forEach(function(d, i) {
      if (d > totalDays) {
        totalDays = d;
        criticalPath = paths[i];
      }
    });

    return {
      path: criticalPath,
      days: totalDays
    };
  }

  ProjectHelper.setDatesForProjects = function(projects) {
    for (var i=0; i < projects.length; i++) {
      var project = projects[i];

      if (project.startDate) {
        if (typeof(project.startDate) === 'string') {
          project.startDate = new Date(project.startDate);
        }
      }
      else {
        if (!project.startAfter && !project.finishWith) {
          project.startDate = new Date().toISOString();
        }
        else if (project.finishWith) {
          var tmp = getEndDateOfProject(projects, project.finishWith);
          project.startDate = DateHelper.addDaysToDate(tmp, -(project.days-1), project.includeWeekends);
        }
        else if (project.startAfter) {
          var tmp = getEndDateOfProject(projects, project.startAfter);
          project.startDate = DateHelper.addDaysToDate(tmp, 1, project.includeWeekends);
        }
      }

      var e = DateHelper.cloneDate(project.startDate);
      project.endDate = DateHelper.addDaysToDate(e, project.days-1, project.includeWeekends);
    }
  }

  /*** Private functions ***/

  function chainProjects(projects) {
    var paths = [];

    projects.forEach(function(p) {
      if (p.startAfter) {
        paths.forEach(function(path) {
          var found = findNodeInPath(path, p.startAfter);
          if (found) {
            var obj = Object.assign({ children: [] }, p);
            found.children.push(obj);
          }
        });
      }
      else if (p.startDate) {
        var obj = Object.assign({ children: [] }, p);
        var path = [ obj ];
        paths.push(path);
      }
    });

    return paths;
  }

  function findNodeInPath(path, id) {
    for (var i=0; i < path.length; i++) {
      if (path[i].id == id) {
        return path[i];
      }
      if (path[i].children.length) {
        return findNodeInPath(path[i].children, id);
      }
    }
  }

  function flattenPath(path, distinctPaths, trace) {
    if (!distinctPaths) distinctPaths = [];
    if (!trace) trace = [];

    for (var i=0; i < path.length; i++) {
      trace.push(path[i]);
      if (!path[i].children.length) { // end of tree
        distinctPaths.push(trace.slice(0));
      }
      else {
        flattenPath(path[i].children, distinctPaths, trace);
      }
      trace.pop();
    }

    return distinctPaths;
  }

  function findEarliestStartDate(paths) {
    var startDate;
    paths.forEach(function(path) {
      var s = typeof(path[0].startDate) === 'string' ? new Date(path[0].startDate) : path[0].startDate;
      if (!startDate || s < startDate) {
        startDate = s;
      }
    });
    return startDate;
  }

  function getEndDateOfProject(projects, id) {
    var project = projects.find(function(p) {
      return p.id == id;
    });

    if (!project) {
      return null;
    }

    if (project.endDate) {
      return DateHelper.cloneDate(project.endDate);
    }
    else if (project.startDate) {
      var tmp = DateHelper.cloneDate(project.startDate);
      return DateHelper.addDaysToDate(tmp, project.days-1, project.includeWeekends);
    }
    else if (project.finishWith) {
      var tmp = getEndDateOfProject(projects, project.finishWith);
      return DateHelper.addDaysToDate(tmp, -(project.days-1), project.includeWeekends);
    }
    else if (project.startAfter) {
      var tmp = getEndDateOfProject(projects, project.startAfter);
      return DateHelper.addDaysToDate(tmp, 1, project.includeWeekends);
    }
  }

  return ProjectHelper;
})
