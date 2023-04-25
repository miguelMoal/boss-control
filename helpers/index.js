const getDatePeriod = (period = "day") => {
  const now = new Date();
  if (period === "day") {
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0
    );
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    return { init: todayStart, end: todayEnd };
  }
};

const getDateLastDays = (days = 6) => {
  const now = new Date();

  const lastSevenDaysStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - days,
    0,
    0,
    0
  );

  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  return { init: lastSevenDaysStart, end: todayEnd };
};

module.exports = { getDatePeriod, getDateLastDays };
