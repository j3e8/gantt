angular.module('app').controller('projectsController', function($scope, ProjectHelper, DateHelper) {
  $scope.dayWidth = 60;

  $scope.projects = [
    {
      id: 1,
      name: "Migrate CE out of Dais",
      days: 16,
      startDate: '2018-08-07'
    },
    {
      id: 2,
      name: "Beta test new platform & do migration",
      days: 7,
      startAfter: 1
    },
    {
      id: 3,
      name: "Improve progress reporting",
      days: 1,
      finishWith: 1
    },
    {
      id: 4,
      name: "Finish event service",
      days: 5,
      startAfter: 2
    },
    {
      id: 5,
      name: "Add confirmation email to admins when a user accepts a voucher",
      days: 1,
      startAfter: 4
    },
    {
      id: 6,
      name: "Add an order history specific to the group",
      days: 1,
      startAfter: 1
    }
  ];


  // var paths = ProjectHelper.findAllPaths($scope.projects);
  // var range = ProjectHelper.getTimeRangeForPaths(paths);
  // $scope.calendar = DateHelper.getDateArrayFromRange(range.startDate, range.endDate);
  // console.log($scope.calendar);

  ProjectHelper.setDatesForProjects($scope.projects);

  var startDate, endDate;
  $scope.projects.forEach(function(project) {
    if (!startDate || project.startDate < startDate) {
      startDate = project.startDate;
    }
    if (!endDate || project.endDate > endDate) {
      endDate = project.endDate;
    }
  });

  $scope.calendar = DateHelper.getDateArrayFromRange(startDate, endDate);

  $scope.projects.forEach(function(project) {
    project.startDateIndex = findCalendarIndex(project.startDate);
    project.endDateIndex = findCalendarIndex(project.endDate);
  });

  function findCalendarIndex(date) {
    var found = $scope.calendar.find(function(c) {
      return c.date.toISOString() == date.toISOString();
    });
    if (found) {
      return $scope.calendar.indexOf(found);
    }
  }


  console.log($scope.projects);

});
