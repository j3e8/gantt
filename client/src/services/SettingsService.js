angular.module('app').service("SettingsService", function() {
  var SettingsService = {};

  SettingsService.settings = {
    includeWeekends: false,
    holidays: [
      'Labor Day',
      'July 24'
    ]
  }

  return SettingsService;
});
