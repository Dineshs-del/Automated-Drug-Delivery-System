export function checkVitalsAlerts(vital) {
  const alerts = [];

  if (vital.bp > 140) alerts.push("High BP detected");
  if (vital.sugar > 180) alerts.push("High sugar detected");
  if (vital.hr > 110) alerts.push("Abnormal heart rate");

  return alerts;
}
