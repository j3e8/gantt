angular.module('app').service("DateHelper", function(SettingsService) {
  var DateHelper = {};

  var defaultOptions = Object.assign({}, SettingsService.settings);

  DateHelper.addDaysToDate = function(date, days, options) {
    options = options || defaultOptions;

    if (options.includeWeekends) {
      date.setUTCDate(date.getUTCDate() + days);
      return date;
    }

    var DAYS_IN_WORK_WEEK = 5;
    var weekday = date.getUTCDay();
    var fullWeeks = Math.floor(Math.abs(days) / DAYS_IN_WORK_WEEK);
    var weekendDays = fullWeeks * 2;
    var leftoverDays = Math.abs(days) % DAYS_IN_WORK_WEEK;

    if (days > 0) {
      for (var i=weekday; i < weekday + leftoverDays; i++) {
        if (i % 7 == 0 || i % 7 == 6) {
          weekendDays++;
        }
      }
      date.setUTCDate(date.getUTCDate() + days + weekendDays);
    }
    else {
      for (var i=weekday; i > weekday - leftoverDays; i--) {
        if (i % 7 == 0 || i % 7 == 6) {
          weekendDays--;
        }
      }
      date.setUTCDate(date.getUTCDate() + days - weekendDays);
    }
    return date;
  }

  DateHelper.cloneDate = function(date) {
    if (typeof(date) === 'string') {
      return new Date(date);
    }
    return new Date(date.toISOString());
  }

  DateHelper.getDateArrayFromRange = function(startDate, endDate) {
    if (typeof(startDate) === 'string') startDate = new Date(startDate);
    if (typeof(endDate) === 'string') endDate = new Date(endDate);

    var dates = [];

    var d = DateHelper.cloneDate(startDate);
    while (d <= endDate) {
      dates.push({
        date: DateHelper.cloneDate(d),
        day: d.getUTCDate(),
        dayOfWeek: d.getUTCDay(),
        isWeekend: d.getUTCDay() == 0 || d.getUTCDay() == 6,
        month: d.getUTCMonth() + 1,
        monthName: MonthNames[d.getUTCMonth()],
        year: d.getUTCFullYear()
      });
      d.setUTCDate(d.getUTCDate() + 1);
    }

    return dates;
  }

  /*** Private functions ***/
  var MonthNames = [
    {
      name: 'January',
      abbreviation: 'Jan'
    },
    {
      name: 'February',
      abbreviation: 'Feb'
    },
    {
      name: 'March',
      abbreviation: 'Mar'
    },
    {
      name: 'April',
      abbreviation: 'Apr'
    },
    {
      name: 'May',
      abbreviation: 'May'
    },
    {
      name: 'June',
      abbreviation: 'Jun'
    },
    {
      name: 'July',
      abbreviation: 'Jul'
    },
    {
      name: 'August',
      abbreviation: 'Aug'
    },
    {
      name: 'September',
      abbreviation: 'Sep'
    },
    {
      name: 'October',
      abbreviation: 'Oct'
    },
    {
      name: 'November',
      abbreviation: 'Nov'
    },
    {
      name: 'December',
      abbreviation: 'Dec'
    },
  ];

  return DateHelper;
});
